import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export const getLbInstallerScript = createServerFn({ method: "GET" })
  .handler(async () => {
    // Em um cenário real, este script seria gerado dinamicamente com tokens de pareamento
    const script = `#!/usr/bin/env bash
# CDN Voods - Muscle Installer
# Este script transforma sua VPS em um Load Balancer protegido.

set -euo pipefail

LB_DIR="/opt/cdn-voods-lb"
NGINX_CONF="/etc/nginx/sites-available/cdn-voods.conf"

echo "[Voods] Iniciando instalação do Músculo..."

# 1. Dependências
apt-get update
apt-get install -y nginx curl php-fpm php-cli php-curl php-sqlite3 ca-certificates

# 2. Estrutura
mkdir -p "$LB_DIR"/{public,storage/logs,storage/cache}
chown -R www-data:www-data "$LB_DIR/storage"

# 3. Nginx Config (Otimizado para IPTV)
cat > "$NGINX_CONF" <<EOF
server {
    listen 80 default_server;
    server_name _;
    root $LB_DIR/public;
    index index.php;

    access_log off;
    error_log /var/log/nginx/voods-error.log warn;

    location / {
        # Configurações de Proxy IPTV
        proxy_buffering off;
        proxy_read_timeout 3600s;
        
        # Aqui entra a lógica de reescrita que o Cérebro enviará
        try_files \\$uri \\$uri/ /index.php?\\$query_string;
    }
}
EOF

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/cdn-voods.conf
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx

echo "[Voods] Músculo instalado com sucesso! IP: \\$(curl -s ifconfig.me)"
`;
    return script;
  });

export const addMuscle = createServerFn({ method: "POST" })
  .validator((data: { name: string; ip: string; sourceId: string }) => data)
  .handler(async ({ data }) => {
    const { error } = await supabase
      .from("muscles")
      .insert([{ 
        name: data.name, 
        ip: data.ip, 
        source_id: data.sourceId, 
        status: 'online' 
      }]);
    
    if (error) throw error;
    return { success: true };
  });
