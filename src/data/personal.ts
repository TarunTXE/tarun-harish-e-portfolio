import profileImage from '../assets/profile';

export interface PersonalInfo {
  name: string;
  primaryTitle: string;
  animatedTitles: string[];
  summary: string;
  email: string;
  phone: string;
  phoneRaw: string;
  location: string;
  githubUrl: string;
  githubUsername: string;
  linkedinUrl: string;
  resumeUrl: string;
  avatarUrl: string;
}

export const personalData: PersonalInfo = {
  name: 'Tarun Harish E',
  primaryTitle: 'Full-Stack Developer',
  animatedTitles: [
    'MERN Stack Developer',
    'Machine Learning Enthusiast',
    'Applied AI Developer',
  ],
  summary:
    'Final-year B.Tech IT student with hands-on experience in full-stack web development (React.js, Node.js, MongoDB, Django) and Machine Learning & Applied AI. Strong foundation in software development, model building, problem-solving, and building practical, real-world applications.',
  email: 'tarunharish2k4@gmail.com',
  phone: '+91 7907272149',
  phoneRaw: '+917907272149',
  location: 'Malappuram, Kerala, India',
  githubUrl: 'https://github.com/TarunTXE',
  githubUsername: 'TarunTXE',
  linkedinUrl: 'https://linkedin.com/in/taruntxe',
  resumeUrl: '/Tarun_Harish_E_Resume.pdf',
  avatarUrl: profileImage,
};
