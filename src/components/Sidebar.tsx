import React from 'react';
import { 
  Home, 
  Users, 
  UserCheck, 
  FileText, 
  MessageSquare, 
  AlertTriangle, 
  User 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Student Profiles', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'assessments', label: 'Assessments', icon: FileText },
    { id: 'participation', label: 'Participation', icon: MessageSquare },
    { id: 'behavioral', label: 'Behavioral', icon: AlertTriangle }
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-30">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">URUGENDO+</h1>
            <p className="text-sm text-gray-600">Rwanda 2025</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Teacher</p>
            <p className="text-xs text-gray-500">Primary 6A</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;