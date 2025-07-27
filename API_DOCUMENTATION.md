# Student Performance Tracking System - API Documentation

## Overview
The Student Performance Tracking System provides a comprehensive API for managing student data, attendance, assessments, behavioral records, and participation tracking. The system is built with Flask (Python) backend and React TypeScript frontend.

**Base URL:** `http://127.0.0.1:5051`

## Table of Contents
- [Authentication](#authentication)
- [Students API](#students-api)
- [Attendance API](#attendance-api)
- [Assessments API](#assessments-api)
- [Participation API](#participation-api)
- [Behavioral API](#behavioral-api)
- [Dashboard API](#dashboard-api)
- [Admin API](#admin-api)
- [Teacher API](#teacher-api)
- [Parent API](#parent-api)
- [Data Models](#data-models)

## Authentication

### Login
Authenticates users and returns user information.

**Endpoint:** `POST /api/login`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "username": "string",
    "role": "admin|teacher|parent"
  }
}
```

**Example:**
```bash
curl -X POST http://127.0.0.1:5051/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "teacher1", "password": "password123"}'
```

### Sign Up
Creates a new user account.

**Endpoint:** `POST /api/signup`

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "role": "teacher|parent"
}
```

### Forgot Password
Initiates password reset process.

**Endpoint:** `POST /api/forgot-password`

**Request Body:**
```json
{
  "email": "string"
}
```

## Students API

### Get All Students
Retrieves all students with their guardian and emergency contact information.

**Endpoint:** `GET /students/`

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "class_id": "number",
    "guardians": [
      {
        "firstName": "string",
        "lastName": "string",
        "relationship": "string",
        "contact": "string"
      }
    ],
    "emergencyContacts": [
      {
        "firstName": "string",
        "lastName": "string",
        "relationship": "string",
        "contact": "string"
      }
    ]
  }
]
```

**Example:**
```bash
curl -X GET http://127.0.0.1:5051/students/
```

### Add Student
Creates a new student record.

**Endpoint:** `POST /students/`

**Request Body:**
```json
{
  "name": "string",
  "gender": "Male|Female|Other",
  "dateOfBirth": "YYYY-MM-DD",
  "classId": "number",
  "guardians": [
    {
      "firstName": "string",
      "lastName": "string",
      "relationship": "string",
      "contact": "string"
    }
  ],
  "emergencyContacts": [
    {
      "firstName": "string",
      "lastName": "string", 
      "relationship": "string",
      "contact": "string"
    }
  ]
}
```

**Example:**
```bash
curl -X POST http://127.0.0.1:5051/students/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "gender": "Male",
    "dateOfBirth": "2010-05-15",
    "classId": 1,
    "guardians": [{
      "firstName": "Jane",
      "lastName": "Doe",
      "relationship": "Mother",
      "contact": "+1234567890"
    }],
    "emergencyContacts": []
  }'
```

### Get Student by ID
Retrieves a specific student's information.

**Endpoint:** `GET /students/{student_id}`

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "class_id": "number",
  "guardians": [...],
  "emergencyContacts": [...]
}
```

### Update Student
Updates student information.

**Endpoint:** `PUT /students/{student_id}`

**Request Body:** Same as Add Student

### Delete Student
Removes a student record.

**Endpoint:** `DELETE /students/{student_id}`

### Get Classes
Retrieves all available classes.

**Endpoint:** `GET /students/classes`

**Response:**
```json
[
  {
    "class_id": "number",
    "class_name": "string",
    "teacher_id": "number"
  }
]
```

## Attendance API

### Record Attendance
Records attendance for a student.

**Endpoint:** `POST /attendance/`

**Request Body:**
```json
{
  "student_id": "string",
  "class_id": "number",
  "date": "YYYY-MM-DD",
  "status": "present|absent|late|excused"
}
```

**Example:**
```bash
curl -X POST http://127.0.0.1:5051/attendance/ \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "class_id": 1,
    "date": "2024-01-15",
    "status": "present"
  }'
```

### Get Attendance Records
Retrieves attendance records with optional filtering.

**Endpoint:** `GET /attendance/`

**Query Parameters:**
- `student_id` (optional): Filter by student
- `date` (optional): Filter by date
- `class_id` (optional): Filter by class

**Response:**
```json
[
  {
    "attendance_id": "number",
    "student_id": "string",
    "class_id": "number",
    "date": "YYYY-MM-DD",
    "status": "string"
  }
]
```

### Batch Attendance
Records attendance for multiple students.

**Endpoint:** `POST /attendance/batch`

**Request Body:**
```json
{
  "records": [
    {
      "student_id": "string",
      "class_id": "number",
      "date": "YYYY-MM-DD",
      "status": "present|absent|late|excused"
    }
  ]
}
```

### Update Attendance
Modifies an existing attendance record.

**Endpoint:** `PUT /attendance/{attendance_id}`

### Delete Attendance
Removes an attendance record.

**Endpoint:** `DELETE /attendance/{attendance_id}`

## Assessments API

### Get All Assessments
Retrieves all assessment records.

**Endpoint:** `GET /api/assessments/`

**Response:**
```json
[
  {
    "assessment_id": "number",
    "student_id": "string",
    "subject_name": "string",
    "assessment_type": "quiz|test|exam|assignment",
    "score": "number",
    "max_score": "number",
    "date_taken": "YYYY-MM-DD",
    "term": "string",
    "academic_year": "string",
    "notes": "string"
  }
]
```

### Add Assessment
Creates a new assessment record.

**Endpoint:** `POST /api/assessments/`

**Request Body:**
```json
{
  "student_id": "string",
  "subject_name": "string",
  "assessment_type": "quiz|test|exam|assignment",
  "score": "number",
  "max_score": "number",
  "date_taken": "YYYY-MM-DD",
  "term": "string",
  "academic_year": "string",
  "notes": "string"
}
```

**Example:**
```bash
curl -X POST http://127.0.0.1:5051/api/assessments/ \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "subject_name": "Mathematics",
    "assessment_type": "test",
    "score": 85,
    "max_score": 100,
    "date_taken": "2024-01-15",
    "term": "Term 1",
    "academic_year": "2024-2025"
  }'
```

### Get Assessment by ID
Retrieves a specific assessment.

**Endpoint:** `GET /api/assessments/{assessment_id}`

### Update Assessment
Modifies an existing assessment.

**Endpoint:** `PUT /api/assessments/{assessment_id}`

### Delete Assessment
Removes an assessment record.

**Endpoint:** `DELETE /api/assessments/{assessment_id}`

### Assessment Statistics
Gets statistical data for assessments.

**Endpoint:** `GET /api/assessments/statistics`

**Response:**
```json
{
  "total_assessments": "number",
  "average_score": "number",
  "subject_performance": {
    "subject_name": "average_percentage"
  }
}
```

## Participation API

### Log Participation
Records a participation activity.

**Endpoint:** `POST /api/participation/`

**Request Body:**
```json
{
  "student_id": "string",
  "class_id": "number",
  "event_name": "string",
  "date": "YYYY-MM-DD",
  "status": "string",
  "remarks": "string"
}
```

### Get Participation Records
Retrieves participation records.

**Endpoint:** `GET /api/participation/`

**Response:**
```json
[
  {
    "participation_id": "number",
    "student_id": "string",
    "class_id": "number",
    "event_name": "string",
    "date": "YYYY-MM-DD",
    "status": "string",
    "remarks": "string"
  }
]
```

### Get Participation by Date
Retrieves participation records for a specific date.

**Endpoint:** `GET /api/participation/date/{date}`

### Average Participation Rating
Gets average participation rating.

**Endpoint:** `GET /api/participation/average-rating`

**Response:**
```json
{
  "average_rating": "number",
  "total_records": "number"
}
```

## Behavioral API

### Get Behavioral Records
Retrieves behavioral records.

**Endpoint:** `GET /api/behavioral/`

**Response:**
```json
[
  {
    "behavior_id": "number",
    "student_id": "string",
    "behavior_type": "positive|negative",
    "category": "string",
    "notes": "string",
    "date": "YYYY-MM-DD",
    "teacher_id": "string"
  }
]
```

### Add Behavioral Record
Creates a new behavioral record.

**Endpoint:** `POST /api/behavioral/`

**Request Body:**
```json
{
  "student_id": "string",
  "behavior_type": "positive|negative",
  "category": "string",
  "notes": "string",
  "date": "YYYY-MM-DD",
  "teacher_id": "string"
}
```

**Example:**
```bash
curl -X POST http://127.0.0.1:5051/api/behavioral/ \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STU001",
    "behavior_type": "positive",
    "category": "participation",
    "notes": "Actively participated in class discussion",
    "date": "2024-01-15",
    "teacher_id": "T001"
  }'
```

## Dashboard API

### Dashboard Summary
Gets overall dashboard statistics.

**Endpoint:** `GET /api/dashboard/summary`

**Response:**
```json
{
  "total_students": "number",
  "average_score": "number",
  "attendance_rate": "number",
  "high_performers": "number"
}
```

### Student Performance
Gets performance data for a specific student.

**Endpoint:** `GET /api/dashboard/students/{student_id}/performance`

**Response:**
```json
{
  "student_id": "string",
  "average_score": "number",
  "attendance_rate": "number",
  "is_high_performer": "boolean"
}
```

### Subject Performance
Gets performance data by subject.

**Endpoint:** `GET /api/dashboard/subject-performance`

**Response:**
```json
{
  "subjects": [
    {
      "subject": "string",
      "average_score": "number",
      "total_assessments": "number"
    }
  ]
}
```

### Dashboard Alerts
Gets alerts for low performance or attendance.

**Endpoint:** `GET /api/dashboard/alerts`

**Response:**
```json
{
  "low_attendance": [
    {
      "student_id": "string",
      "attendance_rate": "number"
    }
  ],
  "low_performance": [
    {
      "student_id": "string",
      "average_score": "number"
    }
  ]
}
```

### Top Students
Gets top performing students.

**Endpoint:** `GET /api/dashboard/top-students`

**Response:**
```json
[
  {
    "student_id": "string",
    "average_score": "number",
    "total_assessments": "number"
  }
]
```

### Recent Activities
Gets recent system activities.

**Endpoint:** `GET /api/dashboard/recent-activities`

## Admin API

### Get All Users
Retrieves all system users (admin only).

**Endpoint:** `GET /api/admin/users`

### Create Teacher
Creates a new teacher account.

**Endpoint:** `POST /api/admin/users/teachers`

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "full_name": "string",
  "phone": "string"
}
```

### Create Parent
Creates a new parent account.

**Endpoint:** `POST /api/admin/users/parents`

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "full_name": "string",
  "student_id": "string"
}
```

### Update User
Updates user information.

**Endpoint:** `PUT /api/admin/users/{user_id}`

### Delete User
Removes a user account.

**Endpoint:** `DELETE /api/admin/users/{user_id}`

### Reset Password
Resets a user's password.

**Endpoint:** `POST /api/admin/users/{user_id}/reset-password`

## Teacher API

### Teacher Login
Authenticates teacher users.

**Endpoint:** `POST /api/teacher/login`

### Teacher Dashboard
Gets teacher-specific dashboard data.

**Endpoint:** `GET /api/teacher/dashboard`

## Parent API

### Parent Login
Authenticates parent users.

**Endpoint:** `POST /api/parent/login`

### Parent Dashboard
Gets parent-specific dashboard data for their children.

**Endpoint:** `GET /api/parent/dashboard`

## Data Models

### Student
```typescript
interface Student {
  id: string;
  name: string;
  studentId: string;
  class: string;
  grade: string;
  age: number;
  guardianName: string;
  guardianPhone: string;
  enrollmentDate: string;
  profileImage?: string;
}
```

### AttendanceRecord
```typescript
interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  markedBy: string;
  timestamp: string;
}
```

### AssessmentScore
```typescript
interface AssessmentScore {
  id: string;
  studentId: string;
  subject: string;
  assessmentType: 'test' | 'quiz' | 'exam' | 'assignment' | 'project';
  assessmentName: string;
  score: number;
  maxScore: number;
  date: string;
  term: string;
  teacherId: string;
  notes?: string;
}
```

### ParticipationLog
```typescript
interface ParticipationLog {
  id: string;
  studentId: string;
  date: string;
  subject: string;
  activityType: 'answer' | 'question' | 'discussion' | 'presentation' | 'group_work';
  description: string;
  rating: 1 | 2 | 3 | 4 | 5;
  teacherId: string;
  timestamp: string;
}
```

### BehavioralRecord
```typescript
interface BehavioralRecord {
  id: string;
  studentId: string;
  date: string;
  type: 'positive' | 'negative';
  category: 'discipline' | 'leadership' | 'cooperation' | 'respect' | 'punctuality' | 'other';
  description: string;
  severity?: 'low' | 'medium' | 'high';
  actionTaken?: string;
  reportedBy: string;
  timestamp: string;
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

## Rate Limiting

Currently, no rate limiting is implemented, but it's recommended for production deployment.

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for all routes to support the React frontend.