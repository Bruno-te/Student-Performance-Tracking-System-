# Student Performance Tracking System - Usage Guide

## Overview
This comprehensive guide provides step-by-step instructions, examples, and tutorials for using the Student Performance Tracking System effectively.

## Table of Contents
- [Getting Started](#getting-started)
- [Quick Start Tutorial](#quick-start-tutorial)
- [User Roles & Permissions](#user-roles--permissions)
- [Feature Tutorials](#feature-tutorials)
- [API Usage Examples](#api-usage-examples)
- [Common Workflows](#common-workflows)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Getting Started

### Prerequisites
- **Backend:** Python 3.8+, Flask, SQLAlchemy
- **Frontend:** Node.js 16+, React 18, TypeScript
- **Database:** SQLite (development) or PostgreSQL (production)

### Installation

#### Backend Setup
```bash
# Clone the repository
git clone <repository-url>
cd student-performance-tracking-system

# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python main.py
```

#### Frontend Setup
```bash
# Navigate to project root (where package.json is located)
cd ..

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration

#### Backend Environment Variables
Create a `.env` file in the backend directory:
```bash
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///student_tracking.db
FLASK_ENV=development
CORS_ORIGINS=http://localhost:3000
```

#### Frontend Environment Variables
Create a `.env` file in the project root:
```bash
VITE_API_URL=http://127.0.0.1:5051
```

### First Run
1. Start the backend server: `python backend/main.py`
2. Start the frontend: `npm run dev`
3. Access the application at `http://localhost:3000`
4. Login with default admin credentials:
   - Username: `admin`
   - Password: `admin123`

## Quick Start Tutorial

### Step 1: Login to the System
1. Open your browser and navigate to `http://localhost:3000`
2. Enter your credentials:
   - **Admin:** username `admin`, password `admin123`
   - **Teacher:** Create account through admin panel
   - **Parent:** Create account through admin panel

### Step 2: Add Your First Student
1. Click on the "Students" tab in the sidebar
2. Click the "Add Student" button
3. Fill in the student information:
   ```
   Name: John Doe
   Gender: Male
   Date of Birth: 2010-05-15
   Class: Select from dropdown
   Guardian Information:
     - First Name: Jane
     - Last Name: Doe
     - Relationship: Mother
     - Contact: +1234567890
   ```
4. Click "Save Student"

### Step 3: Record Attendance
1. Navigate to the "Attendance" tab
2. Select today's date
3. Find the student in the list
4. Mark attendance status:
   - Present ✅
   - Absent ❌
   - Late 🕐
   - Excused 📝
5. Add notes if necessary
6. Save the attendance record

### Step 4: Add Assessment Scores
1. Go to the "Assessments" tab
2. Click "Add Assessment"
3. Fill in the details:
   ```
   Student: John Doe
   Subject: Mathematics
   Assessment Type: Test
   Score: 85
   Max Score: 100
   Date: 2024-01-15
   Term: Term 1
   Notes: Good performance in algebra
   ```
4. Submit the assessment

### Step 5: View Dashboard Analytics
1. Click on the "Dashboard" tab
2. Review the summary statistics:
   - Total students
   - Attendance rate
   - Average scores
   - Recent activities
3. Analyze the performance charts
4. Check alerts for at-risk students

## User Roles & Permissions

### Administrator
**Full system access with the following capabilities:**

**User Management:**
- Create, edit, and delete teacher accounts
- Create, edit, and delete parent accounts
- Assign roles and permissions
- Reset user passwords

**System Configuration:**
- Configure system settings
- Manage class structures
- View system-wide analytics
- Generate comprehensive reports

**Data Management:**
- Access all student data
- Bulk operations
- Data export/import
- System backups

### Teacher
**Classroom and student management capabilities:**

**Student Management:**
- Add new students
- Edit student information
- View student profiles
- Access student performance data

**Academic Management:**
- Record attendance
- Enter assessment scores
- Log participation activities
- Track behavioral incidents

**Analytics:**
- View class performance
- Generate student reports
- Monitor attendance trends
- Identify at-risk students

### Parent
**Limited access to their child's information:**

**View Access:**
- Child's attendance records
- Assessment scores and grades
- Behavioral reports
- Participation activities

**Communication:**
- View teacher notes
- Receive performance alerts
- Access progress reports

## Feature Tutorials

### Managing Students

#### Adding a New Student
```typescript
// Example student data structure
const studentData = {
  name: "Emily Johnson",
  gender: "Female",
  dateOfBirth: "2011-03-20",
  classId: 2,
  guardians: [
    {
      firstName: "Sarah",
      lastName: "Johnson",
      relationship: "Mother",
      contact: "+1987654321"
    }
  ],
  emergencyContacts: [
    {
      firstName: "Michael",
      lastName: "Johnson",
      relationship: "Father",
      contact: "+1234567890"
    }
  ]
};
```

**Steps:**
1. Navigate to Students → Add Student
2. Complete the required fields
3. Add guardian information
4. Add emergency contacts
5. Select appropriate class
6. Save the student record

#### Editing Student Information
1. Go to Students tab
2. Find the student in the list
3. Click the "Edit" button
4. Modify the information
5. Save changes

#### Searching and Filtering Students
- **Search by name:** Use the search bar
- **Filter by class:** Select class from dropdown
- **Filter by status:** Active/Inactive students
- **Sort options:** Name, Class, Enrollment Date

### Attendance Management

#### Daily Attendance Recording
```typescript
// Attendance record structure
const attendanceRecord = {
  studentId: "STU001",
  classId: 1,
  date: "2024-01-15",
  status: "present", // present, absent, late, excused
  notes: "Arrived 10 minutes late due to bus delay"
};
```

**Best Practices:**
- Record attendance at the beginning of each class
- Use consistent status codes
- Add notes for late arrivals or early departures
- Review attendance patterns weekly

#### Bulk Attendance Entry
1. Navigate to Attendance tab
2. Select "Batch Entry" mode
3. Choose date and class
4. Mark all students at once
5. Review and confirm entries

#### Attendance Reports
- **Individual Reports:** Student-specific attendance history
- **Class Reports:** Class-wide attendance statistics
- **Period Reports:** Attendance over specific time periods

### Assessment Management

#### Recording Assessment Scores
```typescript
// Assessment data structure
const assessment = {
  studentId: "STU001",
  subjectName: "Science",
  assessmentType: "quiz",
  score: 92,
  maxScore: 100,
  dateTaken: "2024-01-15",
  term: "Term 1",
  academicYear: "2024-2025",
  notes: "Excellent understanding of concepts"
};
```

**Assessment Types:**
- **Quiz:** Short assessments (10-20 minutes)
- **Test:** Standard examinations (1-2 hours)
- **Exam:** Comprehensive assessments
- **Assignment:** Take-home work
- **Project:** Long-term assignments

#### Grade Calculation
The system automatically calculates:
- Percentage scores
- Subject averages
- Overall GPA
- Term-wise performance
- Comparative rankings

### Participation Tracking

#### Logging Participation Activities
```typescript
// Participation log structure
const participationLog = {
  studentId: "STU001",
  date: "2024-01-15",
  subject: "English",
  activityType: "discussion",
  description: "Led discussion on chapter themes",
  rating: 5, // 1-5 scale
  teacherId: "T001"
};
```

**Activity Types:**
- **Answer:** Responding to questions
- **Question:** Asking thoughtful questions
- **Discussion:** Contributing to class discussions
- **Presentation:** Delivering presentations
- **Group Work:** Collaborating effectively

**Rating Scale:**
- 5: Exceptional participation
- 4: Good participation
- 3: Average participation
- 2: Minimal participation
- 1: Little to no participation

### Behavioral Tracking

#### Recording Behavioral Incidents
```typescript
// Behavioral record structure
const behavioralRecord = {
  studentId: "STU001",
  date: "2024-01-15",
  type: "positive", // positive or negative
  category: "leadership",
  description: "Helped struggling classmate with assignment",
  severity: "low", // low, medium, high (for negative behaviors)
  actionTaken: "Praised for helpful behavior",
  reportedBy: "T001"
};
```

**Positive Behavior Categories:**
- Leadership
- Cooperation
- Respect
- Punctuality
- Academic Excellence

**Negative Behavior Categories:**
- Discipline issues
- Disrespect
- Tardiness
- Academic dishonesty
- Disruption

## API Usage Examples

### Authentication
```bash
# Login
curl -X POST http://127.0.0.1:5051/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teacher1",
    "password": "password123"
  }'
```

### Student Management
```bash
# Get all students
curl -X GET http://127.0.0.1:5051/students/

# Add a new student
curl -X POST http://127.0.0.1:5051/students/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "gender": "Female",
    "dateOfBirth": "2010-08-10",
    "classId": 1,
    "guardians": [{
      "firstName": "Bob",
      "lastName": "Smith",
      "relationship": "Father",
      "contact": "+1555123456"
    }]
  }'

# Get specific student
curl -X GET http://127.0.0.1:5051/students/STU001
```

### Attendance Management
```bash
# Record attendance
curl -X POST http://127.0.0.1:5051/attendance/ \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "class_id": 1,
    "date": "2024-01-15",
    "status": "present"
  }'

# Get attendance records
curl -X GET "http://127.0.0.1:5051/attendance/?student_id=STU001&date=2024-01-15"
```

### Assessment Management
```bash
# Add assessment
curl -X POST http://127.0.0.1:5051/api/assessments/ \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "subject_name": "Mathematics",
    "assessment_type": "test",
    "score": 88,
    "max_score": 100,
    "date_taken": "2024-01-15",
    "term": "Term 1",
    "academic_year": "2024-2025"
  }'

# Get assessments
curl -X GET "http://127.0.0.1:5051/api/assessments/?student_id=STU001"
```

### Dashboard Analytics
```bash
# Get dashboard summary
curl -X GET http://127.0.0.1:5051/api/dashboard/summary

# Get student performance
curl -X GET http://127.0.0.1:5051/api/dashboard/students/1/performance

# Get alerts
curl -X GET http://127.0.0.1:5051/api/dashboard/alerts
```

## Common Workflows

### Daily Teacher Workflow

#### Morning Routine (5 minutes)
1. **Login** to the system
2. **Check Dashboard** for alerts and notifications
3. **Review Today's Schedule** - classes and students
4. **Prepare Attendance** - open attendance tracker

#### Class Time (2-3 minutes per class)
1. **Mark Attendance** for all students
2. **Log Participation** for active students
3. **Note Behavioral Incidents** if any
4. **Quick Assessment Entry** for completed work

#### End of Day (10-15 minutes)
1. **Complete Assessment Entry** for graded work
2. **Review Attendance Patterns** for concerning trends
3. **Update Student Notes** with important observations
4. **Check Parent Communications** if applicable

### Weekly Administrative Tasks

#### Monday - Week Planning
1. **Review Last Week's Data** - attendance, assessments
2. **Identify At-Risk Students** using dashboard alerts
3. **Plan Interventions** for struggling students
4. **Schedule Parent Meetings** if needed

#### Wednesday - Mid-Week Check
1. **Monitor Attendance Trends** for the week
2. **Review Assessment Submissions** and grading
3. **Update Participation Logs** for all classes
4. **Check System Alerts** and notifications

#### Friday - Week Wrap-Up
1. **Generate Weekly Reports** for classes
2. **Complete Assessment Entry** for the week
3. **Review Behavioral Trends** and incidents
4. **Prepare Data** for parent communications

### Monthly Reporting Workflow

#### Data Collection (Week 1)
1. **Export Student Data** from all modules
2. **Generate Attendance Reports** by class and individual
3. **Compile Assessment Results** by subject and term
4. **Review Behavioral Summaries** for trends

#### Analysis (Week 2)
1. **Calculate Performance Metrics** and averages
2. **Identify Trends** in attendance and grades
3. **Compare Class Performance** across subjects
4. **Highlight Success Stories** and improvements

#### Report Generation (Week 3)
1. **Create Individual Reports** for each student
2. **Generate Class Summaries** for teachers
3. **Prepare Parent Communications** with insights
4. **Develop Action Plans** for at-risk students

#### Distribution (Week 4)
1. **Send Reports** to parents and guardians
2. **Schedule Parent Meetings** for concerning cases
3. **Share Insights** with teaching staff
4. **Update Student Records** with report data

## Troubleshooting

### Common Issues and Solutions

#### Login Problems
**Issue:** Cannot login with credentials
**Solutions:**
1. Verify username and password spelling
2. Check if account is active
3. Contact administrator for password reset
4. Clear browser cache and cookies

#### Data Not Loading
**Issue:** Students/Attendance/Assessments not displaying
**Solutions:**
1. Check internet connection
2. Refresh the page (Ctrl+F5)
3. Verify API server is running
4. Check browser console for errors

#### Attendance Not Saving
**Issue:** Attendance records not being saved
**Solutions:**
1. Ensure student and class are selected
2. Verify date format (YYYY-MM-DD)
3. Check required fields are filled
4. Try batch upload for multiple records

#### Assessment Entry Errors
**Issue:** Cannot add assessment scores
**Solutions:**
1. Verify score is within max score range
2. Check date format and validity
3. Ensure student exists in system
4. Validate subject name spelling

#### Performance Issues
**Issue:** System running slowly
**Solutions:**
1. Clear browser cache
2. Close unnecessary browser tabs
3. Check system resource usage
4. Contact IT support for server issues

### Error Messages

#### Common Error Codes
- **400 Bad Request:** Invalid data format or missing fields
- **401 Unauthorized:** Login required or session expired
- **403 Forbidden:** Insufficient permissions for action
- **404 Not Found:** Requested resource doesn't exist
- **500 Internal Server Error:** Server-side issue, contact support

#### Frontend Error Messages
- **"Failed to load data":** API connection issue
- **"Validation failed":** Form data doesn't meet requirements
- **"Session expired":** Need to login again
- **"Permission denied":** User role lacks required access

## Best Practices

### Data Entry Guidelines

#### Consistency Standards
1. **Naming Conventions:**
   - Use proper capitalization for names
   - Avoid abbreviations in formal fields
   - Be consistent with formatting

2. **Date Formats:**
   - Always use YYYY-MM-DD format
   - Double-check dates for accuracy
   - Use current academic year

3. **Score Entry:**
   - Enter scores promptly after grading
   - Include partial credit appropriately
   - Add meaningful notes for context

#### Quality Assurance
1. **Daily Reviews:**
   - Check attendance accuracy
   - Verify assessment entries
   - Review participation logs

2. **Weekly Audits:**
   - Compare records across systems
   - Validate calculated averages
   - Check for missing data

3. **Monthly Reconciliation:**
   - Generate comprehensive reports
   - Verify parent communication accuracy
   - Update student status as needed

### Security Best Practices

#### Password Management
1. **Strong Passwords:**
   - Use 8+ characters
   - Include numbers and symbols
   - Avoid personal information

2. **Regular Updates:**
   - Change passwords quarterly
   - Never share credentials
   - Use unique passwords

#### Data Protection
1. **Access Control:**
   - Only access necessary data
   - Log out when finished
   - Report suspicious activity

2. **Privacy Compliance:**
   - Follow FERPA guidelines
   - Protect student information
   - Secure physical access

### Performance Optimization

#### Efficient Workflows
1. **Batch Operations:**
   - Use bulk attendance entry
   - Group assessment entries
   - Schedule regular data maintenance

2. **Keyboard Shortcuts:**
   - Learn system shortcuts
   - Use tab navigation
   - Implement quick actions

#### System Maintenance
1. **Regular Backups:**
   - Daily automated backups
   - Weekly manual verification
   - Monthly archive creation

2. **Performance Monitoring:**
   - Track system response times
   - Monitor user activity
   - Report performance issues

This comprehensive usage guide provides all the information needed to effectively use the Student Performance Tracking System. For additional support, contact your system administrator or refer to the technical documentation.