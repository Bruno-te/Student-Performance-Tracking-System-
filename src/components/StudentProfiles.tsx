import React, { useState, useEffect } from 'react';
import { Search, Phone, Calendar, Award, TrendingUp, User } from 'lucide-react';
import { Student } from '../types';
import ClassGridSelector from './ClassGridSelector';
import Modal from './Modal';

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
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

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

  // Only show students in the selected class
  const filteredStudents = students
    .filter(student => selectedClassId == null || student.class_id === selectedClassId)
    .filter(student =>
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

  if (!selectedClassId) {
    return <ClassGridSelector onSelect={setSelectedClassId} />;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/students/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 border border-blue-500 text-blue-600 rounded-lg text-xs hover:bg-blue-50 transition"
            title="View API endpoint"
          >
            API
          </a>
          <button className="text-blue-600 underline text-sm font-medium ml-2" onClick={() => setSelectedClassId(null)}>Change Class</button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
        {filteredStudents.map(student => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
      {/* Student Details Modal */}
      <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title={selectedStudent ? selectedStudent.name : ''}>
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {selectedStudent.profileImage ? (
                <img src={selectedStudent.profileImage} alt={selectedStudent.name} className="w-20 h-20 rounded-full object-cover border" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <div>
                <div className="font-semibold text-xl text-gray-900">{selectedStudent.name}</div>
                <div className="text-gray-500">ID: {selectedStudent.studentId}</div>
                <div className="text-gray-400 text-sm">Class: {selectedStudent.class} | Grade: {selectedStudent.grade}</div>
                <div className="text-gray-400 text-sm">Age: {selectedStudent.age}</div>
                <div className="text-gray-400 text-sm">Enrolled: {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold text-gray-700 mb-1">Guardian</div>
                <div className="text-gray-900">{selectedStudent.guardianName}</div>
                <div className="text-gray-500 text-sm">{selectedStudent.guardianPhone}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Stats</div>
                {(() => { const stats = getStudentStats(selectedStudent.id); return (
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>Attendance Rate: <span className="font-semibold">{stats.attendanceRate}%</span></li>
                    <li>Avg Score: <span className="font-semibold">{stats.avgScore}</span></li>
                    <li>Participation: <span className="font-semibold">{stats.avgParticipation}</span></li>
                    <li>+ Records: <span className="font-semibold text-green-600">{stats.positiveRecords}</span></li>
                    <li>- Records: <span className="font-semibold text-red-600">{stats.negativeRecords}</span></li>
                    <li>Total Assessments: <span className="font-semibold">{stats.totalAssessments}</span></li>
                    <li>Total Participation: <span className="font-semibold">{stats.totalParticipation}</span></li>
                  </ul>
                ); })()}
              </div>
            </div>
            {/* Attendance History */}
            <div>
              <div className="font-semibold text-gray-700 mb-2">Attendance History</div>
              <div className="max-h-32 overflow-y-auto border rounded-lg bg-gray-50 p-2">
                {attendance.filter(a => a.studentId === selectedStudent.id).length === 0 ? (
                  <div className="text-gray-400 text-sm">No attendance records found.</div>
                ) : (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="text-left">Date</th>
                        <th className="text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.filter(a => a.studentId === selectedStudent.id).map((a, i) => (
                        <tr key={i}>
                          <td>{new Date(a.date).toLocaleDateString()}</td>
                          <td className={
                            a.status === 'present' ? 'text-green-600' :
                            a.status === 'absent' ? 'text-red-600' :
                            a.status === 'late' ? 'text-yellow-600' :
                            'text-blue-600'
                          }>{a.status.charAt(0).toUpperCase() + a.status.slice(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            {/* Participation Logs */}
            <div>
              <div className="font-semibold text-gray-700 mb-2">Participation Logs</div>
              <div className="max-h-32 overflow-y-auto border rounded-lg bg-gray-50 p-2">
                {participation.filter(p => p.studentId === selectedStudent.id).length === 0 ? (
                  <div className="text-gray-400 text-sm">No participation logs found.</div>
                ) : (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="text-left">Date</th>
                        <th className="text-left">Subject</th>
                        <th className="text-left">Type</th>
                        <th className="text-left">Description</th>
                        <th className="text-left">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participation.filter(p => p.studentId === selectedStudent.id).map((p, i) => (
                        <tr key={i}>
                          <td>{new Date(p.date).toLocaleDateString()}</td>
                          <td>{p.subject}</td>
                          <td>{p.activityType.replace('_', ' ')}</td>
                          <td>{p.description}</td>
                          <td className="text-yellow-600 font-semibold">{p.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentProfiles;