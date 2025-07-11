import React, { useState } from 'react';
import { Plus, Edit, Trash2, FileText, TrendingUp, Award, BookOpen } from 'lucide-react';
import { mockStudents, mockAssessments } from '../data/mockData';
import { AssessmentScore } from '../types';

const AssessmentScores: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentScore[]>(mockAssessments);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Kinyarwanda', 'French'];
  const assessmentTypes = ['test', 'quiz', 'exam', 'assignment', 'project'];

  const [newAssessment, setNewAssessment] = useState({
    studentId: '',
    subject: '',
    assessmentType: 'test' as const,
    assessmentName: '',
    score: '',
    maxScore: '100',
    date: new Date().toISOString().split('T')[0],
    term: 'Term 1'
  });

  const handleAddAssessment = () => {
    if (newAssessment.studentId && newAssessment.subject && newAssessment.assessmentName && newAssessment.score) {
      const assessment: AssessmentScore = {
        id: Date.now().toString(),
        studentId: newAssessment.studentId,
        subject: newAssessment.subject,
        assessmentType: newAssessment.assessmentType,
        assessmentName: newAssessment.assessmentName,
        score: parseInt(newAssessment.score),
        maxScore: parseInt(newAssessment.maxScore),
        date: newAssessment.date,
        term: newAssessment.term,
        teacherId: 'current-teacher'
      };
      setAssessments(prev => [...prev, assessment]);
      setNewAssessment({
        studentId: '',
        subject: '',
        assessmentType: 'test',
        assessmentName: '',
        score: '',
        maxScore: '100',
        date: new Date().toISOString().split('T')[0],
        term: 'Term 1'
      });
      setShowAddForm(false);
    }
  };

  const getFilteredAssessments = () => {
    return assessments.filter(assessment => {
      const matchesStudent = !selectedStudent || assessment.studentId === selectedStudent;
      const matchesSubject = !selectedSubject || assessment.subject === selectedSubject;
      return matchesStudent && matchesSubject;
    });
  };

  const getStudentAverage = (studentId: string) => {
    const studentAssessments = assessments.filter(a => a.studentId === studentId);
    if (studentAssessments.length === 0) return 0;
    const total = studentAssessments.reduce((sum, a) => sum + (a.score / a.maxScore * 100), 0);
    return Math.round(total / studentAssessments.length);
  };

  const getSubjectAverage = (subject: string) => {
    const subjectAssessments = assessments.filter(a => a.subject === subject);
    if (subjectAssessments.length === 0) return 0;
    const total = subjectAssessments.reduce((sum, a) => sum + (a.score / a.maxScore * 100), 0);
    return Math.round(total / subjectAssessments.length);
  };

  const filteredAssessments = getFilteredAssessments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessment Scores</h1>
          <p className="text-gray-600">Track and manage student assessment performance</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Assessment</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Students</option>
              {mockStudents.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedStudent('');
                setSelectedSubject('');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assessments</p>
              <p className="text-2xl font-bold text-gray-900">{filteredAssessments.length}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Average Score</p>
              <p className="text-2xl font-bold text-blue-700">
                {filteredAssessments.length > 0 
                  ? Math.round(filteredAssessments.reduce((sum, a) => sum + (a.score / a.maxScore * 100), 0) / filteredAssessments.length)
                  : 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">High Performers</p>
              <p className="text-2xl font-bold text-green-700">
                {filteredAssessments.filter(a => (a.score / a.maxScore * 100) >= 80).length}
              </p>
            </div>
            <Award className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Subjects Covered</p>
              <p className="text-2xl font-bold text-purple-700">
                {new Set(filteredAssessments.map(a => a.subject)).size}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Assessment List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Assessments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssessments.map((assessment) => {
                const student = mockStudents.find(s => s.id === assessment.studentId);
                const percentage = Math.round((assessment.score / assessment.maxScore) * 100);
                return (
                  <tr key={assessment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {student?.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student?.name}</div>
                          <div className="text-sm text-gray-500">{student?.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{assessment.subject}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{assessment.assessmentName}</div>
                        <div className="text-sm text-gray-500 capitalize">{assessment.assessmentType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {assessment.score}/{assessment.maxScore}
                        </div>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                          percentage >= 80 ? 'bg-green-100 text-green-700' :
                          percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(assessment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Assessment Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Assessment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                <select
                  value={newAssessment.studentId}
                  onChange={(e) => setNewAssessment(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Student</option>
                  {mockStudents.map(student => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={newAssessment.subject}
                  onChange={(e) => setNewAssessment(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Type</label>
                <select
                  value={newAssessment.assessmentType}
                  onChange={(e) => setNewAssessment(prev => ({ ...prev, assessmentType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {assessmentTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Name</label>
                <input
                  type="text"
                  value={newAssessment.assessmentName}
                  onChange={(e) => setNewAssessment(prev => ({ ...prev, assessmentName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Fractions Test"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Score</label>
                  <input
                    type="number"
                    value={newAssessment.score}
                    onChange={(e) => setNewAssessment(prev => ({ ...prev, score: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="85"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                  <input
                    type="number"
                    value={newAssessment.maxScore}
                    onChange={(e) => setNewAssessment(prev => ({ ...prev, maxScore: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newAssessment.date}
                  onChange={(e) => setNewAssessment(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAssessment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentScores;