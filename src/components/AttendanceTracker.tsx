import React, { useState, useEffect } from 'react';
import { Calendar, Users, Check, X, Clock, FileText, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Student, AttendanceRecord } from '../types';
import ClassGridSelector from './ClassGridSelector';

// Extend Student type to include gender for this component
interface StudentWithGender extends Student {
  gender?: string;
}

const AttendanceTracker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<StudentWithGender[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState('all');
  const [attendanceConfirmed, setAttendanceConfirmed] = useState<{ [key: string]: boolean }>({});
  const [confirmMessage, setConfirmMessage] = useState('');

  // Term selection
  const termRanges = [
    { label: 'All Year', value: 'all', start: '2025-01-01', end: '2025-12-31' },
    { label: 'Term 1', value: 'term1', start: '2025-01-01', end: '2025-04-30' },
    { label: 'Term 2', value: 'term2', start: '2025-05-01', end: '2025-08-31' },
    { label: 'Term 3', value: 'term3', start: '2025-09-01', end: '2025-12-31' },
  ];
  const [selectedTerm, setSelectedTerm] = useState('all');
  const termRange = termRanges.find(t => t.value === selectedTerm) || termRanges[0];

  // Helper: is date in term
  const isInTerm = (date: string) => date >= termRange.start && date <= termRange.end;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5051/api/students/').then(res => res.json()),
      fetch('http://localhost:5051/attendance').then(res => res.json()),
    ])
      .then(([studentsData, attendanceData]) => {
        setStudents(studentsData.map((s: any) => ({
          ...s,
          class: String(s.class_id ?? ''),
          gender: s.gender ?? '',
        })));
        setAttendanceRecords(attendanceData);
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
    return { present, late, absent, excused, total: students.length };
  };

  // Filtered attendance records for the selected date and status
  const todayRecordsFiltered = attendanceRecords.filter(r => r.date === selectedDate && (statusFilter === 'all' || r.status === statusFilter));

  // Mark all present handler
  const markAllPresent = () => {
    filteredStudents.forEach(student => {
      updateAttendance(student.id, 'present');
    });
  };

  // Export to CSV
  const exportCSV = () => {
    const header = 'Name,Status,Time Marked,Marked By\n';
    const rows = filteredStudents.map(student => {
      const record = attendanceRecords.find(r => r.studentId === student.id && r.date === selectedDate);
      return `"${student.name}",${record ? record.status : ''},${record ? record.timestamp : ''},${record ? record.markedBy : ''}`;
    });
    const csv = header + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Attendance trend data for term
  const getAttendanceTrendData = () => {
    const days = [];
    const start = new Date(termRange.start);
    const end = new Date(termRange.end);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const records = attendanceRecords.filter(r => r.date === dateStr && filteredStudents.some(s => s.id === r.studentId));
      const present = records.filter(r => r.status === 'present').length;
      days.push({
        date: dateStr,
        rate: filteredStudents.length > 0 ? Math.round((present / filteredStudents.length) * 100) : 0
      });
    }
    return days;
  };
  const trendData = getAttendanceTrendData();

  // Attendance rate by student for term
  const getStudentAttendanceRates = () => {
    return filteredStudents.map(student => {
      const records = attendanceRecords.filter(r => r.studentId === student.id && isInTerm(r.date));
      const total = records.length;
      const present = records.filter(r => r.status === 'present').length;
      return {
        name: student.name,
        rate: total > 0 ? Math.round((present / total) * 100) : 0
      };
    });
  };
  const studentRates = getStudentAttendanceRates();

  // Attendance rate by class for term
  const getClassAttendanceRates = () => {
    // Get all unique class_ids
    const classIds = Array.from(new Set(students.map(s => s.class_id)));
    return classIds.map(classId => {
      const classStudents = students.filter(s => s.class_id === classId);
      let total = 0, present = 0;
      classStudents.forEach(student => {
        const records = attendanceRecords.filter(r => r.studentId === student.id && isInTerm(r.date));
        total += records.length;
        present += records.filter(r => r.status === 'present').length;
      });
      return {
        class: classId ? `Class ${classId}` : 'Unknown',
        rate: total > 0 ? Math.round((present / total) * 100) : 0
      };
    });
  };
  const classRates = getClassAttendanceRates();

  const confirmKey = `${selectedDate}_${selectedClassId}`;
  const isConfirmed = attendanceConfirmed[confirmKey];

  // Confirm attendance handler
  const handleConfirmAttendance = async () => {
    try {
      // Send POST to backend (adjust endpoint as needed)
      const res = await fetch('/api/attendance/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, classId: selectedClassId, records: attendanceRecords.filter(r => r.date === selectedDate && students.find(s => s.id === r.studentId && s.class_id === selectedClassId)) })
      });
      if (res.ok) {
        setAttendanceConfirmed(prev => ({ ...prev, [confirmKey]: true }));
        setConfirmMessage('✅ Attendance Confirmed');
      } else {
        setConfirmMessage('❌ Failed to confirm attendance');
      }
    } catch {
      setConfirmMessage('❌ Failed to confirm attendance');
    }
    setTimeout(() => setConfirmMessage(''), 3000);
  };

  // Unconfirm attendance handler
  const handleUnconfirmAttendance = async () => {
    try {
      // Send PUT to backend (adjust endpoint as needed)
      const res = await fetch('/api/attendance/unconfirm', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, classId: selectedClassId })
      });
      if (res.ok) {
        setAttendanceConfirmed(prev => ({ ...prev, [confirmKey]: false }));
        setConfirmMessage('Attendance is now editable.');
      } else {
        setConfirmMessage('❌ Failed to unconfirm attendance');
      }
    } catch {
      setConfirmMessage('❌ Failed to unconfirm attendance');
    }
    setTimeout(() => setConfirmMessage(''), 3000);
  };

  if (loading) return <div>Loading attendance data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!selectedClassId) {
    return <ClassGridSelector onSelect={setSelectedClassId} />;
  }

  const stats = getAttendanceStats();

  const AttendanceButton: React.FC<{
    status: 'present' | 'absent' | 'late' | 'excused';
    active: boolean;
    onClick: () => void;
    disabled: boolean;
  }> = ({ status, active, onClick, disabled }) => {
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
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disabled}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            onClick={markAllPresent}
          >
            <Check className="w-4 h-4" /> Mark All Present
          </button>
          <button
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            onClick={exportCSV}
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <label className="text-sm font-medium text-gray-700">Term:</label>
          <select
            value={selectedTerm}
            onChange={e => setSelectedTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {termRanges.map(term => (
              <option key={term.value} value={term.value}>{term.label}</option>
            ))}
          </select>
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
          </select>
        </div>
      </div>
      {/* Attendance Confirmation Controls */}
      <div className="flex items-center gap-4 mb-2">
        {isConfirmed ? (
          <>
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-sm">✅ Attendance Confirmed</span>
            <button
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs hover:bg-yellow-200 transition"
              onClick={handleUnconfirmAttendance}
            >
              Unconfirm Attendance
            </button>
          </>
        ) : (
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            onClick={handleConfirmAttendance}
          >
            Confirm Attendance
          </button>
        )}
        {confirmMessage && <span className="ml-2 text-sm font-medium">{confirmMessage}</span>}
      </div>
      {/* Attendance Table */}
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
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Time Marked</th>
                <th className="px-4 py-2 text-left">Marked By</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const record = attendanceRecords.find(r => r.studentId === student.id && r.date === selectedDate);
                return (
                  <tr key={student.id} className="border-b">
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">
                      {record ? (
                        <span className={
                          record.status === 'present' ? 'text-green-600 font-semibold' :
                          record.status === 'absent' ? 'text-red-600 font-semibold' :
                          record.status === 'late' ? 'text-yellow-600 font-semibold' :
                          'text-blue-600 font-semibold'
                        }>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not Marked</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{record ? new Date(record.timestamp).toLocaleTimeString() : '-'}</td>
                    <td className="px-4 py-2">{record ? record.markedBy : '-'}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1">
                        <AttendanceButton
                          status="present"
                          active={record?.status === 'present'}
                          onClick={() => updateAttendance(student.id, 'present')}
                          disabled={isConfirmed}
                        />
                        <AttendanceButton
                          status="absent"
                          active={record?.status === 'absent'}
                          onClick={() => updateAttendance(student.id, 'absent')}
                          disabled={isConfirmed}
                        />
                        <AttendanceButton
                          status="late"
                          active={record?.status === 'late'}
                          onClick={() => updateAttendance(student.id, 'late')}
                          disabled={isConfirmed}
                        />
                        <AttendanceButton
                          status="excused"
                          active={record?.status === 'excused'}
                          onClick={() => updateAttendance(student.id, 'excused')}
                          disabled={isConfirmed}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;