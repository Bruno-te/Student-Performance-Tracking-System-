# Student Performance Tracking System - Backend Documentation

## Overview
This document provides comprehensive documentation for the Flask-based backend system, including database models, API functions, and system architecture.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Database Models](#database-models)
- [API Routes](#api-routes)
- [Authentication & Authorization](#authentication--authorization)
- [Database Functions](#database-functions)
- [Configuration](#configuration)
- [Deployment](#deployment)

## Architecture Overview

### Technology Stack
- **Framework:** Flask 2.x
- **Database:** SQLite (development) / PostgreSQL (production)
- **ORM:** SQLAlchemy
- **Authentication:** Session-based
- **CORS:** Flask-CORS
- **Environment:** Python 3.8+

### Project Structure
```
backend/
├── app.py              # Flask application factory
├── main.py             # Main application entry point
├── config.py           # Configuration settings
├── models.py           # Database models
├── schema.sql          # Database schema
├── requirements.txt    # Python dependencies
├── routes/             # API route blueprints
│   ├── admin.py        # Admin management
│   ├── assessments.py  # Assessment management
│   ├── attendance.py   # Attendance tracking
│   ├── behavioral.py   # Behavioral records
│   ├── dashboard.py    # Dashboard analytics
│   ├── parent.py       # Parent portal
│   ├── participation.py # Participation logging
│   ├── students.py     # Student management
│   ├── teacher_bp.py   # Teacher portal
│   └── teacher_assignments.py # Teacher assignments
└── tests/              # Unit tests
```

## Database Models

### User Model
**Table:** `users`

```python
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin', 'teacher', 'parent'
    email = db.Column(db.String(100))
```

**Relationships:**
- One-to-one with Parent
- One-to-one with Teacher

**Methods:**
```python
def set_password(self, password: str) -> None
def check_password(self, password: str) -> bool
def to_dict(self) -> dict
```

### Student Model
**Table:** `students`

```python
class Student(db.Model):
    __tablename__ = 'students'
    student_id = db.Column(db.String, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10))
    date_of_birth = db.Column(db.Date)
    enrollment_date = db.Column(db.Date, default=db.func.current_date())
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'))
    guardian_contact = db.Column(db.String(15))
```

**Relationships:**
- Many-to-many with Parent through StudentParentLink
- One-to-many with Attendance
- One-to-many with Assessment
- One-to-many with Participation
- One-to-many with Behavioral
- One-to-many with Guardian
- One-to-many with EmergencyContact

### Class Model
**Table:** `classes`

```python
class Class(db.Model):
    __tablename__ = 'classes'
    class_id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(50), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.teacher_id'))
```

**Relationships:**
- Many-to-one with Teacher
- One-to-many with Student
- One-to-many with Attendance

### Teacher Model
**Table:** `teachers`

```python
class Teacher(db.Model):
    __tablename__ = 'teachers'
    teacher_id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100))
    phone = db.Column(db.String(15))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'))
```

**Relationships:**
- One-to-one with User
- One-to-many with Class

### Parent Model
**Table:** `parents`

```python
class Parent(db.Model):
    __tablename__ = 'parents'
    parent_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'))
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15))
    address = db.Column(db.Text)
```

**Relationships:**
- One-to-one with User
- Many-to-many with Student through StudentParentLink

### Attendance Model
**Table:** `attendance`

```python
class Attendance(db.Model):
    __tablename__ = 'attendance'
    attendance_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String, db.ForeignKey('students.student_id'))
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'))
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(10), nullable=False)  # 'present', 'absent', 'late', 'excused'
```

**Methods:**
```python
def to_dict(self) -> dict
@staticmethod
def get_attendance_rate(student_id: str, start_date: date, end_date: date) -> float
```

### Assessment Model
**Table:** `assessments`

```python
class Assessment(db.Model):
    __tablename__ = 'assessments'
    assessment_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String, db.ForeignKey('students.student_id'), nullable=False)
    subject_id = db.Column(db.Integer, nullable=False)
    subject_name = db.Column(db.String(100), nullable=False)
    assessment_type = db.Column(db.String(50), nullable=False)  # 'quiz', 'test', 'exam', 'assignment'
    score = db.Column(db.Float, nullable=False)
    max_score = db.Column(db.Float, nullable=False)
    date_taken = db.Column(db.Date, nullable=False)
    term = db.Column(db.String(20))  # 'Term 1', 'Term 2', 'Term 3'
    academic_year = db.Column(db.String(10))  # '2024-2025'
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
```

**Methods:**
```python
def get_percentage(self) -> float
def to_dict(self) -> dict
@staticmethod
def get_student_average(student_id: str, subject: str = None) -> float
```

### Behavioral Model
**Table:** `behavior`

```python
class Behavioral(db.Model):
    __tablename__ = 'behavior'
    behavior_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String, db.ForeignKey('students.student_id'), nullable=False)
    behavior_type = db.Column(db.String(10), nullable=False)  # 'positive' or 'negative'
    category = db.Column(db.String(50), nullable=False)  # 'participation', 'discipline', etc.
    notes = db.Column(db.Text)
    date = db.Column(db.Date, nullable=False, default=db.func.current_date())
    teacher_id = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
```

### Participation Model
**Table:** `participation`

```python
class Participation(db.Model):
    __tablename__ = 'participation'
    participation_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String, db.ForeignKey('students.student_id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'))
    event_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    remarks = db.Column(db.String(255))
```

## API Routes

### Student Management Routes
**Blueprint:** `students_bp` (Prefix: `/students`)

#### Get All Students
```python
@students_bp.route('/', methods=['GET', 'OPTIONS'])
def get_students():
    """
    Retrieves all students with their guardian and emergency contact information.
    
    Returns:
        JSON: List of student objects with nested guardian and emergency contact data
    """
```

#### Add Student
```python
@students_bp.route('/', methods=['POST', 'OPTIONS'])
def add_student():
    """
    Creates a new student record with guardians and emergency contacts.
    
    Request Body:
        - name: str (required)
        - gender: str (optional)
        - dateOfBirth: str (optional, YYYY-MM-DD format)
        - classId: int (optional)
        - guardians: list (optional)
        - emergencyContacts: list (optional)
    
    Returns:
        JSON: Success message with student ID
    """
```

#### Get Student by ID
```python
@students_bp.route('/<student_id>', methods=['GET'])
def get_student(student_id: str):
    """
    Retrieves a specific student's information.
    
    Args:
        student_id: Unique student identifier
        
    Returns:
        JSON: Student object with nested data
    """
```

#### Update Student
```python
@students_bp.route('/<student_id>', methods=['PUT'])
def update_student(student_id: str):
    """
    Updates student information.
    
    Args:
        student_id: Unique student identifier
        
    Request Body: Same as add_student
    
    Returns:
        JSON: Success message
    """
```

#### Delete Student
```python
@students_bp.route('/<student_id>', methods=['DELETE'])
def delete_student(student_id: str):
    """
    Removes a student record and all associated data.
    
    Args:
        student_id: Unique student identifier
        
    Returns:
        JSON: Success message
    """
```

### Attendance Management Routes
**Blueprint:** `attendance_bp` (Prefix: `/attendance`)

#### Record Attendance
```python
@attendance_bp.route('/', methods=['POST'])
def record_attendance():
    """
    Records attendance for a student.
    
    Request Body:
        - student_id: str (required)
        - class_id: int (required)
        - date: str (required, YYYY-MM-DD format)
        - status: str (required, one of: 'present', 'absent', 'late', 'excused')
    
    Returns:
        JSON: Success message with attendance ID
    """
```

#### Get Attendance Records
```python
@attendance_bp.route('/', methods=['GET'])
def get_attendance():
    """
    Retrieves attendance records with optional filtering.
    
    Query Parameters:
        - student_id: str (optional)
        - date: str (optional, YYYY-MM-DD format)
        - class_id: int (optional)
        - start_date: str (optional)
        - end_date: str (optional)
    
    Returns:
        JSON: List of attendance records
    """
```

#### Batch Attendance Recording
```python
@attendance_bp.route('/batch', methods=['POST'])
def batch_attendance():
    """
    Records attendance for multiple students at once.
    
    Request Body:
        - records: list of attendance objects
    
    Returns:
        JSON: Success message with count of records created
    """
```

### Assessment Management Routes
**Blueprint:** `assessments_bp` (Prefix: `/api/assessments`)

#### Get All Assessments
```python
@assessments_bp.route('/', methods=['GET'])
def get_assessments():
    """
    Retrieves all assessment records with optional filtering.
    
    Query Parameters:
        - student_id: str (optional)
        - subject: str (optional)
        - assessment_type: str (optional)
        - term: str (optional)
        - academic_year: str (optional)
    
    Returns:
        JSON: List of assessment records
    """
```

#### Add Assessment
```python
@assessments_bp.route('/', methods=['POST'])
def add_assessment():
    """
    Creates a new assessment record.
    
    Request Body:
        - student_id: str (required)
        - subject_name: str (required)
        - assessment_type: str (required)
        - score: float (required)
        - max_score: float (required)
        - date_taken: str (required, YYYY-MM-DD format)
        - term: str (optional)
        - academic_year: str (optional)
        - notes: str (optional)
    
    Returns:
        JSON: Success message with assessment ID
    """
```

#### Assessment Statistics
```python
@assessments_bp.route('/statistics', methods=['GET'])
def get_assessment_statistics():
    """
    Retrieves statistical data for assessments.
    
    Returns:
        JSON: Statistical summary including:
            - total_assessments: int
            - average_score: float
            - subject_performance: dict
            - grade_distribution: dict
    """
```

### Dashboard Analytics Routes
**Blueprint:** `dashboard_bp` (Prefix: `/api/dashboard`)

#### Dashboard Summary
```python
@dashboard_bp.route('/summary', methods=['GET'])
def dashboard_summary():
    """
    Gets overall dashboard statistics.
    
    Returns:
        JSON: Summary statistics including:
            - total_students: int
            - average_score: float
            - attendance_rate: float
            - high_performers: int
    """
```

#### Student Performance Analytics
```python
@dashboard_bp.route('/students/<int:student_id>/performance', methods=['GET'])
def student_performance(student_id: int):
    """
    Gets detailed performance data for a specific student.
    
    Args:
        student_id: Student ID
        
    Returns:
        JSON: Performance metrics including:
            - average_score: float
            - attendance_rate: float
            - is_high_performer: bool
            - subject_breakdown: dict
    """
```

#### Subject Performance Analysis
```python
@dashboard_bp.route('/subject-performance', methods=['GET'])
def subject_performance():
    """
    Gets performance data aggregated by subject.
    
    Returns:
        JSON: Subject performance data
    """
```

#### Dashboard Alerts
```python
@dashboard_bp.route('/alerts', methods=['GET'])
def get_alerts():
    """
    Gets alerts for students with low performance or attendance.
    
    Returns:
        JSON: Alert data including:
            - low_attendance: list
            - low_performance: list
            - behavioral_concerns: list
    """
```

### Admin Management Routes
**Blueprint:** `admin_bp` (Prefix: `/api/admin`)

#### User Management
```python
@admin_bp.route('/users', methods=['GET'])
def get_users():
    """Admin only: Retrieves all system users."""

@admin_bp.route('/users/teachers', methods=['POST'])
def create_teacher():
    """Admin only: Creates a new teacher account."""

@admin_bp.route('/users/parents', methods=['POST'])
def create_parent():
    """Admin only: Creates a new parent account."""

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id: int):
    """Admin only: Updates user information."""

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id: int):
    """Admin only: Deletes a user account."""
```

## Database Functions

### Student Management Functions

```python
def create_student(data: dict) -> str:
    """
    Creates a new student record with associated guardians and emergency contacts.
    
    Args:
        data: Dictionary containing student information
        
    Returns:
        str: Generated student ID
        
    Raises:
        ValueError: If required fields are missing
        IntegrityError: If student already exists
    """

def get_student_by_id(student_id: str) -> dict:
    """
    Retrieves student information with nested guardian and emergency contact data.
    
    Args:
        student_id: Unique student identifier
        
    Returns:
        dict: Complete student information
        
    Raises:
        NotFoundError: If student doesn't exist
    """

def update_student(student_id: str, data: dict) -> bool:
    """
    Updates student information and associated records.
    
    Args:
        student_id: Unique student identifier
        data: Updated information
        
    Returns:
        bool: Success status
    """

def delete_student(student_id: str) -> bool:
    """
    Deletes student and all associated records (cascading delete).
    
    Args:
        student_id: Unique student identifier
        
    Returns:
        bool: Success status
    """
```

### Attendance Functions

```python
def record_attendance(student_id: str, class_id: int, date: str, status: str) -> int:
    """
    Records attendance for a student.
    
    Args:
        student_id: Student identifier
        class_id: Class identifier
        date: Attendance date (YYYY-MM-DD)
        status: Attendance status
        
    Returns:
        int: Attendance record ID
    """

def get_attendance_rate(student_id: str, start_date: str, end_date: str) -> float:
    """
    Calculates attendance rate for a student over a date range.
    
    Args:
        student_id: Student identifier
        start_date: Start date (YYYY-MM-DD)
        end_date: End date (YYYY-MM-DD)
        
    Returns:
        float: Attendance rate as percentage
    """

def get_class_attendance(class_id: int, date: str) -> list:
    """
    Gets attendance for all students in a class on a specific date.
    
    Args:
        class_id: Class identifier
        date: Attendance date
        
    Returns:
        list: Attendance records
    """
```

### Assessment Functions

```python
def add_assessment(data: dict) -> int:
    """
    Creates a new assessment record.
    
    Args:
        data: Assessment information
        
    Returns:
        int: Assessment ID
    """

def get_student_assessments(student_id: str, subject: str = None) -> list:
    """
    Retrieves all assessments for a student, optionally filtered by subject.
    
    Args:
        student_id: Student identifier
        subject: Subject filter (optional)
        
    Returns:
        list: Assessment records
    """

def calculate_student_average(student_id: str, subject: str = None) -> float:
    """
    Calculates average score for a student.
    
    Args:
        student_id: Student identifier
        subject: Subject filter (optional)
        
    Returns:
        float: Average percentage score
    """

def get_subject_statistics(subject: str) -> dict:
    """
    Gets statistical data for a specific subject.
    
    Args:
        subject: Subject name
        
    Returns:
        dict: Statistical summary
    """
```

### Analytics Functions

```python
def get_dashboard_summary() -> dict:
    """
    Generates dashboard summary statistics.
    
    Returns:
        dict: Summary data including counts, averages, and rates
    """

def get_performance_trends(student_id: str = None, period: str = '30d') -> list:
    """
    Gets performance trend data.
    
    Args:
        student_id: Student identifier (optional, for all students if None)
        period: Time period ('30d', '90d', '1y')
        
    Returns:
        list: Trend data points
    """

def identify_at_risk_students(threshold: dict) -> list:
    """
    Identifies students at risk based on attendance and performance thresholds.
    
    Args:
        threshold: Dictionary with 'attendance' and 'performance' thresholds
        
    Returns:
        list: At-risk student IDs with reasons
    """
```

## Authentication & Authorization

### Session Management
```python
def authenticate_user(username: str, password: str) -> dict:
    """
    Authenticates user credentials.
    
    Args:
        username: User's username
        password: User's password
        
    Returns:
        dict: User information if successful, None if failed
    """

def check_role_permission(user_role: str, required_role: str) -> bool:
    """
    Checks if user has required role permissions.
    
    Args:
        user_role: User's current role
        required_role: Required role for action
        
    Returns:
        bool: Permission status
    """
```

### Role Hierarchy
```
Admin > Teacher > Parent
```

**Permissions:**
- **Admin:** Full system access, user management, system configuration
- **Teacher:** Student data management, assessment entry, attendance marking
- **Parent:** View own child's data only

## Configuration

### Environment Variables
```python
# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///student_tracking.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
    
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True
    
class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False
    
class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
```

### Database Configuration
```python
# Database initialization
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    """Initialize database with app context."""
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        
        # Create default admin user if not exists
        if not User.query.filter_by(username='admin').first():
            admin = User(
                username='admin',
                role='admin',
                email='admin@school.edu'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
```

## Error Handling

### Custom Exceptions
```python
class StudentTrackingException(Exception):
    """Base exception for the application."""
    pass

class ValidationError(StudentTrackingException):
    """Raised when data validation fails."""
    pass

class NotFoundError(StudentTrackingException):
    """Raised when requested resource is not found."""
    pass

class PermissionError(StudentTrackingException):
    """Raised when user lacks required permissions."""
    pass
```

### Error Handlers
```python
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad request'}), 400

@app.errorhandler(ValidationError)
def validation_error(error):
    return jsonify({'error': str(error)}), 400

@app.errorhandler(PermissionError)
def permission_error(error):
    return jsonify({'error': 'Insufficient permissions'}), 403
```

## Testing

### Unit Test Examples
```python
import unittest
from app import create_app, db
from models import Student, User

class StudentTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        
    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
        
    def test_create_student(self):
        """Test student creation."""
        student_data = {
            'name': 'John Doe',
            'gender': 'Male',
            'dateOfBirth': '2010-05-15',
            'classId': 1
        }
        
        with self.app.test_client() as client:
            response = client.post('/students/', 
                                 json=student_data,
                                 content_type='application/json')
            
        self.assertEqual(response.status_code, 201)
        self.assertIn('student_id', response.json)
```

### API Testing
```python
def test_get_students_api():
    """Test GET /students/ endpoint."""
    with app.test_client() as client:
        response = client.get('/students/')
        assert response.status_code == 200
        assert isinstance(response.json, list)

def test_attendance_recording():
    """Test attendance recording API."""
    attendance_data = {
        'student_id': 'STU001',
        'class_id': 1,
        'date': '2024-01-15',
        'status': 'present'
    }
    
    with app.test_client() as client:
        response = client.post('/attendance/', 
                             json=attendance_data)
        assert response.status_code == 201
```

## Deployment

### Production Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export FLASK_ENV=production
export SECRET_KEY=your-secret-key
export DATABASE_URL=postgresql://user:pass@localhost/dbname

# Initialize database
flask db upgrade

# Run with Gunicorn
gunicorn --bind 0.0.0.0:5000 "app:create_app('production')"
```

### Docker Configuration
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:create_app('production')"]
```

### Performance Monitoring
```python
# Add logging and monitoring
import logging
from flask import g
import time

@app.before_request
def before_request():
    g.start_time = time.time()

@app.after_request
def after_request(response):
    total_time = time.time() - g.start_time
    app.logger.info(f'Request completed in {total_time:.3f}s')
    return response
```

## Security Considerations

### Data Validation
- Input sanitization for all user inputs
- SQL injection prevention through ORM
- XSS protection in form handling
- File upload validation

### Access Control
- Role-based permissions
- Session timeout management
- Password complexity requirements
- Audit logging for sensitive operations

### Data Protection
- Password hashing with bcrypt
- HTTPS enforcement in production
- Sensitive data encryption
- GDPR compliance for student data