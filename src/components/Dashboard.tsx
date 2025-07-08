import React from 'react';
import { Users, UserCheck, TrendingUp, AlertTriangle, MessageSquare, Award, Search, Bell, Settings, Calendar, BookOpen, Trophy, Clock, Target } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Mock data
const mockStudents = [
  { id: 1, name: 'Uwimana Marie', studentId: 'RW001', avatar: 'UM', grade: 'A', subject: 'Mathematics' },
  { id: 2, name: 'Mugisha Patrick', studentId: 'RW002', avatar: 'MP', grade: 'B+', subject: 'English' },
  { id: 3, name: 'Ingabire Grace', studentId: 'RW003', avatar: 'IG', grade: 'A-', subject: 'Science' },
  { id: 4, name: 'Niyonzima Eric', studentId: 'RW004', avatar: 'NE', grade: 'B', subject: 'Mathematics' },
  { id: 5, name: 'Mukamana Sarah', studentId: 'RW005', avatar: 'MS', grade: 'A', subject: 'English' }
];

const mockAttendance = [
  { id: 1, studentId: 1, date: '2025-07-07', status: 'present' },
  { id: 2, studentId: 2, date: '2025-07-07', status: 'late' },
  { id: 3, studentId: 3, date: '2025-07-07', status: 'absent' },
  { id: 4, studentId: 4, date: '2025-07-07', status: 'present' },
  { id: 5, studentId: 5, date: '2025-07-07', status: 'present' }
];

const mockAssessments = [
  { id: 1, studentId: 1, subject: 'Mathematics', assessmentName: 'Fractions Test', score: 85, maxScore: 100 },
  { id: 2, studentId: 2, subject: 'Mathematics', assessmentName: 'Fractions Test', score: 78, maxScore: 100 },
  { id: 3, studentId: 3, subject: 'English', assessmentName: 'Grammar Quiz', score: 92, maxScore: 100 },
  { id: 4, studentId: 4, subject: 'Science', assessmentName: 'Plant Biology', score: 88, maxScore: 100 },
  { id: 5, studentId: 5, subject: 'Mathematics', assessmentName: 'Algebra Test', score: 76, maxScore: 100 }
];

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const stats = {
    totalStudents: mockStudents.length,
    presentToday: mockAttendance.filter(a => a.date === '2025-07-07' && a.status === 'present').length,
    attendanceRate: Math.round((mockAttendance.filter(a => a.date === '2025-07-07' && a.status === 'present').length / mockStudents.length) * 100),
    avgScore: Math.round(mockAssessments.reduce((sum, score) => sum + (score.score / score.maxScore * 100), 0) / mockAssessments.length),
    completedAssignments: 28,
    activeProjects: 12
  };

  const openModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const attendanceData = [
    { name: 'Mon', present: 4, total: 5 },
    { name: 'Tue', present: 5, total: 5 },
    { name: 'Wed', present: 3, total: 5 },
    { name: 'Thu', present: 4, total: 5 },
    { name: 'Fri', present: 5, total: 5 },
    { name: 'Sat', present: 4, total: 5 },
    { name: 'Sun', present: 3, total: 5 }
  ];

  const subjectData = [
    { subject: 'Math', value: 85, color: '#6366f1' },
    { subject: 'English', value: 92, color: '#10b981' },
    { subject: 'Science', value: 78, color: '#f59e0b' },
    { subject: 'History', value: 88, color: '#ef4444' }
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  // Top students mock data
  const topStudents = [
    { id: 1, name: 'Uwimana Marie', grade: 'A', avatar: 'UM', avgScore: 92, attendance: 98, subjects: [{ name: 'Math', score: 95 }, { name: 'English', score: 90 }] },
    { id: 2, name: 'Ingabire Grace', grade: 'A-', avatar: 'IG', avgScore: 89, attendance: 96, subjects: [{ name: 'Math', score: 88 }, { name: 'English', score: 90 }] },
    { id: 3, name: 'Mukamana Sarah', grade: 'B+', avatar: 'MS', avgScore: 85, attendance: 94, subjects: [{ name: 'Math', score: 80 }, { name: 'English', score: 90 }] },
  ];

  // Recent activities mock data
  const recentActivities = [
    { id: 1, type: 'assignment', student: 'Uwimana Marie', detail: 'Submitted Algebra Homework', time: '2 hours ago' },
    { id: 2, type: 'attendance', student: 'Mugisha Patrick', detail: 'Marked present', time: 'Today, 8:00 AM' },
    { id: 3, type: 'comment', student: 'Ingabire Grace', detail: 'Teacher commented on Science project', time: 'Yesterday' },
  ];

  // State for modals
  const [studentModal, setStudentModal] = useState<{ open: boolean; student: any | null }>({ open: false, student: null });
  const [activityModal, setActivityModal] = useState<{ open: boolean; activity: any | null }>({ open: false, activity: null });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
            
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
        </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Teacher!</h2>
              <p className="text-gray-600">Here's what's happening in your classroom today</p>
        </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">
            {new Date().toLocaleDateString('en-GB', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                +2.5%
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.totalStudents}</p>
              <p className="text-sm text-gray-500">Total Students</p>
        </div>
      </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                {stats.attendanceRate}%
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.presentToday}</p>
              <p className="text-sm text-gray-500">Present Today</p>
            </div>
      </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
                {stats.avgScore}%
                      </span>
                    </div>
                    <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.completedAssignments}</p>
              <p className="text-sm text-gray-500">Assignments Done</p>
                    </div>
                  </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                Active
                  </span>
                </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.activeProjects}</p>
              <p className="text-sm text-gray-500">Active Projects</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 justify-items-center">
          {/* Attendance Trend Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col mb-8 w-full max-w-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Attendance Trend (7 days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: 14 }} />
                <Line 
                  type="monotone" 
                  dataKey="present" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Students Present"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Subject Performance Radar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col mb-8 w-full max-w-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Subject Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius={90} data={subjectData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 14, fill: '#334155' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Radar name="Avg Score" dataKey="avgScore" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: 14 }} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Students & Recent Activities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Top Students */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Students</h3>
            <ul className="divide-y divide-gray-100">
              {topStudents.map((student, idx) => (
                <li
                  key={student.id}
                  className="flex items-center justify-between py-4 px-2 rounded-xl transition-all duration-200 cursor-pointer hover:bg-blue-50 hover:shadow-md"
                  onClick={() => setStudentModal({ open: true, student })}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700">
                      {student.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-base">{idx + 1}. {student.name}</p>
                      <p className="text-xs text-gray-500">Grade: {student.grade}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-primary font-bold text-lg">{student.avgScore}%</span>
                    <span className="text-xs text-gray-400">Avg. Score</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
            <ul className="divide-y divide-gray-100">
              {recentActivities.map(activity => (
                <li
                  key={activity.id}
                  className="flex items-center justify-between py-4 px-2 rounded-xl transition-all duration-200 cursor-pointer hover:bg-primary/10 hover:scale-[1.02]"
                  onClick={() => setActivityModal({ open: true, activity })}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      {activity.type === 'assignment' && <BookOpen className="w-5 h-5 text-primary group-hover:text-primary-dark" />}
                      {activity.type === 'attendance' && <Clock className="w-5 h-5 text-success group-hover:text-success-dark" />}
                      {activity.type === 'comment' && <MessageSquare className="w-5 h-5 text-secondary group-hover:text-secondary-dark" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{activity.detail}</p>
                      <p className="text-xs text-gray-500">{activity.student}</p>
                  </div>
                </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Student Modal */}
        <Modal isOpen={studentModal.open} onClose={() => setStudentModal({ open: false, student: null })} title={studentModal.student?.name || ''}>
          {studentModal.student && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
                  {studentModal.student.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{studentModal.student.name}</p>
                  <p className="text-sm text-gray-500">Grade: {studentModal.student.grade}</p>
                  <p className="text-sm text-gray-500">Attendance: {studentModal.student.attendance}%</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Subject Breakdown</h4>
                <ul className="space-y-1">
                  {studentModal.student.subjects.map((sub: any) => (
                    <li key={sub.name} className="flex justify-between text-sm">
                      <span>{sub.name}</span>
                      <span className="font-medium text-primary">{sub.score}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Modal>

        {/* Activity Modal */}
        <Modal isOpen={activityModal.open} onClose={() => setActivityModal({ open: false, activity: null })} title="Activity Details">
          {activityModal.activity && (
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">{activityModal.activity.detail}</p>
              <p className="text-sm text-gray-500">Student: {activityModal.activity.student}</p>
              <p className="text-sm text-gray-500">Type: {activityModal.activity.type}</p>
              <p className="text-xs text-gray-400">{activityModal.activity.time}</p>
            </div>
          )}
        </Modal>

      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Dashboard;