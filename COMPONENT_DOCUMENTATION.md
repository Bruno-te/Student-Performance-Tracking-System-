# Student Performance Tracking System - Component Documentation

## Overview
This document provides comprehensive documentation for all React components in the Student Performance Tracking System. The application is built with React 18, TypeScript, and Tailwind CSS.

## Table of Contents
- [Core Components](#core-components)
- [Layout Components](#layout-components)
- [Form Components](#form-components)
- [Authentication Components](#authentication-components)
- [Data Management Components](#data-management-components)
- [Modal Components](#modal-components)
- [Utils and Helpers](#utils-and-helpers)

## Core Components

### App Component
**File:** `src/App.tsx`

The main application component that handles routing, authentication state, and layout structure.

**Props:** None (root component)

**State:**
```typescript
interface AppState {
  activeTab: string;
  loggedIn: boolean;
  currentUser: { username: string; role: string } | null;
  showAddStudentForm: boolean;
  sidebarVisible: boolean;
}
```

**Features:**
- Authentication management
- Tab-based navigation
- Responsive sidebar
- Modal management for adding students

**Usage:**
```tsx
import App from './App';

function Root() {
  return <App />;
}
```

### Dashboard Component
**File:** `src/components/Dashboard.tsx`

Main dashboard displaying system statistics, charts, and recent activities.

**Props:** None

**Features:**
- Real-time statistics display
- Interactive charts using Recharts
- Student performance summaries
- Activity feed
- Modal dialogs for detailed views

**Key Statistics:**
- Total students count
- Present today count  
- Attendance rate percentage
- Average score percentage
- Behavioral incidents count
- Participation rate

**Charts:**
- Line chart for performance trends
- Radar chart for comparative analysis

**Usage:**
```tsx
import Dashboard from './components/Dashboard';

function MainApp() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}
```

**Example Data Structure:**
```typescript
const stats = {
  totalStudents: 150,
  presentToday: 142,
  attendanceRate: 94,
  avgScore: 78,
  completedAssignments: 89,
  activeProjects: 12
};
```

## Layout Components

### Sidebar Component
**File:** `src/components/Sidebar.tsx`

Navigation sidebar with menu items and user profile.

**Props:**
```typescript
interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddStudent: () => void;
  visible: boolean;
  onClose: () => void;
  currentUser: { username: string; role: string } | null;
}
```

**Features:**
- Responsive design with mobile support
- Role-based menu items
- User profile display
- Tab highlighting
- Collapse/expand functionality

**Menu Items:**
- Dashboard
- Students
- Attendance
- Assessments
- Participation
- Behavioral

**Usage:**
```tsx
<Sidebar 
  activeTab="dashboard"
  onTabChange={setActiveTab}
  onAddStudent={() => setShowForm(true)}
  visible={true}
  onClose={() => setSidebarVisible(false)}
  currentUser={{ username: "teacher1", role: "teacher" }}
/>
```

### Modal Component
**File:** `src/components/Modal.tsx`

Reusable modal dialog component.

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

**Features:**
- Backdrop click to close
- Escape key support
- Smooth animations
- Responsive design

**Usage:**
```tsx
<Modal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)}
  title="Add New Student"
>
  <AddStudentForm onCancel={() => setIsModalOpen(false)} />
</Modal>
```

## Form Components

### AddStudentForm Component
**File:** `src/components/AddStudentForm.tsx`

Comprehensive form for adding new students with guardian and emergency contact information.

**Props:**
```typescript
interface AddStudentFormProps {
  onCancel: () => void;
}
```

**Form Fields:**
- Personal Information:
  - Full Name (required)
  - Gender (Male/Female/Other)
  - Date of Birth
  - Class selection
- Guardian Information:
  - First Name, Last Name
  - Relationship
  - Contact Number
- Emergency Contacts:
  - Multiple contacts support
  - Same fields as guardian

**Features:**
- Form validation with react-hook-form
- Dynamic guardian/contact addition
- Class selection dropdown
- Error handling and display
- API integration for submission

**Usage:**
```tsx
<AddStudentForm 
  onCancel={() => setShowForm(false)}
/>
```

**Validation Rules:**
```typescript
const validationSchema = {
  name: { required: "Full name is required" },
  gender: { required: "Gender is required" },
  dateOfBirth: { required: "Date of birth is required" },
  classId: { required: "Class selection is required" }
};
```

## Authentication Components

### Login Component
**File:** `src/components/Login.tsx`

User authentication form with role-based access.

**Props:**
```typescript
interface LoginProps {
  onLogin: (user: { username: string; role: string }) => void;
}
```

**Features:**
- Username/password authentication
- Role-based login (admin, teacher, parent)
- Form validation
- Error handling
- Responsive design

**Usage:**
```tsx
<LoginForm 
  onLogin={(user) => {
    setLoggedIn(true);
    setCurrentUser(user);
  }} 
/>
```

### SignUp Component
**File:** `src/components/SignUp.tsx`

User registration form for new accounts.

**Props:**
```typescript
interface SignUpProps {
  // Component-specific props
}
```

**Features:**
- Account creation
- Email validation
- Password confirmation
- Role selection
- Terms acceptance

### ForgotPassword Component
**File:** `src/components/ForgotPassword.tsx`

Password recovery form.

**Props:**
```typescript
interface ForgotPasswordProps {
  // Component-specific props
}
```

**Features:**
- Email-based password reset
- Form validation
- Success/error messaging

## Data Management Components

### StudentProfiles Component
**File:** `src/components/StudentProfiles.tsx`

Comprehensive student management interface.

**Props:** None

**Features:**
- Student listing with search and filter
- Detailed student profiles
- Edit/delete functionality
- Bulk operations
- Export capabilities
- Profile image management

**Key Functions:**
```typescript
const functions = {
  searchStudents: (query: string) => void,
  filterByClass: (classId: string) => void,
  editStudent: (studentId: string) => void,
  deleteStudent: (studentId: string) => void,
  exportData: () => void
};
```

**Usage:**
```tsx
<StudentProfiles />
```

### AttendanceTracker Component
**File:** `src/components/AttendanceTracker.tsx`

Attendance management system.

**Props:** None

**Features:**
- Daily attendance marking
- Bulk attendance entry
- Attendance history
- Status filtering (Present/Absent/Late/Excused)
- Calendar integration
- Attendance reports

**Attendance Statuses:**
- Present
- Absent
- Late
- Excused

**Usage:**
```tsx
<AttendanceTracker />
```

### AssessmentScores Component
**File:** `src/components/AssessmentScores.tsx`

Assessment and grading management.

**Props:** None

**Features:**
- Score entry and editing
- Multiple assessment types
- Grade calculations
- Performance analytics
- Export functionality
- Term-based organization

**Assessment Types:**
- Test
- Quiz
- Exam
- Assignment
- Project

**Usage:**
```tsx
<AssessmentScores />
```

### ParticipationLogger Component
**File:** `src/components/ParticipationLogger.tsx`

Student participation tracking.

**Props:** None

**Features:**
- Activity logging
- Rating system (1-5 scale)
- Activity type categorization
- Participation analytics
- Date-based filtering

**Activity Types:**
- Answer
- Question
- Discussion
- Presentation
- Group Work

**Usage:**
```tsx
<ParticipationLogger />
```

### BehavioralTracker Component
**File:** `src/components/BehavioralTracker.tsx`

Behavioral incident and positive behavior tracking.

**Props:** None

**Features:**
- Positive/negative behavior logging
- Severity levels
- Category classification
- Action taken recording
- Behavioral analytics
- Report generation

**Behavior Categories:**
- Discipline
- Leadership
- Cooperation
- Respect
- Punctuality
- Other

**Severity Levels:**
- Low
- Medium
- High

**Usage:**
```tsx
<BehavioralTracker />
```

## Utility Components

### ClassGridSelector Component
**File:** `src/components/ClassGridSelector.tsx`

Grid-based class selection interface.

**Props:**
```typescript
interface ClassGridSelectorProps {
  selectedClass: string;
  onClassSelect: (classId: string) => void;
  classes: Array<{
    id: string;
    name: string;
    teacherId: string;
  }>;
}
```

**Features:**
- Visual grid layout
- Class highlighting
- Responsive design

**Usage:**
```tsx
<ClassGridSelector
  selectedClass="class-1"
  onClassSelect={setSelectedClass}
  classes={availableClasses}
/>
```

## State Management

### Global State Structure
```typescript
interface GlobalState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  
  // UI State
  activeTab: string;
  sidebarVisible: boolean;
  modals: {
    addStudent: boolean;
    editStudent: boolean;
    confirmDelete: boolean;
  };
  
  // Data State
  students: Student[];
  attendance: AttendanceRecord[];
  assessments: AssessmentScore[];
  participation: ParticipationLog[];
  behavioral: BehavioralRecord[];
  
  // Loading States
  loading: {
    students: boolean;
    attendance: boolean;
    assessments: boolean;
  };
  
  // Error States
  errors: {
    [key: string]: string;
  };
}
```

## API Integration

### Custom Hooks
Each component uses custom hooks for API integration:

```typescript
// Example: useStudents hook
const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/students/`);
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, loading, error, refetch: fetchStudents };
};
```

## Styling and Theme

### Tailwind CSS Classes
Common utility classes used throughout the application:

```css
/* Layout */
.container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
.grid-layout: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

/* Cards */
.card: bg-white rounded-lg shadow-md p-6
.card-header: border-b border-gray-200 pb-4 mb-4

/* Buttons */
.btn-primary: bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md
.btn-secondary: bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md
.btn-danger: bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md

/* Forms */
.form-input: border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500
.form-label: block text-sm font-medium text-gray-700 mb-1
.form-error: text-red-600 text-sm mt-1
```

### Color Scheme
```css
:root {
  --primary: #3B82F6;     /* Blue-500 */
  --secondary: #6B7280;   /* Gray-500 */
  --success: #10B981;     /* Green-500 */
  --warning: #F59E0B;     /* Yellow-500 */
  --danger: #EF4444;      /* Red-500 */
  --light: #F9FAFB;       /* Gray-50 */
  --dark: #1F2937;        /* Gray-800 */
}
```

## Performance Considerations

### Optimization Techniques
1. **React.memo** for preventing unnecessary re-renders
2. **useMemo** for expensive calculations
3. **useCallback** for stable function references
4. **Lazy loading** for large components
5. **Virtual scrolling** for large lists

### Code Splitting
```typescript
// Lazy load components
const Dashboard = lazy(() => import('./components/Dashboard'));
const StudentProfiles = lazy(() => import('./components/StudentProfiles'));

// Usage with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Dashboard />
</Suspense>
```

## Testing

### Component Testing Example
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Login } from './Login';

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login onLogin={jest.fn()} />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('calls onLogin when form is submitted', () => {
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(mockOnLogin).toHaveBeenCalledWith({
      username: 'testuser',
      role: 'teacher'
    });
  });
});
```

## Accessibility

### ARIA Labels and Roles
All components include proper ARIA attributes:
- `aria-label` for buttons and inputs
- `role` attributes for custom elements
- `aria-describedby` for form validation
- Keyboard navigation support
- Screen reader compatibility

### Focus Management
- Proper tab order
- Focus trapping in modals
- Visual focus indicators
- Skip navigation links

## Browser Support
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Dependencies
Key external libraries used:
- React 18.3.1
- React Router DOM 7.6.3
- React Hook Form 7.60.0
- Recharts 3.0.2 (for charts)
- Lucide React 0.344.0 (for icons)
- Zod 3.25.76 (for validation)
- Tailwind CSS 3.4.1 (for styling)