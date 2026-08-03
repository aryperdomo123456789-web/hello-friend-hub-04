<?php
// coloque este arquivo em: /home/xui/www
//
// nano /home/xui/bin/nginx/conf/nginx.conf
// access_log off -> access_log on
// touch /home/xui/bin/nginx/on
// chmod 777 /home/xui/bin/nginx/on
// /home/xui/bin/nginx/sbin/nginx -s reload
//
// acesse: http://ip_do_servidor/logs.php

$startTime = microtime(true);
ini_set('display_errors', '1');
error_reporting(E_ALL);

function getArg(string $name, $default = null) { return isset($_GET[$name]) ? $_GET[$name] : $default; }

function parseBrDate(string $s): ?array {
    $s = trim($s);
    if (!preg_match('~^(\d{2})/(\d{2})/(\d{4})$~', $s, $m)) return null;
    $d = (int)$m[1]; $mo = (int)$m[2]; $y = (int)$m[3];
    if (!checkdate($mo, $d, $y)) return null;
    return [$d, $mo, $y];
}

function monthNumToNginxMon(int $m): string {
    static $map = [1=>'Jan',2=>'Feb',3=>'Mar',4=>'Apr',5=>'May',6=>'Jun',7=>'Jul',8=>'Aug',9=>'Sep',10=>'Oct',11=>'Nov',12=>'Dec'];
    return $map[$m] ?? 'Jan';
}

// Read file from end and return only lines that match the given day (dd/Mon/yyyy).
function tailLinesForDay(string $file, string $dayToken, int $maxBytes = 80_000_000): array {
    $fh = @fopen($file, 'rb');
    if (!$fh) return [];

    $chunkSize = 1024 * 256; // 256KB
    fseek($fh, 0, SEEK_END);
    $pos = ftell($fh);

    $buffer = '';
    $lines = [];
    $seenMatch = false;
    $readBytes = 0;

    // Extract date token from log: [06/Jan/2026:...
    $reDate = '/\[(\d{2}\/[A-Za-z]{3}\/\d{4}):/';

    while ($pos > 0) {
        $readSize = ($pos >= $chunkSize) ? $chunkSize : $pos;
        $pos -= $readSize;

        fseek($fh, $pos, SEEK_SET);
        $chunk = fread($fh, $readSize);
        if ($chunk === false) break;

        $buffer = $chunk . $buffer;
        $readBytes += $readSize;

        // Safety cap
        if ($readBytes > $maxBytes) break;

        // Process full lines from the end of buffer
        $buffer = str_replace("\r\n", "\n", $buffer);
        $parts = explode("\n", $buffer);

        // Keep first element as "incomplete" (might be partial line) and process the rest
        $buffer = array_shift($parts);

        // We are reading older->newer inside $parts, but those parts are earlier in file.
        // We want to scan from newest backward, so reverse the chunk lines.
        for ($i = count($parts) - 1; $i >= 0; $i--) {
            $line = $parts[$i];
            if ($line === '') continue;

            if (!preg_match($reDate, $line, $m)) {
                // If no timestamp, ignore (or include if you want)
                continue;
            }

            $lineDay = $m[1]; // dd/Mon/yyyy
            if ($lineDay === $dayToken) {
                $seenMatch = true;
                $lines[] = $line;
                continue;
            }

            // We already collected some lines from the target day, and now we hit an older day => stop.
            if ($seenMatch && $lineDay !== $dayToken) {
                fclose($fh);
                // Currently $lines is newest->older (because we iterated backwards). Reverse to original order.
                $lines = array_reverse($lines);
                return $lines;
            }
        }
    }

    fclose($fh);

    // If we reached the start, just return what we found
    $lines = array_reverse($lines);
    return $lines;
}

$file = (string)getArg('file', '/home/xui/bin/nginx/on');
$top  = (int)getArg('top', 15);

// Date input (dd/mm/yyyy) default today in Sao Paulo
date_default_timezone_set('America/Sao_Paulo');
$defaultDate = date('d/m/Y');
$dateStr = (string)getArg('date', $defaultDate);

$parsed = parseBrDate($dateStr);
if (!$parsed) {
    http_response_code(400);
    echo "ERROR: Invalid date. Use dd/mm/yyyy.";
    exit;
}
[$d, $mo, $y] = $parsed;
$dayToken = sprintf('%02d/%s/%04d', $d, monthNumToNginxMon($mo), $y);

if ($top <= 0) $top = 15;

if (!is_file($file) || !is_readable($file)) {
    http_response_code(400);
    echo "ERROR: Log file not found or not readable: " . htmlspecialchars($file, ENT_QUOTES, 'UTF-8');
    exit;
}

// Read only target-day lines
$lines = tailLinesForDay($file, $dayToken);

// username => [ip => true]
$ipsByUser = [];

// Match:
// IP ... "GET /movie/USERNAME/PASSWORD/... HTTP/1.1"
// IP ... "GET /series/USERNAME/PASSWORD/... HTTP/1.1"
$re = '/^(\S+)\s+\S+\s+\S+\s+\[[^\]]+\]\s+"[A-Z]+\s+\/(movie|series)\/([^\/\s]+)\/[^"\s]*\s+HTTP\/[0-9.]+"\s+/';

foreach ($lines as $line) {
    if ($line === '') continue;
    if (!preg_match($re, $line, $m)) continue;

    $ip = $m[1];
    $user = $m[3];

    if (!isset($ipsByUser[$user])) $ipsByUser[$user] = [];
    $ipsByUser[$user][$ip] = true;
}

// Build rows with counts + ip list
$rows = [];
foreach ($ipsByUser as $user => $ipSet) {
    $ipList = array_keys($ipSet);
    sort($ipList, SORT_NATURAL);
    $rows[] = ['user' => $user, 'count' => count($ipList), 'ips' => $ipList];
}

// Sort by count desc
usort($rows, function($a, $b) { return $b['count'] <=> $a['count']; });

// Apply top
$rows = array_slice($rows, 0, $top);

$executionTime = round(microtime(true) - $startTime, 3);

// Prepare JSON for modal usage
$ipsJson = [];
foreach ($rows as $r) $ipsJson[$r['user']] = $r['ips'];

?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Analyze IPs by User</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-dark text-light">
  <div class="container py-4">
    <div class="mb-4">
      <h3 class="mb-2">Analyze IPs by User</h3>

      <form method="get" class="d-flex flex-column gap-2 mb-4" style="max-width:420px">
        <div class="input-group input-group-sm">
          <span class="input-group-text bg-secondary text-light border-secondary">Path to file</span>
          <input type="text" name="file" class="form-control bg-dark text-light border-secondary" value="<?php echo htmlspecialchars($file, ENT_QUOTES, 'UTF-8'); ?>">
        </div>

        <div class="input-group input-group-sm">
          <span class="input-group-text bg-secondary text-light border-secondary">Date (dd/mm/yyyy)</span>
          <input type="text" name="date" class="form-control bg-dark text-light border-secondary" value="<?php echo htmlspecialchars($dateStr, ENT_QUOTES, 'UTF-8'); ?>">
        </div>

        <div class="input-group input-group-sm">
          <span class="input-group-text bg-secondary text-light border-secondary">Results</span>
          <input type="number" name="top" class="form-control bg-dark text-light border-secondary" min="1" value="<?php echo (int)$top; ?>">
        </div>

        <button class="btn btn-sm btn-primary align-self-start">Reload</button>
      </form>
    </div>

    <div class="card bg-black border-secondary">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr>
                <th style="width:70px">#</th>
                <th>Username</th>
                <th style="width:180px">Unique IPs</th>
              </tr>
            </thead>
            <tbody>
              <?php if (count($rows) === 0): ?>
                <tr><td colspan="3" class="text-center text-secondary py-4">No /movie/ or /series/ matches found for <?php echo htmlspecialchars($dayToken, ENT_QUOTES, 'UTF-8'); ?>.</td></tr>
              <?php else: ?>
                <?php foreach ($rows as $idx => $r): ?>
                  <tr>
                    <td class="text-secondary"><?php echo $idx + 1; ?></td>
                    <td class="fw-semibold"><?php echo htmlspecialchars($r['user'], ENT_QUOTES, 'UTF-8'); ?></td>
                    <td>
                      <button type="button" class="btn btn-sm btn-outline-info ip-btn" data-user="<?php echo htmlspecialchars($r['user'], ENT_QUOTES, 'UTF-8'); ?>">
                        <?php echo (int)$r['count']; ?> unique IPs
                      </button>
                    </td>
                  </tr>
                <?php endforeach; ?>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="text-secondary small mt-3">• Day: <?php echo htmlspecialchars($dateStr, ENT_QUOTES, 'UTF-8'); ?> • Took <?php echo $executionTime; ?>s</div>
  </div>

  <div class="modal fade" id="ipModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content bg-dark text-light border-secondary">
        <div class="modal-header border-secondary">
          <h5 class="modal-title">IPs for <span id="modalUser" class="text-info"></span></h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div class="text-secondary small">Total: <span id="modalCount" class="text-light"></span></div>
            <button class="btn btn-sm btn-outline-light" id="copyAllBtn" type="button">Copy all</button>
          </div>
          <div class="list-group" id="ipList"></div>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    const IPS_BY_USER = <?php echo json_encode($ipsJson, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>;
    const ipModalEl = document.getElementById('ipModal');
    const ipModal = new bootstrap.Modal(ipModalEl);
    const modalUser = document.getElementById('modalUser');
    const modalCount = document.getElementById('modalCount');
    const ipList = document.getElementById('ipList');
    const copyAllBtn = document.getElementById('copyAllBtn');

    function esc(s){return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

    document.querySelectorAll('.ip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const user = btn.getAttribute('data-user');
        const ips = IPS_BY_USER[user] || [];

        modalUser.textContent = user;
        modalCount.textContent = ips.length;

        ipList.innerHTML = ips.length ? ips.map(ip => `<div class="list-group-item bg-black text-light border-secondary d-flex justify-content-between align-items-center"><span class="font-monospace">${esc(ip)}</span><button type="button" class="btn btn-sm btn-outline-secondary copy-ip" data-ip="${esc(ip)}">Copy</button></div>`).join('') : `<div class="text-secondary">No IPs.</div>`;

        ipModal.show();
      });
    });

    ipList.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-ip');
      if (!btn) return;
      const ip = btn.getAttribute('data-ip') || '';
      if (!ip) return;
      navigator.clipboard?.writeText(ip);
      btn.textContent = 'Copied';
      btn.classList.remove('btn-outline-secondary');
      btn.classList.add('btn-outline-success');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.add('btn-outline-secondary'); btn.classList.remove('btn-outline-success'); }, 900);
    });

    copyAllBtn.addEventListener('click', () => {
      const user = modalUser.textContent;
      const ips = IPS_BY_USER[user] || [];
      const text = ips.join("\n");
      if (!text) return;
      navigator.clipboard?.writeText(text);
      copyAllBtn.textContent = 'Copied';
      setTimeout(() => copyAllBtn.textContent = 'Copy all', 900);
    });
  </script>
</body>
</html>
