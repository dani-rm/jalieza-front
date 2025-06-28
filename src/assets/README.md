# Estructura de Assets - Jalieza Front

## 📁 Organización Óptima

### `src/assets/` (Archivos procesados y optimizados)
```
src/assets/
├── images/                    # Imágenes principales
│   ├── gallery/              # Galería de fotos
│   │   ├── atractivos/       # Lugares turísticos
│   │   ├── gastronomia/      # Comida y bebidas
│   │   ├── artesanias/       # Productos artesanales
│   │   └── eventos/          # Festivales y celebraciones
│   ├── hero/                 # Imágenes para secciones hero
│   └── content/              # Imágenes de contenido
├── icons/                    # Iconos SVG
│   ├── social/              # Redes sociales
│   ├── navigation/          # Navegación
│   └── ui/                  # Interfaz de usuario
└── logos/                   # Logos y marcas
    ├── jalieza-logo.svg
    └── partners/            # Logos de socios
```

### `public/` (Archivos estáticos sin procesar)
```
public/
├── favicon.svg              # Favicon principal
├── favicon.ico              # Favicon legacy
├── background.webp          # Imágenes de fondo grandes
├── robots.txt              # SEO
└── sitemap.xml             # SEO
```

## 🚀 Ventajas de esta estructura:

### ✅ **Categorización clara:**
- **Por tipo**: `images/`, `icons/`, `logos/`
- **Por función**: `gallery/`, `hero/`, `content/`
- **Por tema**: `atractivos/`, `gastronomia/`, `artesanias/`

### ✅ **Escalabilidad:**
- Fácil agregar nuevas categorías
- Estructura predecible
- Mantenimiento sencillo

### ✅ **Rendimiento:**
- Optimización automática en `src/assets/`
- Archivos estáticos en `public/` para casos específicos 