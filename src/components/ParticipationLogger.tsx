import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Star, Users, TrendingUp } from 'lucide-react';
import { ParticipationLog, Student } from '../types';

const ParticipationLogger: React.FC = () => {
  // All hooks at the top
  const [participationLogs, setParticipationLogs] = useState<ParticipationLog[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Kinyarwanda', 'French'];
  const activityTypes = ['answer', 'question', 'discussion', 'presentation', 'group_work'];
  const [newLog, setNewLog] = useState({
    studentId: '',
    subject: '',
    activityType: 'answer' as const,
    description: '',
    rating: 3 as const
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5051/api/students/').then(res => res.json()),
      fetch('http://localhost:5051/participation').then(res => res.json()),
    ])
      .then(([studentsData, participationData]) => {
        setStudents(studentsData);
        setParticipationLogs(participationData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data from backend.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading participation logs...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const handleAddLog = () => {
    if (newLog.studentId && newLog.subject && newLog.description) {
      const log: ParticipationLog = {
        id: Date.now().toString(),
        studentId: newLog.studentId,
        date: selectedDate,
        subject: newLog.subject,
        activityType: newLog.activityType,
        description: newLog.description,
        rating: newLog.rating,
        teacherId: 'current-teacher',
        timestamp: new Date().toISOString()
      };
      setParticipationLogs(prev => [...prev, log]);
      setNewLog({
        studentId: '',
        subject: '',
        activityType: 'answer',
        description: '',
        rating: 3
      });
      setShowAddForm(false);
    }
  };

  const getStudentParticipationStats = (studentId: string) => {
    const studentLogs = participationLogs.filter(log => log.studentId === studentId);
    const totalActivities = studentLogs.length;
    const avgRating = totalActivities > 0 
      ? studentLogs.reduce((sum, log) => sum + log.rating, 0) / totalActivities 
      : 0;
    return { totalActivities, avgRating };
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'answer': return '✋';
      case 'question': return '❓';
      case 'discussion': return '💬';
      case 'presentation': return '🎤';
      case 'group_work': return '👥';
      default: return '📝';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const todayLogs = participationLogs.filter(log => log.date === selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Participation Logger</h1>
          <p className="text-gray-600">Track and record student classroom participation</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log Activity</span>
        </button>
      </div>

      {/* Date Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 sm:gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Activities</p>
              <p className="text-2xl font-bold text-gray-900">{todayLogs.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Average Rating</p>
              <p className="text-2xl font-bold text-blue-700">
                {todayLogs.length > 0 
                  ? (todayLogs.reduce((sum, log) => sum + log.rating, 0) / todayLogs.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
            <Star className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Students</p>
              <p className="text-2xl font-bold text-green-700">
                {new Set(todayLogs.map(log => log.studentId)).size}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Subjects Covered</p>
              <p className="text-2xl font-bold text-purple-700">
                {new Set(todayLogs.map(log => log.subject)).size}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Student Participation Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900">Student Participation Overview</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 sm:gap-4">
            {students.map(student => {
              const stats = getStudentParticipationStats(student.id);
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
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Activities</p>
                      <p className="font-semibold text-gray-900">{stats.totalActivities}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Rating</p>
                      <p className={`font-semibold ${getRatingColor(stats.avgRating)}`}>
                        {stats.avgRating.toFixed(1)} ⭐
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Participation Logs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Participation Logs
            <span className="ml-2 text-sm text-gray-500">
              ({new Date(selectedDate).toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })})
            </span>
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {todayLogs.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No participation logs for this date</p>
              </div>
            ) : (
              todayLogs.map(log => {
                const student = students.find(s => s.id === log.studentId);
                return (
                  <div key={log.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">{getActivityTypeIcon(log.activityType)}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{student?.name}</h4>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{log.subject}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                              {log.activityType.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleTimeString('en-GB', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= log.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add Log Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Participation Activity</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                <select
                  value={newLog.studentId}
                  onChange={(e) => setNewLog(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={newLog.subject}
                  onChange={(e) => setNewLog(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
                <select
                  value={newLog.activityType}
                  onChange={(e) => setNewLog(prev => ({ ...prev, activityType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {activityTypes.map(type => (
                    <option key={type} value={type}>
                      {getActivityTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newLog.description}
                  onChange={(e) => setNewLog(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the participation activity..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setNewLog(prev => ({ ...prev, rating: rating as any }))}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating <= newLog.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    {newLog.rating} star{newLog.rating !== 1 ? 's' : ''}
                  </span>
                </div>
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
                onClick={handleAddLog}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Log Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipationLogger;