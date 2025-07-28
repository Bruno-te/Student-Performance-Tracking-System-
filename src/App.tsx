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
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  if (!loggedIn) {
    return <LoginForm onLogin={user => { setLoggedIn(true); setCurrentUser(user); }} />;
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
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onAddStudent={() => setShowAddStudentForm(true)}
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        currentUser={currentUser}
      />
      <main className={`p-8 transition-all duration-300 ${sidebarVisible ? 'ml-64' : 'ml-0'}`}>
        {/* Mobile menu button */}
        {!sidebarVisible && (
          <button
            onClick={() => setSidebarVisible(true)}
            className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        {renderContent()}
      </main>
      <Modal isOpen={showAddStudentForm} onClose={() => setShowAddStudentForm(false)} title="Add Student">
        <AddStudentForm onCancel={() => setShowAddStudentForm(false)} />
      </Modal>
    </div>
  );
}

export default App;
