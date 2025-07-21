import React, { useState, useEffect } from 'react';
import { Plus, AlertTriangle, Award, Clock, Filter } from 'lucide-react';
import { Student, BehavioralRecord } from '../types';
import ClassGridSelector from './ClassGridSelector';

// Extend Student type to include gender for this component
interface StudentWithGender extends Student {
  gender?: string;
}

const BehavioralTracker: React.FC = () => {
  // All hooks at the top
  const [behavioralRecords, setBehavioralRecords] = useState<BehavioralRecord[]>([]);
  const [students, setStudents] = useState<StudentWithGender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'positive' | 'negative'>('all');
  const [selectedDate, setSelectedDate] = useState('');
  const categories = ['discipline', 'leadership', 'cooperation', 'respect', 'punctuality', 'other'];
  const severityLevels = ['low', 'medium', 'high'];
  const [newRecord, setNewRecord] = useState({
    studentId: '',
    type: 'positive' as const,
    category: 'discipline' as const,
    description: '',
    severity: 'low' as const,
    actionTaken: ''
  });
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5051/api/students/').then(res => res.json()),
      fetch('http://localhost:5051/behavioral').then(res => res.json()),
    ])
      .then(([studentsData, behavioralData]) => {
        setStudents(studentsData.map((s: any) => ({
          ...s,
          class: String(s.class_id ?? ''),
          gender: s.gender ?? '',
        })));
        setBehavioralRecords(behavioralData.map(log => ({
          ...log,
          studentId: log.student_id,
          actionTaken: log.action_taken,
          reportedBy: log.reported_by,
        })));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data from backend.');
        setLoading(false);
      });
  }, []);

  // Only show students in the selected class and matching search and gender
  const filteredStudents = students.filter((student: StudentWithGender) =>
    (selectedClassId == null || student.class === String(selectedClassId)) &&
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) &&
    (genderFilter === '' || (student.gender && student.gender.toLowerCase() === genderFilter))
  );
  const filteredRecords = behavioralRecords.filter(record => filteredStudents.some(s => s.id === record.studentId));

  if (loading) return <div>Loading behavioral records...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!selectedClassId) {
    return <ClassGridSelector onSelect={setSelectedClassId} />;
  }

  const handleAddRecord = async () => {
    if (newRecord.studentId && newRecord.description) {
      const record = {
        student_id: newRecord.studentId,
        date: new Date().toISOString().split('T')[0],
        type: newRecord.type,
        category: newRecord.category,
        description: newRecord.description,
        severity: newRecord.type === 'negative' ? newRecord.severity : undefined,
        action_taken: newRecord.actionTaken || undefined,
        reported_by: 'Current Teacher',
        timestamp: new Date().toISOString()
      };
      try {
        const res = await fetch('http://localhost:5051/behavioral/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
        if (!res.ok) throw new Error('Failed to save behavioral record');
        // Refetch behavioral records and map fields
        const updated = await fetch('http://localhost:5051/behavioral/').then(r => r.json());
        setBehavioralRecords(updated.map(log => ({
          ...log,
          studentId: log.student_id,
          actionTaken: log.action_taken,
          reportedBy: log.reported_by,
        })));
        setShowAddForm(false);
      } catch (err) {
        setError('Failed to save behavioral record');
      }
    }
  };

  const getFilteredRecords = () => {
    return behavioralRecords.filter(record => {
      const matchesType = filterType === 'all' || record.type === filterType;
      const matchesDate = !selectedDate || record.date === selectedDate;
      return matchesType && matchesDate;
    });
  };

  const getStudentBehaviorStats = (studentId: string) => {
    const studentRecords = behavioralRecords.filter(r => r.studentId === studentId);
    const positiveCount = studentRecords.filter(r => r.type === 'positive').length;
    const negativeCount = studentRecords.filter(r => r.type === 'negative').length;
    return { positiveCount, negativeCount, total: studentRecords.length };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'discipline': return '⚖️';
      case 'leadership': return '👨‍💼';
      case 'cooperation': return '🤝';
      case 'respect': return '🙏';
      case 'punctuality': return '⏰';
      default: return '📝';
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const positiveRecords = filteredRecords.filter(r => r.type === 'positive').length;
  const negativeRecords = filteredRecords.filter(r => r.type === 'negative').length;

  return (
    <div className="space-y-6">
      {/* Student Search & Gender Filter */}
      <div className="mb-2 flex flex-col sm:flex-row items-center gap-2">
        <input
          type="text"
          placeholder="Search students by name..."
          value={studentSearch}
          onChange={e => setStudentSearch(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={genderFilter}
          onChange={e => setGenderFilter(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Behavioral Tracker</h1>
          <p className="text-gray-600">Monitor and record student behavioral patterns</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4" /> Add Behavioral Record
          </button>
          <button className="text-blue-600 underline text-sm font-medium ml-2" onClick={() => setSelectedClassId(null)}>Change Class</button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Record Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Records</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterType('all');
                setSelectedDate('');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 sm:gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{filteredRecords.length}</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Positive</p>
              <p className="text-2xl font-bold text-green-700">{positiveRecords}</p>
            </div>
            <Award className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Negative</p>
              <p className="text-2xl font-bold text-red-700">{negativeRecords}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Active Students</p>
              <p className="text-2xl font-bold text-blue-700">
                {new Set(filteredRecords.map(r => r.studentId)).size}
              </p>
            </div>
            <Award className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Student Behavior Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900">Student Behavior Overview</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 sm:gap-4">
            {filteredStudents.map(student => {
              const stats = getStudentBehaviorStats(student.id);
              return (
                <div key={student.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-700">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-500">{student.studentId}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <p className="text-green-600 font-semibold">{stats.positiveCount}</p>
                      <p className="text-gray-600">Positive</p>
                    </div>
                    <div className="text-center">
                      <p className="text-red-600 font-semibold">{stats.negativeCount}</p>
                      <p className="text-gray-600">Negative</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-900 font-semibold">{stats.total}</p>
                      <p className="text-gray-600">Total</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Behavioral Records */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Behavioral Records</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No behavioral records found</p>
              </div>
            ) : (
              filteredRecords.map(record => {
                const student = students.find(s => s.id === record.studentId);
                return (
                  <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg">{getCategoryIcon(record.category)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{student?.name}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              record.type === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {record.type}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                              {record.category}
                            </span>
                            {record.severity && (
                              <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(record.severity)}`}>
                                {record.severity} severity
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                          {record.actionTaken && (
                            <p className="text-sm text-blue-600 mt-1">
                              <strong>Action Taken:</strong> {record.actionTaken}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">
                              Reported by {record.reportedBy}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">
                              {new Date(record.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Behavioral Record</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                <select
                  value={newRecord.studentId}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Student</option>
                  {filteredStudents.map(student => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Record Type</label>
                <select
                  value={newRecord.type}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newRecord.category}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {newRecord.type === 'negative' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <select
                    value={newRecord.severity}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, severity: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {severityLevels.map(severity => (
                      <option key={severity} value={severity}>
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newRecord.description}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the behavioral incident or positive action..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action Taken (Optional)</label>
                <input
                  type="text"
                  value={newRecord.actionTaken}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, actionTaken: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Verbal warning, Extra homework, Recognition in class"
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
                onClick={handleAddRecord}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BehavioralTracker;