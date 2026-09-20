export interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  status: string;
  highlights: string[];
}

export const educationData: EducationItem[] = [
  {
    degree: 'Bachelor of Technology',
    field: 'Information Technology',
    institution: 'Institute of Engineering and Technology, University of Calicut',
    location: 'Malappuram, Kerala',
    period: '2023 – 2027',
    status: 'Final-year Undergraduate',
    highlights: [
      'Focus on Full-Stack Web Development, Machine Learning, and Applied AI',
      'Hands-on experience in building practical, real-world software applications',
      'Strong foundation in software engineering, model building, and problem-solving',
    ],
  },
];
