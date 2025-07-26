import React, { useState, useEffect } from 'react';
import { Search, Phone, Calendar, Award, TrendingUp, User, Edit, Printer } from 'lucide-react';
import { Student } from '../types';
import ClassGridSelector from './ClassGridSelector';
import Modal from './Modal';

// Extend Student type to include guardians, emergencyContacts, and gender for this component
interface StudentWithContacts extends Student {
  gender?: string;
  subclass?: string;
  guardians?: Array<{
    firstName: string;
    lastName: string;
    relationship: string;
    contact: string;
  }>;
  emergencyContacts?: Array<{
    firstName: string;
    lastName: string;
    relationship: string;
    contact: string;
  }>;
}

const StudentProfiles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<StudentWithContacts[]>([]);
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
        setStudents(studentsData.map((s: any) => ({
          id: s.id,
          name: s.name,
          studentId: s.id, // or s.studentId if available
          class: String(s.class_id ?? ''),
          grade: s.grade ?? '',
          age: s.age ?? '',
          gender: s.gender ?? '',
          subclass: s.subclass ?? '',
          guardianName: s.guardian_name ?? s.guardianName ?? '',
          guardianPhone: s.guardian_phone ?? s.guardianPhone ?? s.guardian_contact ?? '',
          enrollmentDate: s.enrollment_date ?? s.enrollmentDate ?? '',
          profileImage: s.profile_image ?? s.profileImage ?? undefined,
          guardians: s.guardians ?? [],
          emergencyContacts: s.emergencyContacts ?? [],
        })));
        setAttendance(attendanceData.map((a: any) => ({
          ...a,
          studentId: a.student_id,
          status: a.status ?? a.attendance_status ?? '',
          date: a.date ?? a.attendance_date ?? a.timestamp ?? '',
          markedBy: a.marked_by ?? a.teacher_id ?? '',
        })));
        setAssessments(assessmentsData.map((a: any) => ({
          ...a,
          studentId: a.student_id,
          assessmentType: a.assessment_type,
          assessmentName: a.assessment_name,
          maxScore: a.max_score,
          teacherId: a.teacher_id,
        })));
        setParticipation(participationData.map((p: any) => ({
          ...p,
          studentId: p.student_id,
          subject: p.subject || p.event_name || '',
          activityType: p.activity_type || p.type || '',
          description: p.description || p.remarks || '',
          rating: p.rating ?? p.status ?? 0,
          date: p.date || p.timestamp || '',
          teacherId: p.teacher_id ?? '',
        })));
        setBehavioral(behavioralData.map((b: any) => ({
          ...b,
          studentId: b.student_id,
          actionTaken: b.action_taken,
          reportedBy: b.reported_by,
        })));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data from backend.');
        setLoading(false);
      });
  }, []);

  // Only show students in the selected class
  const filteredStudents = students
    .filter(student => selectedClassId == null || student.class === String(selectedClassId))
    .filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(student => genderFilter === '' || (student.gender && student.gender.toLowerCase() === genderFilter));

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

  const StudentCard: React.FC<{ student: StudentWithContacts }> = ({ student }) => {
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full">
          <div className="flex items-center gap-2 w-full">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={genderFilter}
            onChange={e => setGenderFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button className="text-blue-600 underline text-sm font-medium ml-2" onClick={() => setSelectedClassId(null)}>Change Class</button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
        {filteredStudents.map(student => (
          <StudentCard key={student.id} student={student as StudentWithContacts} />
        ))}
      </div>
      {/* Student Details Modal */}
      <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title={selectedStudent ? selectedStudent.name : ''}>
        {selectedStudent && (() => {
          const student: StudentWithContacts = selectedStudent as StudentWithContacts;
          // Color avatar based on class
          const avatarColors = [
            'bg-blue-100 text-blue-700 border-blue-200',
            'bg-green-100 text-green-700 border-green-200',
            'bg-yellow-100 text-yellow-700 border-yellow-200',
            'bg-purple-100 text-purple-700 border-purple-200',
            'bg-pink-100 text-pink-700 border-pink-200',
            'bg-red-100 text-red-700 border-red-200',
          ];
          const avatarColor = avatarColors[(parseInt(student.class) - 1) % avatarColors.length] || avatarColors[0];
          return (
            <div className="space-y-4 p-1 w-full max-w-[98vw] mx-auto bg-white border border-gray-300 rounded-2xl shadow-2xl sm:p-4 sm:max-w-[500px] md:max-w-[600px] relative">
              {/* Sticky close button for mobile */}
              <button className="absolute top-2 right-2 z-10 bg-white rounded-full shadow p-1 sm:hidden" onClick={() => setSelectedStudent(null)}>
                ×
              </button>
              {/* Profile Header */}
              <div className="flex flex-col items-center gap-2 border-b pb-2 sm:flex-row sm:items-center sm:gap-6 sm:pb-4">
                {selectedStudent.profileImage ? (
                  <img src={selectedStudent.profileImage} alt={selectedStudent.name} className="w-12 h-12 rounded-full object-cover border-4 border-blue-200 shadow sm:w-20 sm:h-20" />
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 shadow sm:w-20 sm:h-20 sm:text-3xl ${avatarColor}`}>
                    {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div className="flex-1 w-full min-w-0 space-y-1 sm:space-y-2">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <span className="font-semibold text-base text-gray-900 truncate sm:text-2xl">{selectedStudent.name}</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">Class: {selectedStudent.class}</span>
                    {selectedStudent.grade && <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">Grade: {selectedStudent.grade}</span>}
                    {student.subclass && <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold border border-yellow-200">Subclass: {student.subclass}</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-1 text-gray-500 text-xs sm:gap-4 sm:text-sm">
                    <span className="truncate"><User className="inline w-4 h-4 mr-1" />ID: {selectedStudent.studentId}</span>
                    {selectedStudent.age && <span>Age: {selectedStudent.age}</span>}
                    <span>Enrolled: {selectedStudent.enrollmentDate ? new Date(selectedStudent.enrollmentDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                {/* Export/Print button */}
                <button className="ml-2 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 flex items-center gap-1 text-xs text-gray-700" onClick={() => window.print()} title="Export/Print Profile">
                  <Printer className="w-4 h-4" /> Print
                </button>
              </div>
              {/* Guardian & Emergency Contacts */}
              <div className="flex flex-col gap-1 border-b pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:pb-4 bg-gray-50 rounded-xl p-2 relative">
                {/* Edit icon for section */}
                <button className="absolute top-2 right-2 text-blue-500 hover:text-blue-700" title="Edit Guardians"><Edit className="w-4 h-4" /></button>
                {/* Guardians Section */}
                <div className="space-y-1 sm:space-y-2">
                  <div className="font-semibold text-gray-700 mb-1 flex items-center gap-2 text-xs sm:text-sm"><User className="w-5 h-5 text-blue-400" /> Guardians</div>
                  {Array.isArray(student.guardians) && student.guardians.length > 0 ? (
                    <div className="space-y-1 sm:space-y-2">
                      {student.guardians.map((g: any, idx: number) => (
                        <div key={idx} className="bg-blue-50 rounded-lg p-1 sm:p-2 flex flex-col gap-1 border">
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900">
                            <User className="w-4 h-4 text-blue-400" />
                            {g.firstName} {g.lastName}
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">{g.relationship}</span>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 sm:gap-2">
                            <a href={`tel:${g.contact}`} className="hover:underline"><Phone className="w-4 h-4 text-blue-400" /> {g.contact}</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs sm:text-sm">N/A</div>
                  )}
                </div>
                {/* Emergency Contacts Section */}
                <div className="space-y-1 sm:space-y-2">
                  <div className="font-semibold text-gray-700 mb-1 flex items-center gap-2 text-xs sm:text-sm"><Phone className="w-5 h-5 text-red-400" /> Emergency Contacts</div>
                  {Array.isArray(student.emergencyContacts) && student.emergencyContacts.length > 0 ? (
                    <div className="space-y-1 sm:space-y-2">
                      {student.emergencyContacts.map((e: any, idx: number) => (
                        <div key={idx} className="bg-red-50 rounded-lg p-1 sm:p-2 flex flex-col gap-1 border">
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900">
                            <Phone className="w-4 h-4 text-red-400" />
                            {e.firstName} {e.lastName}
                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold border border-red-200">{e.relationship}</span>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 sm:gap-2">
                            <a href={`tel:${e.contact}`} className="hover:underline"><Phone className="w-4 h-4 text-red-400" /> {e.contact}</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs sm:text-sm">N/A</div>
                  )}
                </div>
              </div>
              {/* Attendance Summary */}
              <div className="bg-blue-50 rounded-xl p-2 flex items-center gap-2 mb-2">
                <span className="font-semibold text-blue-700">Attendance:</span>
                <span className="text-xs text-gray-700">{getStudentStats(student.id).attendanceRate}% present</span>
                <span className="text-xs text-gray-500">({getStudentStats(student.id).totalAssessments} records)</span>
              </div>
              {/* Attendance History */}
              <div>
                <div className="font-semibold text-gray-700 mb-2 border-b pb-1 flex items-center gap-2 text-xs sm:text-sm">
                  <Calendar className="w-5 h-5 text-blue-400" /> Attendance History
                  <button className="ml-auto text-blue-500 hover:text-blue-700" title="Edit Attendance"><Edit className="w-4 h-4" /></button>
                </div>
                <div className="max-h-32 overflow-x-auto border rounded-lg bg-gray-50 p-1 sm:p-2">
                  {attendance.filter(a => a.studentId === student.id).length === 0 ? (
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
                        {attendance.filter(a => a.studentId === student.id).map((a, i) => (
                          <tr key={i} className="odd:bg-white even:bg-blue-50">
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
              {/* Participation Summary */}
              <div className="bg-yellow-50 rounded-xl p-2 flex items-center gap-2 mb-2">
                <span className="font-semibold text-yellow-700">Participation:</span>
                <span className="text-xs text-gray-700">{getStudentStats(student.id).avgParticipation}★ avg</span>
                <span className="text-xs text-gray-500">({getStudentStats(student.id).totalParticipation} logs)</span>
              </div>
              {/* Participation Logs */}
              <div>
                <div className="font-semibold text-gray-700 mb-2 border-b pb-1 flex items-center gap-2 text-xs sm:text-sm">
                  <Award className="w-5 h-5 text-yellow-400" /> Participation Logs
                  <button className="ml-auto text-blue-500 hover:text-blue-700" title="Edit Participation"><Edit className="w-4 h-4" /></button>
                </div>
                {/* Mobile: Card/List layout */}
                <div className="block sm:hidden space-y-1">
                  {participation.filter(p => p.studentId === student.id).length === 0 ? (
                    <div className="text-gray-400 text-sm">No participation logs found.</div>
                  ) : (
                    participation.filter(p => p.studentId === student.id).map((p, i) => (
                      <div key={i} className="rounded-lg bg-yellow-50 p-1 flex flex-col gap-1 shadow-sm border">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{new Date(p.date).toLocaleDateString()}</span>
                          <span className="font-semibold text-yellow-600">{p.rating}★</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{p.subject} <span className="ml-2 text-xs text-gray-500">{(p.activityType || '').replace('_', ' ')}</span></div>
                        <div className="text-xs text-gray-700">{p.description}</div>
                      </div>
                    ))
                  )}
                </div>
                {/* Desktop: Table layout */}
                <div className="hidden sm:block max-h-32 overflow-x-auto border rounded-lg bg-gray-50 p-2">
                  {participation.filter(p => p.studentId === student.id).length === 0 ? (
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
                        {participation.filter(p => p.studentId === student.id).map((p, i) => (
                          <tr key={i} className="odd:bg-white even:bg-yellow-50">
                            <td>{new Date(p.date).toLocaleDateString()}</td>
                            <td>{p.subject}</td>
                            <td>{(p.activityType || '').replace('_', ' ')}</td>
                            <td>{p.description}</td>
                            <td className="text-yellow-600 font-semibold">{p.rating}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              {/* Notes Section */}
              <div className="bg-gray-50 rounded-xl p-2 mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-700 text-xs sm:text-sm">Teacher/Admin Notes</span>
                  <button className="ml-auto text-blue-500 hover:text-blue-700" title="Edit Notes"><Edit className="w-4 h-4" /></button>
                </div>
                <textarea className="w-full border border-gray-200 rounded-lg p-2 text-xs sm:text-sm" rows={2} placeholder="Add notes about this student... (not visible to students)"></textarea>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default StudentProfiles;