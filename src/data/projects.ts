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

export const featuredProject: ProjectData = {
  id: 'portfolio-creator',
  name: 'Portfolio-Creator-Portfolio-Builder-with-Job-Assistance',
  title: 'Portfolio Creator – Evaluation & Job Portal',
  badge: 'Featured Flagship Project',
  description:
    'Full-stack platform for creating, customizing, previewing, and sharing professional portfolios with real-time evaluation, feedback rating system, and skill-based job matching.',
  longDescription:
    'A comprehensive career ecosystem built with React.js, Node.js, Express.js, and MongoDB. Features secure JWT authentication, rich WYSIWYG portfolio customizers, vector PDF export engine, automated review algorithms with star ratings and improvement suggestions, and an integrated job portal matching candidate skills with active opportunities.',
  language: 'JavaScript',
  stars: 1,
  forks: 0,
  githubUrl: 'https://github.com/TarunTXE/Portfolio-Creator-Portfolio-Builder-with-Job-Assistance',
  demoUrl: 'https://portfolio-creator-portfolio-builder.vercel.app',
  updatedAt: '2026-09-06',
  isFeatured: true,
  category: 'Full Stack',
  techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'RESTful APIs', 'Tailwind CSS'],
  features: [
    'Built a full-stack platform for creating, customizing, previewing, and sharing professional portfolios.',
    'Implemented JWT-based authentication and secure user profile management.',
    'Built a portfolio evaluation system with feedback, ratings, and improvement suggestions.',
    'Integrated a job portal feature matching opportunities to user skills and interests.',
    'Built portfolio preview, PDF export, and RESTful backend services using Node.js, Express.js, and MongoDB.',
  ],
  screenshots: [
    '/projects/portfolio-creator/main page.png',
    '/projects/portfolio-creator/portfolio creation.png',
    '/projects/portfolio-creator/portfolio preview.png',
    '/projects/portfolio-creator/job portal.png',
    '/projects/portfolio-creator/portfolio template.png',
    '/projects/portfolio-creator/login.png',
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

export const featuredProjects: ProjectData[] = [featuredProject, ragProject];

export const repositoriesData: ProjectData[] = [
  featuredProject,
  ragProject,
  {
    id: 'sih-wheelchair',
    name: 'Wheelchair-Pushup-Detection',
    title: 'Wheelchair Pressure Relief Pushup Detection System',
    badge: 'Assistive AI Innovation',
    description:
      'Computer Vision and Machine Learning system monitoring posture and pushup frequency for wheelchair users to prevent ischemic pressure ulcers.',
    longDescription:
      'Utilizes monocular RGB camera input with MediaPipe 33-landmark 3D pose extraction. Vector angles and seat displacement clearance are classified using a Random Forest model, alerting users and caregivers to perform regular pressure relief pushups.',
    language: 'Python',
    stars: 1,
    forks: 0,
    githubUrl: 'https://github.com/TarunTXE',
    demoUrl: '#sih-showcase',
    updatedAt: '2026-08-20',
    isFeatured: true,
    category: 'AI / ML',
    techStack: ['Python', 'OpenCV', 'MediaPipe', 'Machine Learning', 'Random Forest', 'Scikit-learn'],
    features: [
      'Monocular webcam / edge video frame processing with OpenCV',
      '33-keypoint 3D anatomical landmark extraction via MediaPipe Pose',
      'Displacement clearance vector calculation and feature engineering',
      'Random Forest classification for posture and pushup detection',
      'Automated relief timer cues to prevent pressure sores',
    ],
  },
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
    id: 'qrforge',
    name: 'QRForge',
    title: 'QRForge — QR Code & Digital Business Card Engine',
    badge: 'Design & Utility Platform',
    description:
      'Dynamic QR code generator and digital business card platform built with Django and React, supporting custom styling and vector exports.',
    longDescription:
      'Enables users and small businesses to generate customized, high-resolution QR codes with embedded branding, color customization, and multiple payload types including vCard, Wi-Fi credentials, and URLs.',
    language: 'JavaScript',
    stars: 0,
    forks: 0,
    githubUrl: 'https://github.com/TarunTXE/QRForge',
    updatedAt: '2026-07-14',
    isFeatured: false,
    category: 'Full Stack',
    techStack: ['Django', 'Python', 'React.js', 'JavaScript', 'Tailwind CSS'],
    features: [
      'Custom color gradients, embedded logos, and styling controls',
      'Multi-format vector and high-DPI export',
      'vCard, URL, and Wi-Fi credential payloads',
      'Full-stack backend integration with Django',
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
  },
];
