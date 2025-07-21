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

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loggedIn, setLoggedIn] = useState(false);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);

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
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onAddStudent={() => setShowAddStudentForm(true)} />
      <main className="ml-64 p-8">
        {renderContent()}
      </main>
      <Modal isOpen={showAddStudentForm} onClose={() => setShowAddStudentForm(false)} title="Add Student">
        <AddStudentForm />
      </Modal>
    </div>
  );
}

export default App;