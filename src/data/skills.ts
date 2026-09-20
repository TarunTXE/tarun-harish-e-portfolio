export interface SkillCategory {
  id: string;
  name: string;
  badge: string;
  description: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    name: 'Programming Languages',
    badge: 'Core Syntax',
    description: 'Foundation languages used for algorithms, web engineering, and machine learning pipelines.',
    skills: ['Python', 'Java', 'C', 'JavaScript', 'SQL'],
  },
  {
    id: 'aiml',
    name: 'Machine Learning & AI',
    badge: 'Applied AI',
    description: 'Model building, computer vision, deep architectures, and enterprise AI platforms.',
    skills: [
      'Supervised Learning',
      'Unsupervised Learning',
      'Deep Learning',
      'Reinforcement Learning',
      'Q-Learning',
      'IBM watsonx',
      'Watson Studio',
      'Teachable Machine',
      'OpenCV',
      'MediaPipe',
      'Random Forest',
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    badge: 'Client Systems',
    description: 'Component-driven interactive web interfaces, responsive styling, and modern UI architectures.',
    skills: ['HTML5', 'CSS3', 'React.js', 'Tailwind CSS', 'JavaScript (ES6+)'],
  },
  {
    id: 'backend',
    name: 'Backend Architecture',
    badge: 'Server & APIs',
    description: 'Server architectures, RESTful API design, MVC/MVT patterns, and secure session handling.',
    skills: ['Node.js', 'Express.js', 'Django', 'REST APIs', 'JWT Authentication'],
  },
  {
    id: 'databases',
    name: 'Databases & Storage',
    badge: 'Data Layer',
    description: 'Relational schema modeling, NoSQL document stores, and query optimization.',
    skills: ['MongoDB', 'SQLite', 'MySQL'],
  },
  {
    id: 'tools',
    name: 'Tools & Ecosystem',
    badge: 'Workflow',
    description: 'Version control systems, continuous integration, collaboration, and development environments.',
    skills: ['Git', 'GitHub', 'VS Code', 'Vite', 'Postman'],
  },
];
