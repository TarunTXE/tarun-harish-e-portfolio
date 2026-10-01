export interface SkillCategory {
  id: string;
  name: string;
  badge: string;
  description: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'FRONTEND',
    badge: 'Client Modules',
    description: 'Modern, component-driven client architecture, interactive state management, and fluid responsive styling.',
    skills: ['React', 'Vite', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'],
  },
  {
    id: 'backend',
    name: 'BACKEND',
    badge: 'Server & APIs',
    description: 'High-concurrency server applications, secure authentication pipelines, and structured RESTful endpoints.',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'REST APIs'],
  },
  {
    id: 'languages',
    name: 'LANGUAGES',
    badge: 'Core Syntax',
    description: 'Foundational programming languages used for low-level systems, algorithms, and application logic.',
    skills: ['C', 'C++', 'Java', 'Python', 'SQL'],
  },
  {
    id: 'aiml',
    name: 'AI / ML',
    badge: 'Intelligent Systems',
    description: 'Machine learning pipelines, Retrieval-Augmented Generation (RAG), Large Language Models, and applied intelligent software.',
    skills: ['Python', 'Machine Learning', 'RAG', 'LLM', 'AI Applications'],
  },
  {
    id: 'tools',
    name: 'TOOLS',
    badge: 'Ecosystem',
    description: 'Developer tooling, version control workflows, automated deployment systems, and code editors.',
    skills: ['Git', 'GitHub', 'VS Code', 'Vercel'],
  },
];
