from flask_sqlalchemy import SQLAlchemy

# Initialize the database

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100))
    # Relationships
    parent = db.relationship('Parent', backref='user', uselist=False)
    teacher = db.relationship('Teacher', backref='user', uselist=False)

class Parent(db.Model):
    __tablename__ = 'parents'
    parent_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'))
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15))
    address = db.Column(db.Text)
    # Relationships
    students = db.relationship('StudentParentLink', back_populates='parent')

class Student(db.Model):
    __tablename__ = 'students'
    student_id = db.Column(db.String, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10))
    date_of_birth = db.Column(db.Date)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'))
    guardian_contact = db.Column(db.String(15))
    # Relationships
    parents = db.relationship('StudentParentLink', back_populates='student')
    attendance = db.relationship('Attendance', backref='student')
    assessments = db.relationship('Assessment', backref='student')
    participation = db.relationship('Participation', backref='student')
    behaviorals = db.relationship('Behavioral', backref='student')
    guardians = db.relationship('Guardian', backref='student', cascade='all, delete-orphan')
    emergency_contacts = db.relationship('EmergencyContact', backref='student', cascade='all, delete-orphan')

class StudentParentLink(db.Model):
    __tablename__ = 'student_parent_link'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String, db.ForeignKey('students.student_id', ondelete='CASCADE'))
    parent_id = db.Column(db.Integer, db.ForeignKey('parents.parent_id', ondelete='CASCADE'))
    # Relationships
    student = db.relationship('Student', back_populates='parents')
    parent = db.relationship('Parent', back_populates='students')

class Teacher(db.Model):
    __tablename__ = 'teachers'
    teacher_id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100))
    phone = db.Column(db.String(15))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'))
    # Relationships
    classes = db.relationship('Class', backref='teacher')

class Class(db.Model):
    __tablename__ = 'classes'
    class_id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(50), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.teacher_id'))
    # Relationships
    students = db.relationship('Student', backref='class_')
    attendance = db.relationship('Attendance', backref='class_')
    participation = db.relationship('Participation', backref='class_')

class Attendance(db.Model):
    __tablename__ = 'attendance'
    attendance_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String, db.ForeignKey('students.student_id'))
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'))
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(10), nullable=False)

class Assessment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String, db.ForeignKey('students.student_id'))
    subject = db.Column(db.String(100), nullable=False)
    assessment_type = db.Column(db.String(50), nullable=False)
    assessment_name = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Float, nullable=False)
    max_score = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    term = db.Column(db.String(50))
    teacher_id = db.Column(db.String(50))

class Participation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String, db.ForeignKey('students.student_id'))
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'))  # <-- Added for relationship
    date = db.Column(db.Date, nullable=False)
    subject = db.Column(db.String(100))
    activity_type = db.Column(db.String(50))
    description = db.Column(db.Text)
    rating = db.Column(db.Integer)
    teacher_id = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime)

class Behavioral(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String, db.ForeignKey('students.student_id'))
    date = db.Column(db.Date, nullable=False)
    type = db.Column(db.String(20))  # positive/negative
    category = db.Column(db.String(50))
    description = db.Column(db.Text)
    severity = db.Column(db.String(20))
    action_taken = db.Column(db.String(100))
    reported_by = db.Column(db.String(100))
    timestamp = db.Column(db.DateTime)

class TeacherClassSubject(db.Model):
    __tablename__ = 'teacher_class_subject'
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.teacher_id', ondelete='CASCADE'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id', ondelete='CASCADE'), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    # Relationships
    teacher = db.relationship('Teacher', backref='class_subject_assignments')
    class_ = db.relationship('Class', backref='teacher_subject_assignments')

class Guardian(db.Model):
    __tablename__ = 'guardians'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String, db.ForeignKey('students.student_id', ondelete='CASCADE'))
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    relationship = db.Column(db.String(50))
    contact = db.Column(db.String(15))

class EmergencyContact(db.Model):
    __tablename__ = 'emergency_contacts'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String, db.ForeignKey('students.student_id', ondelete='CASCADE'))
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    relationship = db.Column(db.String(50))
    contact = db.Column(db.String(15))
