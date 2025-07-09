import React, { useState } from 'react';
import { Search, Phone, Calendar, Award, TrendingUp, User } from 'lucide-react';
import { mockStudents, mockAttendance, mockAssessments, mockParticipation, mockBehavioral } from '../data/mockData';
import { Student } from '../types';

const StudentProfiles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentStats = (studentId: string) => {
    const attendanceRecords = mockAttendance.filter(a => a.studentId === studentId);
    const assessmentRecords = mockAssessments.filter(a => a.studentId === studentId);
    const participationRecords = mockParticipation.filter(p => p.studentId === studentId);
    const behavioralRecords = mockBehavioral.filter(b => b.studentId === studentId);

    const attendanceRate = attendanceRecords.length > 0 
      ? Math.round((attendanceRecords.filter(a => a.status === 'present').length / attendanceRecords.length) * 100)
      : 0;

    const avgScore = assessmentRecords.length > 0
      ? Math.round(assessmentRecords.reduce((sum, a) => sum + (a.score / a.maxScore * 100), 0) / assessmentRecords.length)
      : 0;

    const avgParticipation = participationRecords.length > 0
      ? (participationRecords.reduce((sum, p) => sum + p.rating, 0) / participationRecords.length).toFixed(1)
      : '0.0';

    const positiveRecords = behavioralRecords.filter(b => b.type === 'positive').length;
    const negativeRecords = behavioralRecords.filter(b => b.type === 'negative').length;

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
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-500">{student.studentId} • {student.class}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">{stats.avgScore}% avg</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">{stats.attendanceRate}% attendance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (selectedStudent) {
    const stats = getStudentStats(selectedStudent.id);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedStudent(null)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Student List
          </button>
        </div>

        {/* Student Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-700">
                {selectedStudent.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h1>
              <p className="text-gray-600">{selectedStudent.studentId} • {selectedStudent.class}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Age: {selectedStudent.age}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{selectedStudent.guardianPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-700">{stats.attendanceRate}%</p>
              </div>
              <User className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Average Score</p>
                <p className="text-2xl font-bold text-green-700">{stats.avgScore}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Participation</p>
                <p className="text-2xl font-bold text-purple-700">{stats.avgParticipation}★</p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Positive Records</p>
                <p className="text-2xl font-bold text-orange-700">{stats.positiveRecords}</p>
              </div>
              <Award className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Guardian Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Guardian Name</p>
                <p className="text-gray-900">{selectedStudent.guardianName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Phone Number</p>
                <p className="text-gray-900">{selectedStudent.guardianPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Enrollment Date</p>
                <p className="text-gray-900">
                  {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-gray-900">{stats.totalAssessments}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Participation Activities</p>
                <p className="text-gray-900">{stats.totalParticipation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Behavioral Records</p>
                <p className="text-gray-900">
                  {stats.positiveRecords} positive, {stats.negativeRecords} negative
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {mockAssessments
              .filter(a => a.studentId === selectedStudent.id)
              .slice(0, 3)
              .map(assessment => (
                <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{assessment.assessmentName}</p>
                    <p className="text-sm text-gray-600">{assessment.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {Math.round((assessment.score / assessment.maxScore) * 100)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(assessment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Profiles</h1>
          <p className="text-gray-600">View and manage individual student information</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No students found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default StudentProfiles;