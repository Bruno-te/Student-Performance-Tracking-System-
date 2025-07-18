import React, { useState, useEffect } from 'react';
import { Search, Phone, Calendar, Award, TrendingUp, User } from 'lucide-react';
import { Student } from '../types';

const StudentProfiles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [participation, setParticipation] = useState<any[]>([]);
  const [behavioral, setBehavioral] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5051/api/students/').then(res => res.json()),
      fetch('http://localhost:5051/attendance').then(res => res.json()),
      fetch('http://localhost:5051/assessments').then(res => res.json()),
      fetch('http://localhost:5051/participation').then(res => res.json()),
      fetch('http://localhost:5051/behavioral').then(res => res.json()),
    ])
      .then(([studentsData, attendanceData, assessmentsData, participationData, behavioralData]) => {
        setStudents(studentsData);
        setAttendance(attendanceData);
        setAssessments(assessmentsData);
        setParticipation(participationData);
        setBehavioral(behavioralData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data from backend.');
        setLoading(false);
      });
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentStats = (studentId: string) => {
    const attendanceRecords = attendance.filter((a: any) => a.studentId === studentId);
    const assessmentRecords = assessments.filter((a: any) => a.studentId === studentId);
    const participationRecords = participation.filter((p: any) => p.studentId === studentId);
    const behavioralRecords = behavioral.filter((b: any) => b.studentId === studentId);

    const attendanceRate = attendanceRecords.length > 0 
      ? Math.round((attendanceRecords.filter((a: any) => a.status === 'present').length / attendanceRecords.length) * 100)
      : 0;

    const avgScore = assessmentRecords.length > 0
      ? Math.round(assessmentRecords.reduce((sum: number, a: any) => sum + (a.score / a.maxScore * 100), 0) / assessmentRecords.length)
      : 0;

    const avgParticipation = participationRecords.length > 0
      ? (participationRecords.reduce((sum: number, p: any) => sum + p.rating, 0) / participationRecords.length).toFixed(1)
      : '0.0';

    const positiveRecords = behavioralRecords.filter((b: any) => b.type === 'positive').length;
    const negativeRecords = behavioralRecords.filter((b: any) => b.type === 'negative').length;

    return {
      attendanceRate,
      avgScore,
      avgParticipation,
      positiveRecords,
      negativeRecords,
      totalAssessments: assessmentRecords.length,
      totalParticipation: participationRecords.length
    };
  };

  const StudentCard: React.FC<{ student: Student }> = ({ student }) => {
    const stats = getStudentStats(student.id);
    
    return (
      <div 
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setSelectedStudent(student)}
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-blue-700">
              {student.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-semibold text-lg text-gray-900">{student.name}</div>
            <div className="text-gray-500">{student.studentId}</div>
            <div className="text-gray-400 text-xs">{student.class}</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div>Attendance: <span className="font-semibold">{stats.attendanceRate}%</span></div>
          <div>Avg Score: <span className="font-semibold">{stats.avgScore}</span></div>
          <div>Participation: <span className="font-semibold">{stats.avgParticipation}</span></div>
          <div>+ Records: <span className="font-semibold text-green-600">{stats.positiveRecords}</span></div>
          <div>- Records: <span className="font-semibold text-red-600">{stats.negativeRecords}</span></div>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading student profiles...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
        {filteredStudents.map(student => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
};

export default StudentProfiles;