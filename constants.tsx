import { UserProfile, Message, Connection } from './types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'u1',
    name: 'bhavana',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bhavana',
    email: 'bhavanasingupurapu@gmail.com',
    emailVerified: false,
    role: 'student',
    gradeOrClass: 'Final Year B.Tech',
    department: 'Computer Science',
    enrolledCourses: ['CS101'],
    subjects: [
      { name: 'English', strength: 'moderate' },
      { name: 'Biology', strength: 'weak' },
      { name: 'Physics', strength: 'strong' }
    ],
    skills: ['React', 'TypeScript'],
    interests: ['Web Dev'],
    bio: 'I m a Btech 4th y r student in Gvpcew',
    availability: 'online',
    completeness: 75
  }
];

export const INITIAL_MESSAGES: Message[] = [];
export const INITIAL_CONNECTIONS: Connection[] = [];