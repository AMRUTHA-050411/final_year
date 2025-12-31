export type UserRole = 'student' | 'faculty' | 'admin';
export type SubjectStrength = 'weak' | 'moderate' | 'strong';

export interface SubjectRating {
  name: string;
  strength: SubjectStrength;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  gradeOrClass: string;
  department: string;
  enrolledCourses: string[];
  subjects: SubjectRating[];
  skills: string[];
  interests: string[];
  bio: string;
  availability: 'online' | 'away' | 'offline';
  completeness: number; // 0-100
}

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | 'none';

export interface Connection {
  id: string;
  fromUserId: string | UserProfile;
  toUserId: string | UserProfile;
  status: ConnectionStatus;
  timestamp: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'resource' | 'question';
  timestamp: number;
  read: boolean;
  metadata?: {
    link?: string;
    fileName?: string;
    fileType?: string;
  };
}

export interface RoomMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  timestamp: number;
}

export type NotificationType = 'invitation' | 'acceptance' | 'rejection' | 'message' | 'resource';

export interface AppNotification {
  id: string;
  userId: string;
  fromUserId: string | UserProfile;
  type: NotificationType;
  content: string;
  timestamp: number;
  read: boolean;
}

export type StudySessionType = 'Exam Preparation' | 'Assignment Discussion' | 'General Study';
export type StudyRoomStatus = 'active' | 'scheduled' | 'completed';

export interface StudyRoom {
  id: string;
  name: string;
  type: StudySessionType;
  status: StudyRoomStatus;
  subject: string;
  topic: string;
  description?: string;
  duration: string;
  maxParticipants: number;
  currentParticipants: string[]; // User IDs
  creatorId: string;
  startTime?: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Assignment {
  id: string;
  userId: string;
  title: string;
  subject: string;
  deadline: number;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  type: 'standard' | 'mcq';
  questions?: Question[];
  score?: number;
  userAnswers?: Record<number, number>;
}

export interface AppState {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  connections: Connection[];
  messages: Message[];
  roomMessages: RoomMessage[];
  notifications: AppNotification[];
  mutedBuddies: string[];
  studyRooms: StudyRoom[];
  assignments: Assignment[];
}