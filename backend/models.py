from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Student(db.Model):
    __tablename__ = 'students'
    student_id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10))
    date_of_birth = db.Column(db.Date)
    class_id = db.Column(db.Integer)
    guardian_contact = db.Column(db.String(15))

class Attendance(db.Model):
    __tablename__ = 'attendance'
    attendance_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'))
    class_id = db.Column(db.Integer)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(10), nullable=False)

class Assessment(db.Model):
    __tablename__ = 'assessments'
    assessment_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'), nullable=False)
    subject_id = db.Column(db.Integer, nullable=False)  # For later if a subjects table is create
    subject_name = db.Column(db.String(100), nullable=False)  # Temporary until subjects table exists
    assessment_type = db.Column(db.String(50), nullable=False)  # 'quiz', 'test', 'exam', 'assignment'
    score = db.Column(db.Float, nullable=False)
    max_score = db.Column(db.Float, nullable=False)
    date_taken = db.Column(db.Date, nullable=False)
    term = db.Column(db.String(20))  # 'Term 1', 'Term 2', 'Term 3'
    academic_year = db.Column(db.String(10))  # '2024-2025'
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class behavior(db.Model):
    __tablename__ ='behavior'
    behavior_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'), nullable=False)
    behavior_type = db.Column(db.String(10), nullable=False)  # 'positive' or 'negative'
    category = db.Column(db.String(50), nullable=False)       # e.g., 'participation', 'lateness', etc.
    notes = db.Column(db.Text)
    date = db.Column(db.Date, nullable=False, default=db.func.current_date())
    teacher_id = db.Column(db.String(20))                     # Optional teacher/staff identifier
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class Participation(db.Model):
    __tablename__ = 'participation'
    participation_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.student_id'), nullable=False)
    event_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    remarks = db.Column(db.String(255))    
