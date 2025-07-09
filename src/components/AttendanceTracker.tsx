import React, { useState } from 'react';
import { Calendar, Users, Check, X, Clock, FileText, Download } from 'lucide-react';
import { mockStudents, mockAttendance } from '../data/mockData';
import { AttendanceRecord } from '../types';

const AttendanceTracker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendance);

  const updateAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendanceRecords(prev => {
      const existing = prev.find(r => r.studentId === studentId && r.date === selectedDate);
      if (existing) {
        return prev.map(r => 
          r.id === existing.id 
            ? { ...r, status, timestamp: new Date().toISOString() }
            : r
        );
      } else {
        return [...prev, {
          id: `${Date.now()}-${studentId}`,
          studentId,
          date: selectedDate,
          status,
          markedBy: 'Current Teacher',
          timestamp: new Date().toISOString()
        }];
      }
    });
  };

  const getStudentAttendance = (studentId: string) => {
    return attendanceRecords.find(r => r.studentId === studentId && r.date === selectedDate);
  };

  const getAttendanceStats = () => {
    const todayRecords = attendanceRecords.filter(r => r.date === selectedDate);
    const present = todayRecords.filter(r => r.status === 'present').length;
    const late = todayRecords.filter(r => r.status === 'late').length;
    const absent = todayRecords.filter(r => r.status === 'absent').length;
    const excused = todayRecords.filter(r => r.status === 'excused').length;
    
    return { present, late, absent, excused, total: mockStudents.length };
  };

  const stats = getAttendanceStats();

  const AttendanceButton: React.FC<{
    status: 'present' | 'absent' | 'late' | 'excused';
    active: boolean;
    onClick: () => void;
  }> = ({ status, active, onClick }) => {
    const styles = {
      present: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
      absent: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
      late: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200',
      excused: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'
    };

    const activeStyles = {
      present: 'bg-green-500 text-white border-green-500',
      absent: 'bg-red-500 text-white border-red-500',
      late: 'bg-yellow-500 text-white border-yellow-500',
      excused: 'bg-blue-500 text-white border-blue-500'
    };

    return (
      <button
        onClick={onClick}
        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
          active ? activeStyles[status] : styles[status]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Tracker</h1>
          <p className="text-gray-600">Mark and manage student attendance</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Present</p>
              <p className="text-2xl font-bold text-green-700">{stats.present}</p>
            </div>
            <Check className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Absent</p>
              <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
            </div>
            <X className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Late</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.late}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Excused</p>
              <p className="text-2xl font-bold text-blue-700">{stats.excused}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Student Attendance</h3>
          <p className="text-sm text-gray-600 mt-1">
            Attendance for {new Date(selectedDate).toLocaleDateString('en-GB', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockStudents.map((student) => {
              const attendance = getStudentAttendance(student.id);
              return (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-700">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-500">{student.studentId} • {student.class}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AttendanceButton
                      status="present"
                      active={attendance?.status === 'present'}
                      onClick={() => updateAttendance(student.id, 'present')}
                    />
                    <AttendanceButton
                      status="late"
                      active={attendance?.status === 'late'}
                      onClick={() => updateAttendance(student.id, 'late')}
                    />
                    <AttendanceButton
                      status="absent"
                      active={attendance?.status === 'absent'}
                      onClick={() => updateAttendance(student.id, 'absent')}
                    />
                    <AttendanceButton
                      status="excused"
                      active={attendance?.status === 'excused'}
                      onClick={() => updateAttendance(student.id, 'excused')}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;