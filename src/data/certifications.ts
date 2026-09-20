export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  badge: string;
  description: string;
  skills: string[];
  verifyUrl?: string;
}

export const certificationsData: CertificationItem[] = [
  {
    id: 'ibm-genai',
    title: 'Generative AI in Action',
    issuer: 'IBM SkillsBuild',
    date: 'Aug. 2026',
    badge: 'IBM Credential',
    description:
      'Credential covering practical Generative AI concepts, prompt engineering, LLM architectures, foundation models, and ethical AI deployment on IBM watsonx.',
    skills: ['Generative AI', 'IBM watsonx', 'LLMs', 'Prompt Engineering', 'AI Ethics'],
  },
  {
    id: 'udemy-fullstack',
    title: 'The Complete Full-Stack Web Development Bootcamp',
    issuer: 'Udemy',
    date: 'Sept. 2026',
    badge: 'Bootcamp Graduate',
    description:
      'Comprehensive full-stack engineering curriculum covering frontend, backend, REST APIs, databases, authentication, and cloud deployment with React, Node.js, Express, and MongoDB.',
    skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST APIs'],
  },
];
