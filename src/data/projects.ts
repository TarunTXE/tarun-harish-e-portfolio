export interface ProjectData {
  id: string;
  name: string;
  title: string;
  badge: string;
  description: string;
  longDescription: string;
  language: string;
  stars: number;
  forks: number;
  githubUrl: string;
  demoUrl?: string;
  updatedAt: string;
  isFeatured: boolean;
  category: 'Full Stack' | 'AI / ML' | 'Web Apps';
  techStack: string[];
  features: string[];
  screenshots?: string[];
}

export const cogniviaProject: ProjectData = {
  id: 'cognivia',
  name: 'Cognivia',
  title: 'Cognivia — AI-Powered Personalized Learning Assistant',
  badge: 'Flagship AI Platform',
  description:
    'Intelligent personalized learning assistant that helps students plan, learn, practice, evaluate, and improve. Integrates the Google Gemini API to generate tailored study plans, topic notes, interactive quizzes, and diagnostic progress analytics.',
  longDescription:
    'Cognivia brings together planning, learning, practice, evaluation, and improvement into one streamlined platform. Students input their subject, available duration, difficulty level, and goals; Cognivia leverages the Google Gemini API with an Express REST API backend and React frontend to generate structured study schedules, topic-specific notes, and interactive quizzes with weak-topic diagnostics.',
  language: 'JavaScript',
  stars: 0,
  forks: 0,
  githubUrl: 'https://github.com/TarunTXE/Cognivia',
  demoUrl: 'https://cognivia-ivory.vercel.app/',
  updatedAt: '2026-09-28',
  isFeatured: true,
  category: 'AI / ML',
  techStack: ['React', 'Vite', 'Google Gemini API', 'Express.js', 'Node.js', 'Tailwind CSS', 'RESTful APIs'],
  features: [
    'Dynamic study plan generation tailored by duration, difficulty, and learning objectives.',
    'Automated topic-specific AI notes generation powered by the Google Gemini API.',
    'Interactive diagnostic quizzes with automated scoring and weak-topic detection.',
    'Centralized progress dashboard tracking completed study days and review history.',
    'Modular React and Vite frontend with an Express REST API backend.',
  ],
  screenshots: [
    '/projects/cognivia/landing-page.png',
    '/projects/cognivia/dashboard-planner.png',
    '/projects/cognivia/notes.png',
    '/projects/cognivia/quiz.png',
  ],
};

export const ragProject: ProjectData = {
  id: 'rag-evaluation-framework',
  name: 'rag-evaluation-framework',
  title: 'RAG Evaluation Framework',
  badge: 'Featured AI / ML Project',
  description:
    'Retrieval-Augmented Generation (RAG) system for academic syllabus and question-paper QA, paired with an automated evaluation framework benchmarking retrieval recall and answer faithfulness across pipeline configurations.',
  longDescription:
    'Ingests course syllabus and question-paper PDFs, chunks and embeds them with fastembed, and answers natural-language questions grounded in retrieved context via Groq API (LLM inference) with source attribution. Features dynamic in-memory PDF uploads directly indexed into ChromaDB vector storage without server restarts, and an automated evaluation suite benchmarking Recall@k and faithfulness across varying chunk sizes, retrieval depths (k), and embedding models (MiniLM vs Albert).',
  language: 'Python',
  stars: 0,
  forks: 0,
  githubUrl: 'https://github.com/TarunTXE/rag-evaluation-framework',
  demoUrl: 'https://rag-evaluation-framework.vercel.app',
  updatedAt: '2026-09-20',
  isFeatured: true,
  category: 'AI / ML',
  techStack: ['Python', 'FastAPI', 'ChromaDB', 'FastEmbed', 'Groq API', 'React.js', 'Vite', 'Render', 'Vercel'],
  features: [
    'Built a RAG pipeline with an automated evaluation harness benchmarking retrieval and faithfulness across chunking, embedding, and reranking strategies.',
    'Built the backend with FastAPI, fastembed embeddings, ChromaDB vector store, and the Groq API for generation.',
    'Built a React dashboard to visualize benchmark results, with PDF upload for querying custom documents.',
    'Benchmarked embedding models, identifying a retrieval recall drop from 100% to 83.33% with a weaker model.',
    'Deployed backend on Render and frontend on Vercel with a live public demo.',
  ],
  screenshots: [
    '/projects/rag-framework/preview.png',
  ],
};

export const portfolioCreatorProject: ProjectData = {
  id: 'portfolio-creator',
  name: 'signal-hire',
  title: 'SignalHire – Portfolio & Career Platform',
  badge: 'Full-Stack Flagship Platform',
  description:
    'Full-stack platform for creating, customizing, previewing, and sharing professional portfolios with AI resume builder, real-time strength evaluation, feedback ratings, and skill-based job matching.',
  longDescription:
    'A comprehensive career ecosystem built with React.js, Node.js, Express.js, and MongoDB. Features Google Gemini AI-powered resume builder & PDF parser, multi-theme portfolio engine, secure JWT authentication, vector PDF export, portfolio strength analyzer with star ratings, and an integrated real-time job portal.',
  language: 'JavaScript',
  stars: 1,
  forks: 0,
  githubUrl: 'https://github.com/TarunTXE/signal-hire',
  demoUrl: 'https://portfolio-creator-portfolio-builder.vercel.app',
  updatedAt: '2026-09-06',
  isFeatured: true,
  category: 'Full Stack',
  techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Google Gemini AI', 'JWT Auth', 'Tailwind CSS', 'RESTful APIs'],
  features: [
    'AI-powered resume builder with PDF parsing and Gemini AI data extraction.',
    'Multi-theme dynamic portfolio engine with live WYSIWYG customization.',
    'Portfolio strength analyzer with automated quality scoring and feedback.',
    'Integrated job portal matching active tech opportunities to user skills.',
    'High-fidelity client-side PDF export, JWT authentication, and RESTful API backend.',
  ],
  screenshots: [
    '/projects/portfolio-creator/main page.png',
    '/projects/portfolio-creator/resume builder.png',
    '/projects/portfolio-creator/templates.png',
    '/projects/portfolio-creator/job portal.png',
    '/projects/portfolio-creator/register.png',
  ],
};

export const qrForgeProject: ProjectData = {
  id: 'qrforge',
  name: 'QRForge',
  title: 'QRForge — QR Code & Digital Business Card Engine',
  badge: 'Full-Stack Utility Platform',
  description:
    'Dynamic QR code generator and digital business card platform built with Django and React, supporting custom styling, vector exports, and branding integration.',
  longDescription:
    'Enables users and small businesses to generate customized, high-resolution QR codes with embedded branding, color customization, and multiple payload types including vCard, Wi-Fi credentials, and URLs. Combines a Python Django backend with an interactive React frontend.',
  language: 'JavaScript',
  stars: 0,
  forks: 0,
  githubUrl: 'https://github.com/TarunTXE/QRForge',
  updatedAt: '2026-07-14',
  isFeatured: true,
  category: 'Full Stack',
  techStack: ['Django', 'Python', 'React.js', 'JavaScript', 'Tailwind CSS', 'RESTful APIs'],
  features: [
    'Custom color gradients, embedded logos, and real-time styling controls.',
    'Multi-format vector and high-DPI export for physical and digital print.',
    'vCard, URL, and Wi-Fi credential payload generators.',
    'Full-stack backend integration and API endpoints built with Django.',
  ],
  screenshots: [
    '/projects/qrforge/home.png',
    '/projects/qrforge/qr-generator.png',
    '/projects/qrforge/business-card-studio.png',
    '/projects/qrforge/upi-generator.png',
  ],
};

export const featuredProjects: ProjectData[] = [
  cogniviaProject,
  ragProject,
  portfolioCreatorProject,
  qrForgeProject,
];

// Alias for backwards compatibility if needed
export const featuredProject = portfolioCreatorProject;

export const repositoriesData: ProjectData[] = [
  cogniviaProject,
  ragProject,
  portfolioCreatorProject,
  qrForgeProject,
  {
    id: 'careflow',
    name: 'Careflow',
    title: 'CareFlow — Hospital Operations & Patient Management',
    badge: 'Healthcare Management',
    description:
      'Database-driven web application for hospital operations, department bed tracking, doctor scheduling, and patient management.',
    longDescription:
      'Engineered with Python, Django, HTML, CSS, and SQLite. Implemented complete CRUD workflows across patient admissions, doctor rosters, medical records, and bed occupancy telemetry using Django\'s MVT architecture.',
    language: 'Python',
    stars: 0,
    forks: 0,
    githubUrl: 'https://github.com/TarunTXE/Careflow',
    updatedAt: '2026-09-06',
    isFeatured: false,
    category: 'Web Apps',
    techStack: ['Python', 'Django', 'SQLite', 'HTML5', 'CSS3', 'CRUD Operations'],
    features: [
      'Departmental bed allocation and occupancy management',
      'Doctor duty roster and appointment booking',
      'Patient triage and digital admission records',
      'Django MVT architecture with relational SQLite database',
    ],
    screenshots: [
      '/projects/careflow/main page.png',
      '/projects/careflow/hospital overview.png',
      '/projects/careflow/hospital reports.png',
      '/projects/careflow/doctors available.png',
    ],
  },
  {
    id: 'vhe-website',
    name: 'vhe-website',
    title: 'Dr. Varun Harish E — Doctor & Author Web Portal',
    badge: 'Doctor & Author Platform',
    description:
      'Official web portal and personal brand platform engineered for Doctor and Author Varun Harish E, showcasing published literary works, medical insights, and professional profile.',
    longDescription:
      'A bespoke digital platform engineered for Doctor and Author Varun Harish E. Built with TypeScript and React to deliver refined typography, fluid navigation, and an engaging presentation for his published books, articles, and medical insights, with production deployment on Vercel.',
    language: 'TypeScript',
    stars: 0,
    forks: 0,
    githubUrl: 'https://github.com/TarunTXE/vhe-website',
    demoUrl: 'https://vhe-website.vercel.app',
    updatedAt: '2026-07-22',
    isFeatured: false,
    category: 'Web Apps',
    techStack: ['TypeScript', 'React', 'Tailwind CSS', 'Vercel'],
    features: [
      'Official digital presence for Doctor & Author Varun Harish E',
      'Showcase for published literary work, books, and clinical background',
      'Type-safe modular frontend built with TypeScript and React',
      'Responsive reading layouts and production deployment on Vercel',
    ],
    screenshots: [
      '/projects/vhe-website/portal.png',
      '/projects/vhe-website/ophthalmologist.png',
      '/projects/vhe-website/author.png',
    ],
  },
  {
    id: 'posture-tracker-dev',
    name: 'Posture-Tracker',
    title: 'Posture & Ergonomic Tracker',
    badge: 'In Development / Coming Soon',
    description:
      'Experimental prototype exploring computer vision techniques for posture tracking and ergonomic awareness. Early research in progress.',
    longDescription:
      'An early-stage experimental research initiative exploring lightweight computer vision techniques for detecting posture habits. Currently in preliminary development.',
    language: 'Python',
    stars: 0,
    forks: 0,
    githubUrl: 'https://github.com/TarunTXE',
    updatedAt: '2026-08-01',
    isFeatured: false,
    category: 'AI / ML',
    techStack: ['Python', 'OpenCV', 'Computer Vision'],
    features: [
      'Preliminary exploratory prototype',
      'Early research in progress',
    ],
  },
];
