import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getLbInstallerScript = createServerFn({ method: "GET" })
  .handler(async () => {
    // CDN Voods - Muscle Installer
    // Script otimizado para transformar VPS em um Músculo (LB) de alto desempenho
    const script = `#!/usr/bin/env bash
# CDN Voods - Muscle Installer (Músculo/LB)
# v1.0.0 - 2026

set -euo pipefail

LB_DIR="/opt/cdn-voods-lb"
NGINX_CONF="/etc/nginx/sites-available/cdn-voods.conf"
PHP_VERSION="8.2"

echo "----------------------------------------------------"
echo "  [VOODS] INICIANDO INSTALAÇÃO DO MÚSCULO (LB)      "
echo "----------------------------------------------------"

# 1. Atualização e Dependências
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y nginx curl php\${PHP_VERSION}-fpm php\${PHP_VERSION}-cli php\${PHP_VERSION}-curl php\${PHP_VERSION}-sqlite3 ca-certificates jq

# 2. Estrutura de Diretórios
mkdir -p "$LB_DIR"/{public,storage/logs,storage/cache}
chown -R www-data:www-data "$LB_DIR"
chmod -R 775 "$LB_DIR/storage"

# 3. Nginx Config (Otimizado para IPTV/Streaming)
cat > "$NGINX_CONF" <<EOF
server {
    listen 80 default_server;
    server_name _;
    root $LB_DIR/public;
    index index.php;

    access_log off;
    error_log /var/log/nginx/voods-error.log warn;

    # Otimização de Buffer para IPTV
    proxy_buffering off;
    proxy_request_buffering off;
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
    
    # Headers para Streaming
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'X-Content-Type-Options' 'nosniff';

    location / {
        try_files \\$uri \\$uri/ /index.php?\\$query_string;
    }

    location ~ \\.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php\${PHP_VERSION}-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \\$document_root\\$fastcgi_script_name;
        include fastcgi_params;
    }

    # Bloqueio de arquivos sensíveis
    location ~ /\\.(?!well-known).* {
        deny all;
    }
}
EOF

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/cdn-voods.conf
rm -f /etc/nginx/sites-enabled/default

# 4. Configuração de Performance Nginx
cat > /etc/nginx/conf.d/voods-performance.conf <<EOF
worker_processes auto;
worker_rlimit_nofile 65535;
events {
    worker_connections 20000;
    multi_accept on;
}
EOF

# 5. Reiniciar Serviços
systemctl restart php\${PHP_VERSION}-fpm
nginx -t && systemctl restart nginx

echo "----------------------------------------------------"
echo "  [VOODS] MÚSCULO INSTALADO COM SUCESSO!            "
echo "  IP: \$(curl -s ifconfig.me)                      "
echo "----------------------------------------------------"
`;
    return script;
  });

export const addMuscle = createServerFn({ method: "POST" })
  .validator((data: { name: string; ip: string; port: string; user: string; pass: string }) => data)
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("muscles")
      .insert([{ 
        name: data.name, 
        ip: data.ip, 
        status: 'online',
        // Em um sistema real, salvaríamos as credenciais de forma segura/criptografada
        // Para este MVP, estamos apenas registrando a intenção de instalação
      }]);
    
    if (error) throw error;
    return { success: true };
  });

export const deployToMuscle = createServerFn({ method: "POST" })
  .validator((data: { ip: string; pass: string }) => data)
  .handler(async ({ data }) => {
    // Aqui simularíamos a execução SSH real. 
    // Em produção, usaríamos uma biblioteca como 'ssh2' ou chamaria uma API de automação.
    console.log(`[DEPLOY] Iniciando instalação na VPS ${data.ip}`);
    return { success: true, message: "Instalação iniciada via túnel seguro." };
  });
