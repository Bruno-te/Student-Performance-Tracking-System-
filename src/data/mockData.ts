import { Student, AttendanceRecord, AssessmentScore, ParticipationLog, BehavioralRecord } from '../types';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Uwimana Marie',
    studentId: 'RW001',
    class: 'Primary 6A',
    grade: 'P6',
    age: 12,
    guardianName: 'Uwimana Jean',
    guardianPhone: '+250788123456',
    enrollmentDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Mugisha Patrick',
    studentId: 'RW002',
    class: 'Primary 6A',
    grade: 'P6',
    age: 13,
    guardianName: 'Mugisha Alice',
    guardianPhone: '+250788234567',
    enrollmentDate: '2024-01-15'
  },
  {
    id: '3',
    name: 'Ingabire Grace',
    studentId: 'RW003',
    class: 'Primary 6A',
    grade: 'P6',
    age: 12,
    guardianName: 'Ingabire Paul',
    guardianPhone: '+250788345678',
    enrollmentDate: '2024-01-15'
  },
  {
    id: '4',
    name: 'Niyonzima Eric',
    studentId: 'RW004',
    class: 'Primary 6A',
    grade: 'P6',
    age: 13,
    guardianName: 'Niyonzima Rose',
    guardianPhone: '+250788456789',
    enrollmentDate: '2024-01-15'
  },
  {
    id: '5',
    name: 'Keza Sylvie',
    studentId: 'RW005',
    class: 'Primary 6A',
    grade: 'P6',
    age: 12,
    guardianName: 'Keza Vincent',
    guardianPhone: '+250788567890',
    enrollmentDate: '2024-01-15'
  }
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '1',
    date: '2025-01-15',
    status: 'present',
    markedBy: 'Teacher ',
    timestamp: '2025-01-15T08:00:00Z'
  },
  {
    id: '2',
    studentId: '2',
    date: '2025-01-15',
    status: 'late',
    notes: 'Arrived 10 minutes late',
    markedBy: 'Teacher ',
    timestamp: '2025-01-15T08:10:00Z'
  },
  {
    id: '3',
    studentId: '3',
    date: '2025-01-15',
    status: 'absent',
    notes: 'Sick',
    markedBy: 'Teacher ',
    timestamp: '2025-01-15T08:00:00Z'
  },
  {
    id: '4',
    studentId: '4',
    date: '2025-01-15',
    status: 'present',
    markedBy: 'Teacher ',
    timestamp: '2025-01-15T08:00:00Z'
  },
  {
    id: '5',
    studentId: '5',
    date: '2025-01-15',
    status: 'present',
    markedBy: 'Teacher ',
    timestamp: '2025-01-15T08:00:00Z'
  }
];

export const mockAssessments: AssessmentScore[] = [
  {
    id: '1',
    studentId: '1',
    subject: 'Mathematics',
    assessmentType: 'test',
    assessmentName: 'Fractions Test',
    score: 85,
    maxScore: 100,
    date: '2025-01-10',
    term: 'Term 1',
    teacherId: 'teacher1'
  },
  {
    id: '2',
    studentId: '2',
    subject: 'Mathematics',
    assessmentType: 'test',
    assessmentName: 'Fractions Test',
    score: 78,
    maxScore: 100,
    date: '2025-01-10',
    term: 'Term 1',
    teacherId: 'teacher1'
  },
  {
    id: '3',
    studentId: '1',
    subject: 'English',
    assessmentType: 'quiz',
    assessmentName: 'Grammar Quiz',
    score: 92,
    maxScore: 100,
    date: '2025-01-12',
    term: 'Term 1',
    teacherId: 'teacher2'
  }
];

export const mockParticipation: ParticipationLog[] = [
  {
    id: '1',
    studentId: '1',
    date: '2025-01-15',
    subject: 'Mathematics',
    activityType: 'answer',
    description: 'Correctly solved fraction problem on board',
    rating: 5,
    teacherId: 'teacher1',
    timestamp: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    studentId: '2',
    date: '2025-01-15',
    subject: 'English',
    activityType: 'discussion',
    description: 'Active participation in reading comprehension discussion',
    rating: 4,
    teacherId: 'teacher2',
    timestamp: '2025-01-15T11:15:00Z'
  }
];

export const mockBehavioral: BehavioralRecord[] = [
  {
    id: '1',
    studentId: '1',
    date: '2025-01-14',
    type: 'positive',
    category: 'leadership',
    description: 'Helped organize classroom materials and assisted other students',
    reportedBy: 'Teacher ',
    timestamp: '2025-01-14T14:00:00Z'
  },
  {
    id: '2',
    studentId: '3',
    date: '2025-01-13',
    type: 'negative',
    category: 'discipline',
    description: 'Disrupted class by talking during lesson',
    severity: 'low',
    actionTaken: 'Verbal warning given',
    reportedBy: 'Teacher ',
    timestamp: '2025-01-13T09:30:00Z'
  }
];