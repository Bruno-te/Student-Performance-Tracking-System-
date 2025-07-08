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
