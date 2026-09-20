export interface LinkedInPost {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string;
  url: string;
  tags: string[];
}

export const linkedinPostsData: LinkedInPost[] = [
  {
    id: 'ibm-internship-post',
    title: 'Machine Learning & Applied AI Internship at BharatCares – IBM SkillsBuild',
    date: 'August 2026',
    category: 'Internship Update',
    description:
      'Excited to be working on Machine Learning and Applied AI models using IBM watsonx and Watson Studio in collaboration with AICTE, IBM SkillsBuild, and BharatCares, developing UN SDG-aligned AI solutions.',
    url: 'https://linkedin.com/in/taruntxe',
    tags: ['MachineLearning', 'AppliedAI', 'IBMwatsonx', 'AICTE'],
  },
  {
    id: 'portfolio-creator-post',
    title: 'Project Announcement: Portfolio Creator – Evaluation & Job Portal',
    date: 'September 2026',
    category: 'Project Launch',
    description:
      'Engineered a complete full-stack web platform using React.js, Node.js, Express, and MongoDB. Features JWT auth, live template customization, high-fidelity PDF export, portfolio evaluation system, and career opportunity matching.',
    image: '/projects/portfolio-creator/main-page.png',
    url: 'https://linkedin.com/in/taruntxe',
    tags: ['FullStack', 'ReactJS', 'NodeJS', 'MongoDB', 'WebDev'],
  },
  {
    id: 'genai-cert-post',
    title: 'Certified: Generative AI in Action by IBM SkillsBuild',
    date: 'August 2026',
    category: 'Certification Milestone',
    description:
      'Honored to achieve the Generative AI in Action credential from IBM SkillsBuild, exploring foundation models, prompt engineering, and real-world applied AI workflows.',
    url: 'https://linkedin.com/in/taruntxe',
    tags: ['GenerativeAI', 'IBM', 'Credentials', 'ContinuousLearning'],
  },
  {
    id: 'wheelchair-sih-post',
    title: 'Assistive Tech Innovation: Wheelchair Pressure Relief Pushup Detection',
    date: 'July 2026',
    category: 'Hackathon & Research',
    description:
      'Showcasing our computer vision solution using Google MediaPipe pose estimation and Random Forest classification to monitor posture and pushup frequency for wheelchair users to prevent pressure ulcers.',
    url: 'https://linkedin.com/in/taruntxe',
    tags: ['ComputerVision', 'OpenCV', 'MediaPipe', 'HealthcareAI'],
  },
  {
    id: 'udemy-bootcamp-post',
    title: 'The Complete Full-Stack Web Development Bootcamp Milestone',
    date: 'September 2026',
    category: 'Skill Building',
    description:
      'Completed comprehensive full-stack training covering end-to-end modern web technologies, backend architectures with Django & Node.js, database design, and frontend engineering.',
    url: 'https://linkedin.com/in/taruntxe',
    tags: ['WebDevelopment', 'React', 'Django', 'SoftwareEngineering'],
  },
];
