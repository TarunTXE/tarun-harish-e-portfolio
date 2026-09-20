export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  collaboration?: string;
  location: string;
  period: string;
  isCurrent: boolean;
  points: string[];
  technologies: string[];
  badge: string;
}

export const experiencesData: ExperienceItem[] = [
  {
    id: 'bharatcares-ibm',
    role: 'Machine Learning and Applied AI Intern',
    company: 'BharatCares – IBM SkillsBuild',
    collaboration: 'In collaboration with AICTE, IBM SkillsBuild, and BharatCares',
    location: 'Remote',
    period: 'Aug. 2026 – Present',
    isCurrent: true,
    badge: 'AICTE / IBM SkillsBuild',
    points: [
      'Completing a 6-week Machine Learning and Applied AI internship in collaboration with AICTE, IBM SkillsBuild, and BharatCares.',
      'Building and training AI models using IBM watsonx/Watson Studio and Teachable Machine across supervised, unsupervised, deep, and reinforcement learning.',
      'Developing a project-based ML solution aligned with the UN Sustainable Development Goals (SDGs).',
    ],
    technologies: [
      'Machine Learning',
      'Applied AI',
      'IBM watsonx',
      'Watson Studio',
      'Teachable Machine',
      'Supervised Learning',
      'Deep Learning',
      'Reinforcement Learning',
    ],
  },
  {
    id: 'zoople-technologies',
    role: 'Python Django Intern',
    company: 'Zoople Technologies',
    location: 'Kozhikode, Kerala',
    period: 'Nov. 2025 – Dec. 2025',
    isCurrent: false,
    badge: 'Backend & Web Dev',
    points: [
      'Developed database-driven web applications using Python, Django, HTML, CSS, and SQLite.',
      'Implemented backend functionality and CRUD operations using Django\'s MVT architecture.',
      'Debugged and integrated databases across real-world development workflows.',
    ],
    technologies: [
      'Python',
      'Django',
      'SQLite',
      'HTML5',
      'CSS3',
      'CRUD Operations',
      'MVT Architecture',
    ],
  },
];
