import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentProfiles from './components/StudentProfiles';
import AttendanceTracker from './components/AttendanceTracker';
import AssessmentScores from './components/AssessmentScores';
import ParticipationLogger from './components/ParticipationLogger';
import BehavioralTracker from './components/BehavioralTracker';
import LoginForm from './components/Login';
import AddStudentForm from './components/AddStudentForm';
import Modal from './components/Modal';
import { Menu } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loggedIn, setLoggedIn] = useState(false);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!loggedIn) {
    return <LoginForm onLogin={() => setLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentProfiles />;
      case 'attendance':
        return <AttendanceTracker />;
      case 'assessments':
        return <AssessmentScores />;
      case 'participation':
        return <ParticipationLogger />;
      case 'behavioral':
        return <BehavioralTracker />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with burger menu always visible */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm sticky top-0 z-20">
        <button onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
          <Menu className="w-7 h-7 text-blue-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">URUGENDO+</h1>
        <div className="w-7 h-7" /> {/* Spacer for symmetry */}
      </header>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddStudent={() => setShowAddStudentForm(true)}
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="p-4 transition-all duration-300">
        {renderContent()}
      </main>
      <Modal isOpen={showAddStudentForm} onClose={() => setShowAddStudentForm(false)} title="Add Student">
        <AddStudentForm onCancel={() => setShowAddStudentForm(false)} />
      </Modal>
    </div>
  );
}

export default App;