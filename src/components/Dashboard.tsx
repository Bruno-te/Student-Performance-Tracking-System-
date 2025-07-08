import React from 'react';
import { Users, UserCheck, TrendingUp, AlertTriangle, MessageSquare, Award } from 'lucide-react';
import { mockStudents, mockAttendance, mockAssessments, mockBehavioral } from '../data/mockData';
import { DashboardStats } from '../types';
import Modal from './Modal';
import { useState } from 'react';

const Dashboard: React.FC = () => {
  // Calculate dashboard statistics
  const stats: DashboardStats = {
    totalStudents: mockStudents.length,
    presentToday: mockAttendance.filter(a => a.status === 'present').length,
    attendanceRate: Math.round((mockAttendance.filter(a => a.status === 'present').length / mockStudents.length) * 100),
    avgScore: Math.round(mockAssessments.reduce((sum, score) => sum + (score.score / score.maxScore * 100), 0) / mockAssessments.length),
    behavioralIncidents: mockBehavioral.filter(b => b.type === 'negative').length,
    participationRate: 85 // Mock data
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  // Helper to open modal with content
  const openModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  // Drill-down content generators
  const showAllStudents = () => openModal('All Students', (
    <ul className="divide-y divide-gray-100">
      {mockStudents.map(s => (
        <li key={s.id} className="py-2 flex flex-col">
          <span className="font-medium">{s.name}</span>
          <span className="text-xs text-gray-500">{s.studentId}</span>
        </li>
      ))}
    </ul>
  ));

  const showAttendance = () => openModal('All Attendance Records', (
    <ul className="divide-y divide-gray-100">
      {mockAttendance.map(a => {
        const student = mockStudents.find(s => s.id === a.studentId);
        return (
          <li key={a.id} className="py-2 flex justify-between items-center">
            <span>{student?.name} <span className="text-xs text-gray-500">({student?.studentId})</span></span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              a.status === 'present' ? 'bg-green-100 text-green-700' :
              a.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
              a.status === 'absent' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>{a.status}</span>
          </li>
        );
      })}
    </ul>
  ));

  const showAssessments = () => openModal('All Assessments', (
    <ul className="divide-y divide-gray-100">
      {mockAssessments.map(a => {
        const student = mockStudents.find(s => s.id === a.studentId);
        const percentage = Math.round((a.score / a.maxScore) * 100);
        return (
          <li key={a.id} className="py-2 flex justify-between items-center">
            <span>{student?.name} <span className="text-xs text-gray-500">({student?.studentId})</span></span>
            <span>{a.subject} - {a.assessmentName}: <span className="font-medium">{percentage}%</span> <span className="text-xs text-gray-500">({a.score}/{a.maxScore})</span></span>
          </li>
        );
      })}
    </ul>
  ));

  const showBehavioral = () => openModal('Behavioral Incidents', (
    <ul className="divide-y divide-gray-100">
      {mockBehavioral.filter(b => b.type === 'negative').map(b => {
        const student = mockStudents.find(s => s.id === b.studentId);
        return (
          <li key={b.id} className="py-2 flex flex-col">
            <span>{student?.name} <span className="text-xs text-gray-500">({student?.studentId})</span></span>
            <span className="text-xs text-gray-500">{b.description}</span>
          </li>
        );
      })}
    </ul>
  ));

  const showParticipation = () => openModal('Participation Details', (
    <div>Participation details coming soon (mock data: 85%)</div>
  ));

  const showAchievements = () => openModal('Achievement Points', (
    <div>Achievement points details coming soon (mock data: 247 points)</div>
  ));

  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of student performance and school statistics</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today's Date</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleDateString('en-GB', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div onClick={showAllStudents} className="cursor-pointer">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
        />
        </div>
        <div onClick={showAttendance} className="cursor-pointer">
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={<UserCheck className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
          subtitle={`${stats.attendanceRate}% attendance rate`}
        />
        </div>
        <div onClick={showAssessments} className="cursor-pointer">
        <StatCard
          title="Average Score"
          value={`${stats.avgScore}%`}
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          color="bg-purple-50"
        />
        </div>
        <div onClick={showBehavioral} className="cursor-pointer">
        <StatCard
          title="Behavioral Incidents"
          value={stats.behavioralIncidents}
          icon={<AlertTriangle className="w-6 h-6 text-orange-600" />}
          color="bg-orange-50"
        />
        </div>
        <div onClick={showParticipation} className="cursor-pointer">
        <StatCard
          title="Participation Rate"
          value={`${stats.participationRate}%`}
          icon={<MessageSquare className="w-6 h-6 text-teal-600" />}
          color="bg-teal-50"
        />
        </div>
        <div onClick={showAchievements} className="cursor-pointer">
        <StatCard
          title="Achievement Points"
          value="247"
          icon={<Award className="w-6 h-6 text-yellow-600" />}
          color="bg-yellow-50"
        />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
          <div className="space-y-3">
            {mockAttendance.slice(0, 5).map((record) => {
              const student = mockStudents.find(s => s.id === record.studentId);
              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0 cursor-pointer hover:bg-gray-50"
                  onClick={() => openModal(`Attendance for ${student?.name}`, (
                    <ul>
                      {mockAttendance.filter(a => a.studentId === record.studentId).map(a => (
                        <li key={a.id} className="py-1 flex justify-between">
                          <span>{new Date(a.date).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            a.status === 'present' ? 'bg-green-100 text-green-700' :
                            a.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                            a.status === 'absent' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>{a.status}</span>
                        </li>
                      ))}
                    </ul>
                  ))}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {student?.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student?.name}</p>
                      <p className="text-xs text-gray-500">{student?.studentId}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    record.status === 'present' ? 'bg-green-100 text-green-700' :
                    record.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                    record.status === 'absent' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {record.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Assessments</h3>
          <div className="space-y-3">
            {mockAssessments.slice(0, 5).map((assessment) => {
              const student = mockStudents.find(s => s.id === assessment.studentId);
              const percentage = Math.round((assessment.score / assessment.maxScore) * 100);
              return (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0 cursor-pointer hover:bg-gray-50"
                  onClick={() => openModal(`Assessments for ${student?.name}`, (
                    <ul>
                      {mockAssessments.filter(a => a.studentId === assessment.studentId).map(a => (
                        <li key={a.id} className="py-1 flex justify-between">
                          <span>{a.subject} - {a.assessmentName}</span>
                          <span>{Math.round((a.score / a.maxScore) * 100)}% <span className="text-xs text-gray-500">({a.score}/{a.maxScore})</span></span>
                        </li>
                      ))}
                    </ul>
                  ))}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {student?.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student?.name}</p>
                      <p className="text-xs text-gray-500">{assessment.subject} - {assessment.assessmentName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{percentage}%</p>
                    <p className="text-xs text-gray-500">{assessment.score}/{assessment.maxScore}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Dashboard;