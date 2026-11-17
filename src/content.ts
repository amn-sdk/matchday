// Single source of truth for all portfolio content.
// Edit this file to update text, links, projects and experience.

export const profile = {
  name: 'Amine Saddik',
  firstName: 'Amine',
  initials: 'AS',
  title: 'Software Engineer',
  eyebrow: 'Software Engineer · AI · 3D',
  headline: 'I build intelligent software.',
  focus: ['Artificial Intelligence', 'Software Engineering', '3D Technologies'],
  school: 'Computer Science & Engineering · ESIEE Paris',
  location: 'Paris, France',
  availability: 'Seeking a full-time software role in the U.S. from September 2027',
  summary:
    'Engineering student at ESIEE Paris (class of 2027) and IT project manager apprentice at the French Ministry of the Interior. I combine hands-on software development with end-to-end project delivery, from requirements to production.',
  about: [
    "I'm a Computer Science & Engineering student at ESIEE Paris, specializing in artificial intelligence, software engineering and 3D technologies. I study in a work-study program, which means I split my time between school and a real engineering job.",
    'At the French Ministry of the Interior, I manage IT projects end to end: gathering business requirements, coordinating developers and stakeholders, following integration and deployment, and handling security accreditation. I also founded A.I Cyber Cloud Consulting, a small IT consulting company focused on cybersecurity, cloud and AI.',
    "On the technical side, I enjoy building things that run: real-time 3D renderers in OpenGL, game AI with Monte Carlo simulations, and full-stack platforms deployed with Docker and Kubernetes. I'm now looking for a software engineering role in the United States.",
  ],
  email: 'aminesdh.pro@gmail.com',
  phones: [
    { label: 'France', display: '+33 7 81 43 20 96', tel: '+33781432096' },
    { label: 'United States', display: '+1 (657) 709-9614', tel: '+16577099614' },
  ],
  links: {
    github: 'https://github.com/amn-sdk',
    linkedin: 'https://www.linkedin.com/in/amine-saddik-070306267/',
    resume: '#/resume',
    site: 'https://amn-sdk.github.io/',
    matchday: 'https://amn-sdk.github.io/matchday/',
  },
  languages: [
    { name: 'French', level: 'Native' },
    { name: 'English', level: 'Advanced (C1)' },
    { name: 'German', level: 'Intermediate (B1)' },
  ],
  interests: ['Football', 'Music'],
}

/** Resume page: English on the left, French on the right (mirror layout). */
export const resumes = [
  {
    lang: 'en',
    flag: 'EN',
    language: 'English',
    heading: 'Resume',
    role: 'IT Project Manager · Software, Cloud & AI',
    pdf: 'resume/Amine-Saddik-Resume-EN.pdf',
    preview: 'resume/preview-en.jpg',
    open: 'Open PDF',
    download: 'Download',
    aboutTitle: 'About me',
    about: [
      "I'm a Computer Science & Engineering student at ESIEE Paris (class of 2027), currently at UC Irvine for an international business program. For three years I have delivered IT projects in the public sector and as the founder of an IT consulting firm: 8 projects taken from business requirements to production, budgets and stakeholders managed, and 286 cameras deployed in France and the UK.",
      "I write software too: Python, Java, cloud and AI, with Docker and AWS. I'm looking for a full-time role in the United States from September 2027.",
    ],
  },
  {
    lang: 'fr',
    flag: 'FR',
    language: 'Français',
    heading: 'CV',
    role: 'Chef de projet IT & IA',
    pdf: 'resume/Amine-Saddik-CV-FR.pdf',
    preview: 'resume/preview-fr.jpg',
    open: 'Ouvrir le PDF',
    download: 'Télécharger',
    aboutTitle: 'À propos de moi',
    about: [
      "Étudiant ingénieur en informatique à l'ESIEE Paris (diplôme en 2027), actuellement à UC Irvine pour un semestre en business international. Depuis trois ans, je pilote des projets IT au Ministère de l'Intérieur et comme fondateur d'une société de conseil : 8 projets menés du besoin métier à la mise en production, des budgets et des parties prenantes gérés, et 286 caméras déployées en France et au Royaume-Uni.",
      "Je développe aussi : Python, Java, cloud et IA, avec Docker et AWS. Je recherche un CDI dans l'informatique, en particulier en intelligence artificielle, à partir de septembre 2027.",
    ],
  },
] as const

export type CategoryId = 'ai' | 'software' | '3d' | 'cloud'

export const categories: { id: CategoryId; title: string; subtitle: string }[] = [
  { id: 'ai', title: 'AI & Machine Learning', subtitle: 'Models · Python · Data' },
  { id: 'software', title: 'Software Engineering', subtitle: 'Apps · APIs · Systems' },
  { id: '3d', title: '3D & Interactive', subtitle: 'OpenGL · Unity · Graphics' },
  { id: 'cloud', title: 'Cloud & Automation', subtitle: 'Docker · Kubernetes · CI/CD' },
]

export interface Project {
  slug: string
  title: string
  tagline: string
  context: string
  year: string
  categories: CategoryId[]
  tags: string[]
  kind: 'Team project' | 'Duo project' | 'Solo project' | 'Personal project' | 'Coursework'
  team?: string[]
  role: string
  problem: string
  choices: { name: string; why: string }[]
  architecture: { label: string; sub: string }[]
  challenges: { problem: string; solution: string }[]
  results: { title: string; detail: string }[]
  stack: string[]
  learned: string
  repo?: string
  repoNote?: string
  /** Illustrated cover (cards and fallback). */
  image?: string
  /** Real screenshots, shown in the Demo section of the project page. */
  gallery?: string[]
  /** Short muted screen recording, shown in the laptop frame and the Demo section. */
  video?: string
  /** Presentation slides (images), shown as a deck in the Demo section. */
  slides?: string[]
  slidesNote?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    slug: 'maroctour',
    title: 'MarocTour',
    tagline:
      'A full-stack tourism platform for Morocco with an interactive vector map, city guides, cultural quizzes and leaderboards.',
    context: 'ESIEE Paris · Year 4 · DevOps course',
    year: '2025',
    categories: ['cloud', 'software'],
    tags: ['DevOps', 'Full-stack', 'Kubernetes'],
    kind: 'Team project',
    team: ['Amirhossein Pouyanfar', 'Amine Ladel', 'Yacine Housny', 'Driss Driyej', 'Amine Saddik'],
    role:
      'Repository owner and top contributor (48 commits). I built the city pages for Meknès (content, routing, quiz and leaderboard), ran the pre-production checks, and created the project documentation site with Quartz.',
    problem:
      'Build a production-style web platform in a team of five, with a real delivery pipeline: containerized services, automated CI/CD, and deployment on Kubernetes.',
    choices: [
      { name: 'Next.js + MapLibre GL', why: 'for server rendering and a fast interactive vector map' },
      { name: 'FastAPI + SQLModel', why: 'for a typed, documented (OpenAPI) backend' },
      { name: 'PostgreSQL, Redis, MinIO', why: 'for data, caching/sessions and S3-compatible storage' },
      { name: 'Docker, Kubernetes, Helm', why: 'for reproducible environments and deployment' },
      { name: 'GitHub Actions + Argo CD', why: 'for CI/CD and GitOps-style delivery' },
    ],
    architecture: [
      { label: 'Next.js app', sub: 'SSR · map · i18n' },
      { label: 'FastAPI', sub: 'REST · auth' },
      { label: 'PostgreSQL', sub: 'SQLModel · Alembic' },
      { label: 'Kubernetes', sub: 'Helm · Argo CD' },
    ],
    challenges: [
      { problem: 'Coordinating five developers', solution: 'Feature branches and pull requests for every change (80+ merged PRs)' },
      { problem: 'Multilingual content', solution: 'i18n message files for French, English and Arabic' },
      { problem: 'Shipping safely', solution: 'Pre-production checklist and automated CI on each push' },
    ],
    results: [
      { title: '5 cities live', detail: 'Fès, Nador, Casablanca, Kénitra and Meknès, each with a guide, quiz and leaderboard' },
      { title: '3 languages', detail: 'French, English and Arabic' },
      { title: 'Documented', detail: 'Lab reports and architecture published on a Quartz documentation site' },
    ],
    stack: ['TypeScript', 'Next.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'GitHub Actions'],
    learned:
      'How a real delivery pipeline fits together, and how much clear pull requests and documentation matter when five people work on the same codebase.',
    repo: 'https://github.com/amn-sdk/MarocTour',
    image: 'images/projects/maroctour.jpg',
    gallery: ['images/projects/maroctour-shot-1.jpg', 'images/projects/maroctour-shot-2.jpg', 'images/projects/maroctour-shot-3.jpg'],
    video: 'videos/maroctour.mp4',
    featured: true,
  },
  {
    slug: 'opengl-renderer',
    title: 'Interactive OpenGL Renderer',
    tagline:
      'A real-time 3D scene in modern OpenGL with environment mapping, Phong lighting, post-processing and two camera modes.',
    context: 'ESIEE Paris · Year 4 · Computer Graphics',
    year: '2026',
    categories: ['3d'],
    tags: ['Computer Graphics', 'C++', 'GLSL'],
    kind: 'Team project',
    team: ['Amine Saddik', 'Yassine Housny', 'Kevin Sutia'],
    role: 'Co-developed the renderer: scene setup, shaders and camera system.',
    problem:
      'Render and navigate a 3D scene with several materials and lighting models, using only the core techniques of modern OpenGL.',
    choices: [
      { name: 'OpenGL 3.3 Core', why: 'with VAO/VBO, UBO and instancing' },
      { name: 'GLSL shaders', why: 'for Phong lighting and reflective materials' },
      { name: 'Cubemap', why: 'for the skybox and environment mapping' },
      { name: 'Framebuffer objects', why: 'for screen-space post-processing' },
    ],
    architecture: [
      { label: 'Scene', sub: 'OBJ meshes · cubemap' },
      { label: 'Geometry pass', sub: 'VAO · UBO · instancing' },
      { label: 'Shading', sub: 'Phong · Fresnel' },
      { label: 'Post-process', sub: 'FBO · filters' },
    ],
    challenges: [
      { problem: 'Convincing metallic look', solution: 'Environment mapping with Schlick’s Fresnel approximation' },
      { problem: 'Adjustable rim light', solution: 'Back-lighting term exposed as a live control (I / O keys)' },
      { problem: 'Exploring the scene', solution: 'Orbit and free cameras with switchable targets' },
    ],
    results: [
      { title: 'Reflective dragon', detail: 'Central model lit by the environment, with Fresnel and back-lighting' },
      { title: '4 render modes', detail: 'Normal, grayscale, sepia and inverted, switched at runtime' },
      { title: 'Runs on macOS', detail: 'Built with a single script and tested on Apple hardware' },
    ],
    stack: ['C++', 'OpenGL 3.3', 'GLSL', 'GLM', 'Phong', 'Cubemaps', 'FBO'],
    learned: 'The full GPU pipeline, from buffers and uniforms to shading and post-processing, and how small lighting terms change perceived realism.',
    repo: 'https://github.com/amn-sdk/ComputerGraphic',
    featured: true,
    image: 'images/projects/opengl.jpg',
  },
  {
    slug: 'tron-ai',
    title: 'Tron AI',
    tagline:
      'A Tron light-cycle game with Monte Carlo agents accelerated by Numba, multiple arenas, portals and a 3-floor map.',
    context: 'ESIEE Paris · Year 3 · AI for Games',
    year: '2025',
    categories: ['ai'],
    tags: ['Game AI', 'Monte Carlo', 'Python'],
    kind: 'Duo project',
    team: ['Amine Saddik', 'Auguste Sagaert'],
    role: 'Co-developed the game and its extensions, including the AI strategies and game modes.',
    problem:
      'Make an AI that plays Tron well by simulating thousands of possible futures every turn, fast enough to stay interactive in Python.',
    choices: [
      { name: 'Monte Carlo simulations', why: 'to evaluate each move from thousands of random playouts' },
      { name: 'Numba', why: 'to compile and parallelize the simulations in Python' },
      { name: '“Territory” heuristic', why: 'to pick the move that maximizes reachable free space' },
      { name: 'Tkinter', why: 'for the configuration menu' },
    ],
    architecture: [
      { label: 'Game state', sub: 'Grid · trails' },
      { label: 'Simulations', sub: 'Numba · parallel' },
      { label: 'Strategy', sub: 'Random · territory' },
      { label: 'Renderer', sub: 'Arena · menu' },
    ],
    challenges: [
      { problem: 'Python is slow for simulations', solution: 'Numba JIT compilation and parallel playouts' },
      { problem: 'AI vs AI duels', solution: 'Territory strategy that accounts for the opponent’s trail' },
      { problem: 'Keeping games interesting', solution: 'Portals, disappearing trails and a 3-floor map with stairs' },
    ],
    results: [
      { title: '4 arenas', detail: 'Normal, obstacles, maze and cavities, loaded dynamically' },
      { title: '3 game modes', detail: 'Human vs AI, solo, and AI vs AI duel' },
      { title: 'Configurable', detail: 'Number of simulations, strategy and trail lifetime set from the menu' },
    ],
    stack: ['Python', 'Numba', 'NumPy', 'Tkinter'],
    learned: 'How search-based AI trades compute for quality, and how to profile and speed up Python code.',
    repo: 'https://github.com/amn-sdk/projet-ia-et-jeux-sagaert-saddik-main',
    image: 'images/projects/tron.jpg',
    gallery: ['images/projects/tron-shot-1.jpg', 'images/projects/tron-shot-2.jpg', 'images/projects/tron-shot-3.jpg'],
    video: 'videos/tron.mp4',
    featured: true,
  },
  {
    slug: 'facturezen',
    title: 'FactureZen',
    tagline:
      'A multi-tenant SaaS for quotes, invoices and contracts, with high-fidelity DOCX-to-PDF generation.',
    context: 'Personal project',
    year: '2025',
    categories: ['software', 'cloud'],
    tags: ['SaaS', 'Full-stack', 'Multi-tenant'],
    kind: 'Personal project',
    role: 'Designed and built the application: architecture, backend, frontend and infrastructure.',
    problem:
      'Small businesses need compliant quotes and invoices that look exactly like their own Word templates, with strict data isolation between companies.',
    choices: [
      { name: 'PostgreSQL Row Level Security', why: 'to isolate each company’s data at the database level' },
      { name: 'Celery + Redis', why: 'to generate documents asynchronously' },
      { name: 'docxtpl + Gotenberg', why: 'to turn DOCX templates into pixel-perfect PDFs' },
      { name: 'Next.js 15 + shadcn/ui', why: 'for a fast, accessible interface' },
    ],
    architecture: [
      { label: 'Next.js', sub: 'App Router · UI' },
      { label: 'FastAPI', sub: 'Async · SQLAlchemy' },
      { label: 'Workers', sub: 'Celery · Gotenberg' },
      { label: 'Storage', sub: 'PostgreSQL · MinIO' },
    ],
    challenges: [
      { problem: 'Tenant data isolation', solution: 'Row Level Security policies in PostgreSQL' },
      { problem: 'Faithful PDF output', solution: 'DOCX templating rendered by Gotenberg in a worker queue' },
      { problem: 'Accounting needs', solution: 'Accountant workspace, FEC/CSV exports and period locking' },
    ],
    results: [
      { title: 'Audit trail', detail: 'Document version history and traceable changes' },
      { title: 'Tested', detail: 'pytest (async) on the backend, Vitest on the frontend' },
      { title: 'CI/CD', detail: 'GitHub Actions for lint, tests and build; Kubernetes manifests' },
    ],
    stack: ['TypeScript', 'Next.js', 'Tailwind CSS', 'FastAPI', 'PostgreSQL', 'Celery', 'Redis', 'Docker'],
    learned: 'How to design a multi-tenant system and move slow work (document rendering) out of the request path.',
    repo: 'https://github.com/amn-sdk/FactureZen',
    image: 'images/projects/facturezen.jpg',
    gallery: ['images/projects/facturezen-shot-1.jpg', 'images/projects/facturezen-shot-2.jpg', 'images/projects/facturezen-shot-3.jpg'],
    video: 'videos/facturezen.mp4',
    featured: true,
  },
  {
    slug: 'mesh-processing',
    title: 'Half-Edge Mesh Processing',
    tagline:
      'A C++ mesh viewer built on a half-edge data structure, with simplification, subdivision and silhouette detection.',
    context: 'ESIEE Paris · Year 4 · Geometric Modeling',
    year: '2026',
    categories: ['3d'],
    tags: ['Geometry', 'C++', 'Algorithms'],
    kind: 'Coursework',
    role: 'Implemented the mesh algorithms and their tests.',
    problem: 'Load and edit 3D meshes efficiently, which requires fast access to neighboring faces, edges and vertices.',
    choices: [
      { name: 'Half-edge structure', why: 'for constant-time adjacency queries' },
      { name: 'Quadric error metrics', why: 'for edge-collapse simplification' },
      { name: 'Catmull-Clark', why: 'for smooth subdivision surfaces' },
      { name: 'CMake', why: 'for a portable build on macOS and Linux' },
    ],
    architecture: [
      { label: 'OBJ file', sub: 'Vertices · faces' },
      { label: 'Half-edge mesh', sub: 'Twin · next · prev' },
      { label: 'Algorithms', sub: 'QEM · subdivision' },
      { label: 'OpenGL view', sub: 'Shaders · GLUT' },
    ],
    challenges: [
      { problem: 'Building twin links', solution: 'Edge map keyed by vertex pairs while reading the file' },
      { problem: 'Concave faces', solution: 'Triangulation that handles both convex and concave polygons' },
      { problem: 'Correctness', solution: 'Dedicated tests for the half-edge invariants' },
    ],
    results: [
      { title: '9 of 10 features done', detail: 'Only triangulation of polygons with holes (expert option) is missing' },
      { title: 'Surfaces of revolution', detail: 'Mesh generation from a 2D profile' },
      { title: 'Silhouettes', detail: 'Real-time edge detection from the camera position' },
    ],
    stack: ['C++', 'OpenGL', 'GLUT', 'GLM', 'CMake'],
    learned: 'Why data structure choice drives algorithm complexity in geometry processing.',
    repo: 'https://github.com/amn-sdk/TPs-Geometric-Modeling',
    image: 'images/projects/mesh.jpg',
  },
  {
    slug: 'deep-learning-labs',
    title: 'Deep Learning Labs',
    tagline: 'Neural-network notebooks, starting from an ADALINE adaptive filter applied to EEG signals.',
    context: 'ESIEE Paris · Year 4 · Deep Learning',
    year: '2026',
    categories: ['ai'],
    tags: ['Neural networks', 'Signal processing', 'Jupyter'],
    kind: 'Coursework',
    role: 'Completed the labs individually.',
    problem: 'Understand how neural networks learn by implementing them from the ground up on real signals.',
    choices: [
      { name: 'ADALINE', why: 'to see gradient-based learning on a single neuron' },
      { name: 'EEG data', why: 'as a real, noisy signal to filter' },
      { name: 'Jupyter', why: 'to mix code, plots and explanations' },
    ],
    architecture: [
      { label: 'EEG signal', sub: 'Raw samples' },
      { label: 'Adaptive filter', sub: 'ADALINE · LMS' },
      { label: 'Training', sub: 'Gradient descent' },
      { label: 'Analysis', sub: 'Plots · error' },
    ],
    challenges: [
      { problem: 'Choosing the learning rate', solution: 'Compared convergence across several values' },
      { problem: 'Noisy input', solution: 'Adaptive filtering to track the useful signal' },
    ],
    results: [
      { title: 'Working filter', detail: 'ADALINE trained on EEG data with error curves' },
      { title: 'Coursework', detail: 'Lab notebooks, not a standalone product' },
    ],
    stack: ['Python', 'NumPy', 'Matplotlib', 'Jupyter'],
    learned: 'The math behind gradient descent, before using high-level frameworks.',
    repo: 'https://github.com/amn-sdk/TPs-Deep-Learning',
    image: 'images/projects/deep-learning.jpg',
  },
  {
    slug: 'quiz-app',
    title: 'Quiz App',
    tagline: 'A full-stack quiz platform with an admin back office, live leaderboard, PWA support and three visual themes.',
    context: 'ESIEE Paris · Year 4 · Web Development',
    year: '2025',
    categories: ['software'],
    tags: ['Full-stack', 'Vue', 'Flask'],
    kind: 'Team project',
    team: ['Yacine Housny', 'Kevin Sutia', 'Amine Saddik'],
    role: 'Contributed to the frontend and API (15 commits), and tested API endpoints with Postman.',
    problem: 'Let users take quizzes, see their score and rank, while admins manage questions securely.',
    choices: [
      { name: 'Vue 3 + TypeScript', why: 'with Pinia and TanStack Query for state and data fetching' },
      { name: 'Flask + SQLAlchemy', why: 'for a lightweight REST API' },
      { name: 'JWT', why: 'to protect the admin back office' },
      { name: 'Docker + Nginx', why: 'for production deployment' },
    ],
    architecture: [
      { label: 'Vue 3 SPA', sub: 'Pinia · PWA' },
      { label: 'Flask API', sub: 'Blueprints · JWT' },
      { label: 'SQLite', sub: 'SQLAlchemy' },
      { label: 'Nginx', sub: 'Docker · CI' },
    ],
    challenges: [
      { problem: 'Losing progress on refresh', solution: 'Automatic save in localStorage' },
      { problem: 'Mobile users', solution: 'Mobile-first design and offline PWA' },
    ],
    results: [
      { title: 'Front and back office', detail: 'Public quiz flow plus admin CRUD for questions' },
      { title: 'Live leaderboard', detail: 'Podium and real-time ranking' },
    ],
    stack: ['TypeScript', 'Vue 3', 'Flask', 'SQLAlchemy', 'Docker', 'GitHub Actions'],
    learned: 'How to split work across a team on a shared API contract.',
    repo: 'https://github.com/yacine2003/quiz-app',
    image: 'images/projects/quiz-app.jpg',
    gallery: ['images/projects/quiz-app-shot-1.jpg', 'images/projects/quiz-app-shot-2.jpg', 'images/projects/quiz-app-shot-3.jpg'],
    video: 'videos/quiz-app.mp4',
  },
  {
    slug: 'scam-simulator',
    title: 'Scam Simulator',
    tagline: 'A 3D Unity game about online scams, with an open map, in-game computer and shop system.',
    context: 'ESIEE Paris · Year 3 · Unity 3D',
    year: '2025',
    categories: ['3d'],
    tags: ['Game dev', 'Unity', 'C#'],
    kind: 'Team project',
    team: ['Auguste Sagaert', 'Amine Saddik'],
    role: 'Built the shop purchase system, worked on the map, and implemented the in-game computer email feature.',
    problem: 'Design a playable 3D game with clear mechanics and interactions, from scenes to gameplay scripts.',
    choices: [
      { name: 'Unity', why: 'for scenes, physics and rapid iteration' },
      { name: 'C# scripts', why: 'for gameplay and UI logic' },
    ],
    architecture: [
      { label: 'Scenes', sub: 'Map · interiors' },
      { label: 'Gameplay', sub: 'C# scripts' },
      { label: 'Systems', sub: 'Shop · computer' },
      { label: 'UI', sub: 'HUD · menus' },
    ],
    challenges: [
      { problem: 'Team work in Unity', solution: 'Git branches and merges on scene changes' },
      { problem: 'Game economy', solution: 'Store purchase system tied to player progress' },
    ],
    results: [
      { title: 'Playable build', detail: 'Explorable map with interactive systems' },
      { title: '87 commits', detail: 'Iterative development as a team' },
    ],
    stack: ['C#', 'Unity'],
    learned: 'Game architecture in Unity and collaborating on binary assets with Git.',
    repoNote: 'Repository is private (owned by a teammate).',
    slides: Array.from({ length: 12 }, (_, i) => `slides/scam-simulator/slide-${String(i + 1).padStart(2, '0')}.jpg`),
    slidesNote: 'Project presentation (in French), May 2025.',
  },
  {
    slug: 'earthquake-dashboard',
    title: 'Earthquake Dashboard',
    tagline: 'An interactive dashboard of 2024 earthquakes with a 2D map, a 3D globe and tectonic fault lines.',
    context: 'ESIEE Paris · Year 3 · Python for Data',
    year: '2025',
    categories: ['ai'],
    tags: ['Data', 'Visualization', 'Python'],
    kind: 'Team project',
    team: ['Auguste Sagaert', 'Amine Saddik'],
    role: 'Built parts of the data pipeline and dashboard components.',
    problem: 'Make a year of global seismic data explorable for non-experts.',
    choices: [
      { name: 'USGS Earthquake API', why: 'as an official, up-to-date data source' },
      { name: 'Dash + Plotly', why: 'for interactive charts in Python' },
      { name: 'Mapbox + orthographic globe', why: 'for 2D and 3D geographic views' },
    ],
    architecture: [
      { label: 'USGS API', sub: 'Raw CSV' },
      { label: 'Cleaning', sub: 'Pandas' },
      { label: 'Dash app', sub: 'Plotly' },
      { label: 'Views', sub: 'Map · globe · stats' },
    ],
    challenges: [
      { problem: 'Messy raw data', solution: 'Separate download and cleaning scripts' },
      { problem: 'Context for users', solution: 'Tectonic plate boundaries overlaid on the map' },
    ],
    results: [
      { title: '3 views', detail: 'Magnitude histogram, 2D map and 3D globe' },
      { title: 'Reproducible', detail: 'Data can be re-downloaded for any time range' },
    ],
    stack: ['Python', 'Pandas', 'Dash', 'Plotly', 'Mapbox'],
    learned: 'How to structure a data project into acquisition, cleaning and presentation.',
    repo: 'https://github.com/aaAuguste/Data_python',
    image: 'images/projects/earthquakes.jpg',
  },
  {
    slug: 'game-jam-2025',
    title: 'Game Jam 2025',
    tagline: 'A Python game built in a time-boxed game jam, with dialogues, combat and mini-games.',
    context: 'ESIEE Paris · Year 4 · Game Jam',
    year: '2025',
    categories: ['software'],
    tags: ['Game jam', 'Python', 'Teamwork'],
    kind: 'Team project',
    team: ['Lucas', 'Julien Lavrard-Meyer', 'Aloïs Fournier', 'Hugo', 'Amine Saddik'],
    role: 'Implemented the sequenced combat system (hero vs. dragon) with sword inventory handling.',
    problem: 'Ship a complete, fun game with a large team under strict time constraints.',
    choices: [
      { name: 'Python', why: 'so the whole team could contribute quickly' },
      { name: 'Controllers and panels', why: 'to separate game logic from rendering' },
    ],
    architecture: [
      { label: 'Game loop', sub: 'Controller' },
      { label: 'Scenes', sub: 'Panels · dialogues' },
      { label: 'Combat', sub: 'Turns · inventory' },
      { label: 'Audio', sub: 'Effects · music' },
    ],
    challenges: [
      { problem: 'Many people, little time', solution: 'Small, separate modules per feature' },
    ],
    results: [
      { title: 'Finished game', detail: 'Delivered by the end of the jam' },
      { title: '130+ commits', detail: 'Fast iteration as a team' },
    ],
    stack: ['Python'],
    learned: 'Scoping hard and integrating often when time is short.',
    repo: 'https://github.com/Julyse/GameJam2025',
    image: 'images/projects/gamejam.jpg',
    gallery: ['images/projects/gamejam-shot-1.jpg', 'images/projects/gamejam-shot-2.jpg', 'images/projects/gamejam-shot-3.jpg'],
    video: 'videos/gamejam.mp4',
  },
  {
    slug: 'rapizz',
    title: 'RaPizz',
    tagline: 'A pizzeria management app in Java Swing on MySQL, with orders, delivery simulation and loyalty rules.',
    context: 'ESIEE Paris · Year 3 · Databases',
    year: '2025',
    categories: ['software'],
    tags: ['Databases', 'Java', 'SQL'],
    kind: 'Team project',
    team: ['Aman Ghazanfar', 'Justine Hakim', 'Amine Saddik', 'Auguste Sagaert'],
    role: 'Worked on the database schema and SQL queries.',
    problem: 'Model a real business (orders, deliveries, customers) in a relational database and build an app on top of it.',
    choices: [
      { name: 'MySQL', why: 'for a normalized relational schema' },
      { name: 'Java Swing + JDBC', why: 'for the desktop interface' },
    ],
    architecture: [
      { label: 'Swing UI', sub: 'Order · stats' },
      { label: 'JDBC', sub: 'Queries' },
      { label: 'MySQL', sub: 'Schema · data' },
    ],
    challenges: [
      { problem: 'Business rules', solution: 'Free pizza if late by over 30 min, and every 10th order' },
      { problem: 'Reporting', solution: 'SQL statistics on revenue, customers and drivers' },
    ],
    results: [
      { title: 'End-to-end app', detail: 'Ordering, delivery simulation, balance and statistics' },
    ],
    stack: ['Java', 'Swing', 'MySQL', 'JDBC'],
    learned: 'Relational modeling (Merise) and writing analytical SQL queries.',
    repoNote: 'Repository is private (owned by a teammate).',
    image: 'images/projects/rapizz.jpg',
    gallery: ['images/projects/rapizz-shot-1.jpg', 'images/projects/rapizz-shot-2.jpg', 'images/projects/rapizz-shot-3.jpg'],
    video: 'videos/rapizz.mp4',
  },
  {
    slug: 'ladybug-optimization',
    title: 'Ladybug Path Optimization',
    tagline: 'Greedy vs. dynamic programming on a grid path problem, compared over 10,000 random runs.',
    context: 'ESIEE Paris · Year 2 · Algorithms',
    year: '2024',
    categories: ['software'],
    tags: ['Algorithms', 'Java', 'Dynamic programming'],
    kind: 'Duo project',
    team: ['Amine Saddik', 'Louis Ayzac'],
    role: 'Co-implemented the algorithms and the experiment.',
    problem: 'Find the path that maximizes the aphids a ladybug eats on a grid, and measure how far a greedy strategy is from optimal.',
    choices: [
      { name: 'Dynamic programming', why: 'to compute the optimal path' },
      { name: 'Greedy baseline', why: 'to quantify the gap to optimal' },
      { name: 'Python dashboard', why: 'to visualize relative gains' },
    ],
    architecture: [
      { label: 'Random grids', sub: '1–15 × 1–15' },
      { label: 'Algorithms', sub: 'Greedy · DP' },
      { label: 'Experiment', sub: '10,000 runs' },
      { label: 'Dashboard', sub: 'Python' },
    ],
    challenges: [
      { problem: 'Fair comparison', solution: 'Same random grids for both algorithms, results exported to CSV' },
    ],
    results: [
      { title: '10,000 runs', detail: 'Relative gain of DP over greedy measured across grid sizes' },
    ],
    stack: ['Java', 'Python'],
    learned: 'Proving an algorithm is better with experiments, not just intuition.',
    repo: 'https://github.com/amn-sdk/ProjetAlgo2024',
    image: 'images/projects/ladybug.jpg',
    gallery: ['images/projects/ladybug-shot-1.jpg', 'images/projects/ladybug-shot-2.jpg', 'images/projects/ladybug-shot-3.jpg'],
    video: 'videos/ladybug.mp4',
  },
]

export interface Experience {
  company: string
  role: string
  period: string
  location: string
  points: string[]
  tags: string[]
}

export const experience: Experience[] = [
  {
    company: 'French Ministry of the Interior',
    role: 'IT Project Manager · Engineering apprenticeship',
    period: 'Sep 2024 — Present',
    location: 'Paris, France',
    points: [
      'Delivered 8 IT projects end to end, from business requirements to production and maintenance.',
      'Led requirements gathering and deliverable validation, coordinating business and IT stakeholders.',
      'Managed project budgets and schedules, tracking costs and milestones for on-time delivery.',
      'Oversaw development, integration and production deployment alongside development teams.',
      'Led security accreditation of projects and contributed to related IT security audits.',
    ],
    tags: ['Project management', 'Security accreditation', 'Delivery'],
  },
  {
    company: 'A.I Cyber Cloud Consulting',
    role: 'Founder & CEO',
    period: 'Jan 2024 — Present',
    location: 'Rueil-Malmaison, France',
    points: [
      'Run an IT consulting firm specializing in cybersecurity, cloud computing and AI.',
      'Delivered 4 client websites end to end, from needs assessment and solution design to launch.',
      'Develop custom software and tools tailored to client requirements.',
      'Manage operations, client and partner relations, and project coordination.',
    ],
    tags: ['Entrepreneurship', 'Consulting', 'Software'],
  },
  {
    company: 'DIGEIZ',
    role: 'Engineering Intern · Assistant Project Manager',
    period: 'Jun 2023 — Aug 2023',
    location: 'Boulogne-Billancourt, France',
    points: [
      'Supported the deployment of 286 indoor-positioning cameras in shopping centers (France and UK).',
      'Conducted site surveys in Birmingham (UK) and Marseille to define and validate camera locations.',
      'Coordinated on-site activities with local stakeholders to ensure technical feasibility.',
      'Prepared deployment documentation: layouts, progress tracking and reports.',
    ],
    tags: ['Field coordination', 'Documentation'],
  },
]

export const education = [
  {
    school: 'ESIEE Paris',
    degree: "Master's in Computer Science & Engineering · AI, Software & 3D",
    detail: 'Specialization in AI, software engineering and 3D technologies · Work-study program',
    period: 'Sep 2022 — Aug 2027',
    location: 'Noisy-le-Grand, France',
    courses: ['Computer Graphics', 'Geometric Modeling', 'Deep Learning', 'Machine Learning', 'DevOps', 'Operating Systems', 'Databases', 'Algorithms'],
  },
  {
    school: 'University of California, Irvine',
    degree: 'Certificate in International Business Operations & Management (ACP)',
    detail: 'International business semester abroad',
    period: 'Sep 2026 — Dec 2026',
    location: 'Irvine, CA, USA',
    courses: ['International Business Strategy', 'Finance', 'Marketing', 'Trade & Supply Chain', 'Negotiation'],
  },
]

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C / C++', 'C#', 'SQL', 'R', 'Swift'] },
  { group: 'AI & Data', items: ['NumPy', 'Pandas', 'Numba', 'Jupyter', 'Plotly / Dash', 'Streamlit', 'Power BI'] },
  { group: '3D & Graphics', items: ['OpenGL', 'GLSL', 'Three.js', 'Unity', 'AR / VR (Meta Quest)'] },
  { group: 'Web & Backend', items: ['React', 'Next.js', 'Vue', 'FastAPI', 'Flask', 'Node.js', 'PostgreSQL', 'MySQL', 'Redis'] },
  { group: 'Cloud & DevOps', items: ['Docker', 'Kubernetes', 'Helm', 'GitHub Actions', 'Argo CD', 'OpenTofu', 'Prometheus / Grafana', 'AWS', 'Postman'] },
  { group: 'Project delivery', items: ['Requirements', 'Stakeholder management', 'Security accreditation', 'Testing & validation'] },
]
