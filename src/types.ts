export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Patient' | 'Doctor' | 'Admin';
  avatar?: string;
  phone?: string;
  joinedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  hospital: string;
  availability: string[];
  avatar: string;
  fees: number;
  chatEnabled: boolean;
  videoEnabled: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  type: 'Chat' | 'Video' | 'In-Person';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  reports?: string[];
  prescription?: string;
}

export interface AIResult {
  id: string;
  userId: string;
  date: string;
  imageType: 'Mammogram' | 'Ultrasound' | 'Self-Exam Photo';
  fileName: string;
  prediction: string;
  confidence: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendations: string[];
  chartData: { name: string; value: number; color: string }[];
  evaluationMode?: 'Local On-Device Engine' | 'Sandboxed Cloud AI Stream';
  privacyAudit?: {
    persisted: boolean;
    anonymized: boolean;
    sslStream: boolean;
    storageBytes: number;
    compliance: string;
    deIdentifiedHash?: string;
  };
}

export interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  role: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  likedBy: string[]; // User IDs
  comments: Comment[];
  shares: number;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'Pending' | 'Resolved';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'Appointment' | 'AI' | 'Forum' | 'System';
}
