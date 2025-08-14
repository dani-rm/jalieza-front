# Guía de Despliegue - Jalieza Frontend

Este documento describe el proceso completo de despliegue del sitio web de Jalieza en un VPS con Ubuntu y Nginx.

## 📋 Resumen del Proyecto

- **Proyecto**: Sitio web turístico de Jalieza, Oaxaca
- **Tecnología**: Astro (SSG)
- **Servidor**: VPS Ubuntu con Nginx
- **Dominio**: jalieza.com.mx
- **SSL**: Let's Encrypt

## 🚀 Pasos del Despliegue

### 1. Preparación del Proyecto Local

#### 1.1 Build de Producción
```bash
cd /ruta/al/proyecto/jalieza-front
npm run build
```

#### 1.2 Verificar Build
```bash
ls -la dist/
# Deberías ver: index.html, _astro/, artesanias/, historia/, sobre-el-pueblo/, etc.
```

### 2. Configuración del Servidor VPS

#### 2.1 Conexión SSH
```bash
ssh jaliezaweb@66.179.94.34
```

#### 2.2 Crear Directorio del Proyecto
```bash
sudo mkdir -p /var/www/front-turismo
sudo chown jaliezaweb:jaliezaweb /var/www/front-turismo
```

#### 2.3 Verificar Node.js
```bash
node --version
npm --version
# Si no está instalado:
# curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
# sudo apt-get install -y nodejs
```

### 3. Transferencia de Archivos

#### 3.1 Desde Máquina Local
```bash
cd /ruta/al/proyecto/jalieza-front
scp -r dist/* jaliezaweb@66.179.94.34:/var/www/front-turismo/
```

#### 3.2 Verificar Transferencia
```bash
ls -la /var/www/front-turismo/
# Deberías ver todos los archivos del build
```

### 4. Configuración de Nginx

#### 4.1 Crear Configuración del Sitio
```bash
sudo nano /etc/nginx/sites-available/front-turismo
```

#### 4.2 Contenido de la Configuración
```nginx
# Redirección de www a no-www
server {
    listen 80;
    listen 443 ssl http2;
    server_name www.jalieza.com.mx;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/jalieza.com.mx/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jalieza.com.mx/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    # Redirigir www a no-www
    return 301 https://jalieza.com.mx$request_uri;
}

# Sitio principal
server {
    listen 80;
    listen 443 ssl http2;
    server_name jalieza.com.mx;
    
    root /var/www/front-turismo;
    index index.html;
    
    # Configuración para archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Configuración para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Configuración de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/jalieza.com.mx/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jalieza.com.mx/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

#### 4.3 Habilitar el Sitio
```bash
sudo ln -s /etc/nginx/sites-available/front-turismo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Configuración DNS

#### 5.1 En Cloudflare (o tu proveedor DNS)
Configurar los siguientes registros:

- **Tipo A**: `jalieza.com.mx` → `66.179.94.34` (Solo DNS)
- **Tipo A**: `www` → `66.179.94.34` (Solo DNS)

**Nota**: Eliminar cualquier registro CNAME de `www` que apunte a `jalieza.com.mx`

#### 5.2 Verificar Propagación DNS
```bash
nslookup jalieza.com.mx
nslookup www.jalieza.com.mx
# Deberían apuntar a 66.179.94.34
```

### 6. Configuración SSL/HTTPS

#### 6.1 Instalar Certbot
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

#### 6.2 Generar Certificado SSL
```bash
sudo certbot --nginx -d jalieza.com.mx -d www.jalieza.com.mx
```

#### 6.3 Verificar Certificado
```bash
sudo certbot certificates
sudo ls -la /etc/letsencrypt/live/
```

### 7. Verificación Final

#### 7.1 Probar Sitio Principal
```bash
curl -I https://jalieza.com.mx
```

#### 7.2 Probar Redirección www
```bash
curl -I https://www.jalieza.com.mx
# Debería devolver: HTTP/2 301 con Location: https://jalieza.com.mx/
```

#### 7.3 Verificar Archivos
```bash
ls -la /var/www/front-turismo/
```

## 🔧 Comandos Útiles de Mantenimiento

### Verificar Estado de Nginx
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Ver Logs de Nginx
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Renovar Certificado SSL
```bash
sudo certbot renew --dry-run
```

### Recargar Configuración
```bash
sudo systemctl reload nginx
```

## 📁 Estructura de Archivos en el Servidor

```
/var/www/front-turismo/
├── index.html
├── _astro/
├── artesanias/
├── historia/
├── sobre-el-pueblo/
├── background.webp
└── favicon.svg
```

## 🌐 URLs Finales

- **Sitio Principal**: https://jalieza.com.mx
- **Redirección**: https://www.jalieza.com.mx → https://jalieza.com.mx

## ⚠️ Notas Importantes

1. **Backup**: Siempre hacer backup antes de cambios importantes
2. **DNS**: Los cambios de DNS pueden tardar hasta 24 horas en propagarse
3. **SSL**: Los certificados se renuevan automáticamente cada 90 días
4. **Logs**: Revisar logs de Nginx si hay problemas
5. **Permisos**: Asegurar que los archivos tengan permisos correctos

## 🔄 Actualizaciones Futuras

Para actualizar el sitio:

1. Hacer build local: `npm run build`
2. Transferir archivos: `scp -r dist/* jaliezaweb@66.179.94.34:/var/www/front-turismo/`
3. Verificar: `curl -I https://jalieza.com.mx`

---

**Fecha de Despliegue**: 13 de Agosto, 2025  
**Versión**: 1.0  
**Responsable**: Equipo de Desarrollo Jalieza 