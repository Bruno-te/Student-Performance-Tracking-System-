import React, { useEffect, useState } from 'react';
import { 
  Home, 
  Users, 
  UserCheck, 
  FileText, 
  MessageSquare, 
  AlertTriangle, 
  User, 
  Menu, 
  X as CloseIcon 
} from 'lucide-react';
import SignUp from './SignUp';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddStudent?: () => void;
  visible?: boolean; // new prop for mobile
  onClose?: () => void; // new prop for mobile
  currentUser?: { role: string }; // new prop for current user
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onAddStudent, visible = false, onClose, currentUser }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Student Profiles', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'assessments', label: 'Assessments', icon: FileText },
    { id: 'participation', label: 'Participation', icon: MessageSquare },
    { id: 'behavioral', label: 'Behavioral', icon: AlertTriangle }
  ];

  const [showSignUp, setShowSignUp] = useState(false);

  // Keyboard accessibility: close on Escape
  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onClose]);

  // Sidebar classes for animated slide-in/out
  const sidebarClasses = `
    fixed top-0 left-0 z-40 w-64 h-screen bg-white shadow-lg flex flex-col justify-between
    transition-transform duration-300
    ${visible ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Overlay for all screens, darker */}
      {visible && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-60"
          onClick={onClose}
          aria-label="Close sidebar overlay"
        />
      )}
      <div className={sidebarClasses}>
        {/* Mobile close button */}
        <div className="flex justify-end p-4">
          <button onClick={onClose} aria-label="Close sidebar">
            <CloseIcon className="w-6 h-6 text-gray-500 hover:text-blue-600 transition-colors" />
          </button>
        </div>
        <div className="p-6 pt-0 md:pt-6 font-sans">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">URUGENDO+</h1>
              <p className="text-xs sm:text-sm font-light text-gray-500 tracking-wide mt-0.5">Rwanda 2025</p>
            </div>
          </div>
        </div>
        <nav className="mt-8 px-4">
          <ul className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onTabChange(item.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 group
                      ${activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium'}
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0 group-hover:text-blue-600 transition-colors" />
                    <span className="text-base sm:text-lg tracking-tight">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-100 mt-auto">
          <button
            onClick={onAddStudent}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary-dark transition-colors mb-4 text-base sm:text-lg tracking-tight"
          >
            <span>+ Add Student</span>
          </button>
          {/* Admin-only: Create User button */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setShowSignUp(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors mb-4 text-base sm:text-lg tracking-tight"
            >
              <span>+ Create User</span>
            </button>
          )}
          <div className="flex items-center space-x-3 mt-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">{currentUser?.username || 'User'}</p>
              <p className="text-xs sm:text-sm font-light text-gray-500">{currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : ''}</p>
            </div>
          </div>
        </div>
      </div>
      {/* SignUp Modal */}
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} />}
    </>
  );
};

export default Sidebar;