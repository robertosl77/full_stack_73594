# StreamingApp - Plataforma de Películas

## 🎬 Descripción
Aplicación web de streaming que permite explorar un catálogo de películas con información detallada. Desarrollada con React y React Router.

## 🚀 Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone <tu-repositorio>
cd streaming-app
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**
Crear un archivo `.env` en la raíz del proyecto:
\`\`\`env
REACT_APP_OMDB_API_KEY=29d19341
\`\`\`

4. **Ejecutar la aplicación**
\`\`\`bash
npm start
\`\`\`

## 🔧 Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `REACT_APP_OMDB_API_KEY` | API Key de OMDB para obtener datos de películas | ✅ |

## 📁 Estructura del Proyecto

\`\`\`
src/
├── App.jsx              # Router principal
├── Home.jsx             # Página principal
├── Catalog.jsx          # Catálogo de películas
├── MovieDetail.jsx      # Detalles de película
├── Navbar.jsx           # Navegación
└── Funciones.jsx # Componente para imágenes no disponibles
\`\`\`

## 🎯 Funcionalidades

- ✅ Página principal con descripción de la plataforma
- ✅ Catálogo completo de películas con búsqueda
- ✅ Detalles completos de cada película
- ✅ Navegación fluida entre páginas
- ✅ Diseño responsivo
- ✅ Manejo de errores de imágenes

## 🛠️ Tecnologías

- React 18
- React Router DOM
- CSS3 (Styled Components inline)
- OMDB API

## 📱 Rutas

- `/` - Página principal
- `/catalogo` - Catálogo de películas
- `/pelicula/:id` - Detalles de película específica

## 🔒 Seguridad

- API Keys almacenadas en variables de entorno
- Validación de datos de la API
- Manejo de errores robusto
