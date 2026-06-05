# Jerobook Frontend

Bienvenido al frontend de **Jerobook**, una red social orientada a grafos. Este proyecto fue desarrollado enfocándose en un diseño premium, moderno y escalable.

## 🚀 Tecnologías Principales

El proyecto utiliza un stack ágil para garantizar el mejor rendimiento y la mejor experiencia tanto de desarrollo como de usuario:

- **[React 19](https://react.dev/)**: Librería principal para la construcción de interfaces de usuario.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado estático robusto para la manipulación de datos que provienen de la base de grafos (Neo4j).
- **[Vite](https://vitejs.dev/)**: Bundler ultrarrápido para el desarrollo y optimización de la build final.
- **[GSAP (GreenSock)](https://gsap.com/)**: Motor de animaciones profesional. Usado mediante `@gsap/react` para transiciones fluidas de entrada, el splash screen interactivo de carga, y los efectos visuales complejos sin comprometer los frames por segundo.
- **[Lucide React](https://lucide.dev/)**: Colección de íconos modernos y consistentes.
- **Estilos / Variables CSS**: Se optó por una arquitectura de CSS puro y variables nativas en `global.css` en lugar de frameworks bloqueantes como Tailwind. Esto permite tener control absoluto del renderizado (ej. el efecto Glassmorphism) y soportar el cambio dinámico entre un Tema Claro (Discord-like) y Oscuro preservando una paleta de acentos refinados (Verde Esmeralda y Dorado).

## 📦 Ejecutar Localmente

Asegúrate de tener Node.js instalado en tu entorno y el Backend de Jerobook (puerto 4000) ejecutándose.

1. **Variables de entorno:**
   Crea o verifica el archivo `.env` en este directorio:
   ```env
   VITE_API_URL=http://localhost:4000
   ```

2. **Instalación:**
   Recomendamos usar PNPM vía Corepack, o en su defecto, NPM estándar:
   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Desarrollo:**
   ```bash
   pnpm dev
   # o
   npm run dev
   ```
   La plataforma estará disponible en [http://localhost:5173](http://localhost:5173).

## 🏗️ Estructura del Código

```txt
src/
├── api/              # Configuración base del Fetch hacia el backend.
├── app/              # Layout base (AppLayout) y ruteo/estado de las vistas activas.
├── components/       
│   ├── entities/     # Vistas principales de dominio: Feed, Explorar, Grupos, Eventos y Perfil.
│   ├── layout/       # Componentes de envoltorio: Sidebar (con logo en SVG).
│   └── ui/           # Componentes base: Avatares, Hero de Portada, Splash animado, Drawers.
├── config/           # Constantes y mapa de navegación.
├── hooks/            # Hooks de React (SWR-like custom) para encapsular las llamadas al backend.
├── services/         # Las funciones crudas de requests REST al backend.
├── styles/           # Archivos CSS organizados en variables globales y layouts específicos.
└── types/            # Definición exhaustiva de interfaces del grafo y red social.
```

## 🎨 Aspectos de Implementación UI/UX

- **Componentización:** La interfaz fue separada rigurosamente. En lugar de vistas de miles de líneas, `AppLayout` maneja el estado general, mientras que subcomponentes como `ProfileDrawer` y `EntityViews` se encargan de la presentación. Toda la lógica del backend es inyectada desde los Custom Hooks (`hooks/useFeed.ts`, `hooks/useEntityActions.ts`).
- **Aspecto Visual Premium:** Se eliminaron las interfaces que asemejan paneles de administración básicos. En cambio, se implementó:
  - Componentes `ViewHero` con imágenes de portada abstractas adaptativas para cada vista (Eventos, Explorar, Perfil).
  - Sombras sutiles, bordes de radio medido (10px - 12px) y líneas divisorias de opacidad muy baja (5%) para remover la rigidez visual.
  - El logo del "Potro" (`PotroLogo.tsx`) renderizado en `<svg>` que emula la topología de un grafo.
- **Rendimiento de Animaciones:** Al usar `GSAP`, todas las animaciones se hacen mediante mutaciones a variables CSS de bajo nivel o Transformaciones 3D aceleradas por GPU, evitando los renderizados innecesarios del Virtual DOM de React.

## 🛠️ Comandos de Construcción

- `npm run build` o `pnpm build`: Verifica el TypeScript y compila para producción.
- `npm run preview` o `pnpm preview`: Previsualiza la aplicación tal como se vería en producción.
