export interface Student {
  id: string;
  name: string;
  studentId: string;
  class: string;
  grade: string;
  age: number;
  guardianName: string;
  guardianPhone: string;
  enrollmentDate: string;
  profileImage?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  markedBy: string;
  timestamp: string;
}

export interface AssessmentScore {
  id: string;
  studentId: string;
  subject: string;
  assessmentType: 'test' | 'quiz' | 'exam' | 'assignment' | 'project';
  assessmentName: string;
  score: number;
  maxScore: number;
  date: string;
  term: string;
  teacherId: string;
  notes?: string;
}

export interface ParticipationLog {
  id: string;
  studentId: string;
  date: string;
  subject: string;
  activityType: 'answer' | 'question' | 'discussion' | 'presentation' | 'group_work';
  description: string;
  rating: 1 | 2 | 3 | 4 | 5;
  teacherId: string;
  timestamp: string;
}

export interface BehavioralRecord {
  id: string;
  studentId: string;
  date: string;
  type: 'positive' | 'negative';
  category: 'discipline' | 'leadership' | 'cooperation' | 'respect' | 'punctuality' | 'other';
  description: string;
  severity?: 'low' | 'medium' | 'high';
  actionTaken?: string;
  reportedBy: string;
  timestamp: string;
}

export interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  attendanceRate: number;
  avgScore: number;
  behavioralIncidents: number;
  participationRate: number;
}