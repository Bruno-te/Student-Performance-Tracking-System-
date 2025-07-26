import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Users, UserCheck, TrendingUp, AlertTriangle, MessageSquare, Award, Search, Bell, Settings, Calendar, BookOpen, Trophy, Clock, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const Dashboard = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentModal, setStudentModal] = useState<{ open: boolean; student: any | null }>({ open: false, student: null });
  const [activityModal, setActivityModal] = useState<{ open: boolean; activity: any | null }>({ open: false, activity: null });
  const [behavioral, setBehavioral] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch('http://localhost:5051/api/students/').then(res => res.json()),
      fetch('http://localhost:5051/attendance').then(res => res.json()),
      fetch('http://localhost:5051/assessments').then(res => res.json()),
      fetch('http://localhost:5051/behavioral').then(res => res.json()),
    ])
      .then(([studentsData, attendanceData, assessmentsData, behavioralData]) => {
        setStudents(studentsData);
        setAttendance(attendanceData);
        setAssessments(assessmentsData);
        setBehavioral(behavioralData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data from backend.');
        setLoading(false);
      });
  }, []);

  // Restore all logic to use students, attendance, and assessments as before
  const today = new Date().toISOString().split('T')[0];
  const presentToday = attendance.filter(a => a.date === today && a.status === 'present').length;
  const attendanceRate = students.length > 0 ? Math.round((presentToday / students.length) * 100) : 0;
  const avgScore = assessments.length > 0 ? Math.round(assessments.reduce((sum, score) => sum + (score.score / score.max_score * 100), 0) / assessments.length) : 0;
  const stats = {
    totalStudents: students.length,
    presentToday,
    attendanceRate,
    avgScore,
    completedAssignments: assessments.filter(a => a.completed).length,
    activeProjects: 12 // Placeholder, update if you have this data
  };

  // Attendance trend for the last 7 days
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };
  const last7Days = getLast7Days();
  const attendanceTrend = last7Days.map(date => {
    const present = attendance.filter(a => a.date === date && a.status === 'present').length;
    return { name: new Date(date).toLocaleDateString('en-GB', { weekday: 'short' }), present, total: students.length };
  });

  // Subject performance (example: group by subject, average score)
  const subjectScores: { [subject: string]: { total: number; count: number } } = {};
  assessments.forEach(a => {
    if (!subjectScores[a.subject]) subjectScores[a.subject] = { total: 0, count: 0 };
    subjectScores[a.subject].total += (a.score / a.max_score) * 100;
    subjectScores[a.subject].count += 1;
  });
  const subjectData = Object.entries(subjectScores).map(([subject, { total, count }]) => ({
    subject,
    avgScore: count > 0 ? Math.round(total / count) : 0
  }));

  // Top students by average assessment score
  const studentScores: { [id: string]: { name: string; total: number; count: number } } = {};
  assessments.forEach(a => {
    const student = students.find(s => s.id === a.student_id);
    if (!student) return;
    if (!studentScores[student.id]) studentScores[student.id] = { name: student.name, total: 0, count: 0 };
    studentScores[student.id].total += (a.score / a.max_score) * 100;
    studentScores[student.id].count += 1;
  });
  const topStudents = Object.entries(studentScores)
    .map(([id, { name, total, count }]) => ({
      id,
      name,
      avgScore: count > 0 ? Math.round(total / count) : 0
    }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 3);

  // Recent activities (example: recent attendance and assessment submissions)
  const recentAttendance = attendance.slice(-3).map(a => ({
    id: a.id,
    type: 'attendance',
    student: students.find(s => s.id === a.student_id)?.name || 'Unknown',
    detail: `Marked ${a.status}`,
    time: a.date
  }));
  const recentAssessments = assessments.slice(-3).map(a => ({
    id: a.id,
    type: 'assignment',
    student: students.find(s => s.id === a.student_id)?.name || 'Unknown',
    detail: `Submitted ${a.subject} ${a.assessment_type ? a.assessment_type.charAt(0).toUpperCase() + a.assessment_type.slice(1) : 'Assessment'}`,
    time: a.date
  }));
  const recentActivities = [...recentAttendance, ...recentAssessments]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  // At-risk logic
  const failingStudents = students.filter(student => {
    const studentAssessments = assessments.filter(a => a.student_id === student.id);
    if (studentAssessments.length === 0) return false;
    const avg = studentAssessments.reduce((sum, a) => sum + (a.score / a.max_score * 100), 0) / studentAssessments.length;
    return avg < 40;
  });
  const missingClassStudents = students.filter(student => {
    const studentAttendance = attendance.filter(a => a.student_id === student.id);
    if (studentAttendance.length === 0) return false;
    const present = studentAttendance.filter(a => a.status === 'present').length;
    const rate = present / studentAttendance.length;
    return rate < 0.75;
  });
  const badBehaviorStudents = students.filter(student => {
    const negatives = behavioral.filter(b => b.student_id === student.id && b.type === 'negative').length;
    return negatives >= 3;
  });
  const anyAtRisk = failingStudents.length > 0 || missingClassStudents.length > 0 || badBehaviorStudents.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* At-Risk Alert */}
      {anyAtRisk && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-3xl mx-auto mt-6 mb-6" role="alert">
          <strong className="font-bold">Attention:</strong>
          <span className="block sm:inline ml-2">Some students are at risk:</span>
          {failingStudents.length > 0 && (
            <div className="mt-2"><strong>Failing Subjects:</strong> {failingStudents.map(s => s.name).join(', ')}</div>
          )}
          {missingClassStudents.length > 0 && (
            <div className="mt-2"><strong>Missing Classes:</strong> {missingClassStudents.map(s => s.name).join(', ')}</div>
          )}
          {badBehaviorStudents.length > 0 && (
            <div className="mt-2"><strong>Bad Behavior:</strong> {badBehaviorStudents.map(s => s.name).join(', ')}</div>
          )}
        </div>
      )}
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                />
              </div>
              <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors w-full sm:w-auto">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors w-full sm:w-auto">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 py-4 sm:px-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-2 leading-tight">Welcome back, Teacher!</h2>
              <p className="text-base sm:text-lg font-light text-gray-600">Here's what's happening in your classroom today</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 mt-2 sm:mt-0">
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
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 md:grid-cols-4 sm:gap-6 sm:mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.totalStudents}</p>
              <p className="text-sm font-light text-gray-500">Total Students</p>
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
              <p className="text-sm font-light text-gray-500">Present Today</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.avgScore}%</p>
              <p className="text-sm font-light text-gray-500">Avg. Assessment Score</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.activeProjects}</p>
              <p className="text-sm font-light text-gray-500">Active Projects</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 sm:gap-8 sm:mb-12 justify-items-center">
          {/* Attendance Trend Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col mb-8 w-full max-w-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Attendance Trend (7 days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, students.length]} tick={{ fontSize: 12 }} />
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
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 sm:gap-8 sm:mb-12">
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
                      {student.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-base">{idx + 1}. {student.name}</p>
                      <p className="text-xs text-gray-500">Avg. Score: {student.avgScore}%</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-primary font-bold text-lg">{student.avgScore}%</span>
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
                  {studentModal.student.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{studentModal.student.name}</p>
                  <p className="text-sm text-gray-500">Avg. Score: {studentModal.student.avgScore}%</p>
                </div>
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
    </div>
  );
};

export default Dashboard;