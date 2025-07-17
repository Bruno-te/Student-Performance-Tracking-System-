from flask import Blueprint, jsonify
from models import db, Student, Assessment, Attendance
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard/summary', methods=['GET'])
def dashboard_summary():
    # Total students
    total_students = db.session.query(func.count(Student.student_id)).scalar()

    # Average assessment score (as percentage)
    avg_score = db.session.query(
        func.avg((Assessment.score / Assessment.max_score) * 100)
    ).scalar() or 0

    # Attendance rate (present/total)
    total_attendance = db.session.query(func.count(Attendance.attendance_id)).scalar() or 0
    present_attendance = db.session.query(func.count(Attendance.attendance_id)).filter(Attendance.status == 'present').scalar() or 0
    attendance_rate = (present_attendance / total_attendance * 100) if total_attendance else 0

    # High performers (students with avg score >= 80%)
    high_performers = db.session.query(Assessment.student_id).group_by(Assessment.student_id).having(
        func.avg((Assessment.score / Assessment.max_score) * 100) >= 80
    ).count()

    return jsonify({
        'total_students': total_students,
        'average_score': round(avg_score, 2),
        'attendance_rate': round(attendance_rate, 2),
        'high_performers': high_performers
    })

@dashboard_bp.route('/api/students/<int:student_id>/performance', methods=['GET'])
def student_performance(student_id):
    # Average score for this student
    avg_score = db.session.query(
        func.avg((Assessment.score / Assessment.max_score) * 100)
    ).filter(Assessment.student_id == student_id).scalar() or 0

    # Attendance rate for this student
    total_attendance = db.session.query(func.count(Attendance.attendance_id)).filter(Attendance.student_id == student_id).scalar() or 0
    present_attendance = db.session.query(func.count(Attendance.attendance_id)).filter(Attendance.student_id == student_id, Attendance.status == 'present').scalar() or 0
    attendance_rate = (present_attendance / total_attendance * 100) if total_attendance else 0

    # High performer?
    is_high_performer = avg_score >= 80

    return jsonify({
        'student_id': student_id,
        'average_score': round(avg_score, 2),
        'attendance_rate': round(attendance_rate, 2),
        'is_high_performer': is_high_performer
    }) 