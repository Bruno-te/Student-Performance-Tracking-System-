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

# Subject performance
@dashboard_bp.route('/api/dashboard/subject-performance', methods=['GET'])
def subject_performance():
    results = db.session.query(
        Assessment.subject,
        func.avg((Assessment.score / Assessment.max_score) * 100).label('average_score')
    ).group_by(Assessment.subject).all()

    data = [
        {'subject': r.subject, 'average_score': round(r.average_score, 2)}
        for r in results
    ]
    return jsonify({'subjects': data})


# Alerts for underperforming students
@dashboard_bp.route('/api/dashboard/alerts', methods=['GET'])
def alerts():
    failing_students = []
    students = Student.query.all()

    for student in students:
        # Scores
        avg_score = db.session.query(
            func.avg((Assessment.score / Assessment.max_score) * 100)
        ).filter(Assessment.student_id == student.student_id).scalar() or 0

        # Attendance
        total_attendance = db.session.query(func.count(Attendance.attendance_id)).filter_by(student_id=student.student_id).scalar() or 0
        present_attendance = db.session.query(func.count(Attendance.attendance_id)).filter_by(student_id=student.student_id, status='present').scalar() or 0
        attendance_rate = (present_attendance / total_attendance * 100) if total_attendance else 0

        # Behavior misconduct
        misconduct_count = db.session.query(func.count(Behavior.behavior_id)).filter_by(student_id=student.student_id).scalar()

        if avg_score < 50 or attendance_rate < 50 or misconduct_count > 0:
            failing_students.append({
                'student_id': student.student_id,
                'name': student.name,
                'avg_score': round(avg_score, 2),
                'attendance_rate': round(attendance_rate, 2),
                'misconduct_issues': misconduct_count
            })

    return jsonify({'alerts': failing_students})


# Top Students with class info
@dashboard_bp.route('/api/dashboard/top-students', methods=['GET'])
def top_students():
    top = db.session.query(
        Assessment.student_id,
        func.avg((Assessment.score / Assessment.max_score) * 100).label('avg_score')
    ).group_by(Assessment.student_id).order_by(func.avg((Assessment.score / Assessment.max_score) * 100).desc()).limit(5).all()

    data = []
    for t in top:
        student = Student.query.get(t.student_id)
        classes = db.session.query(Class.name).join(Attendance).filter(Attendance.student_id == t.student_id).distinct().all()
        data.append({
            'student_id': student.student_id,
            'name': student.name,
            'avg_score': round(t.avg_score, 2),
            'classes': [c.name for c in classes]
        })

    return jsonify({'top_students': data})


# Recent Activities
@dashboard_bp.route('/api/dashboard/recent-activities', methods=['GET'])
def recent_activities():
    days = int(request.args.get('days', 7))
    cutoff = datetime.now() - timedelta(days=days)

    recent_attendance = db.session.query(Attendance).filter(Attendance.date >= cutoff).limit(10).all()
    recent_assessments = db.session.query(Assessment).filter(Assessment.date >= cutoff).limit(10).all()

    attendance_data = [{
        'type': 'attendance',
        'student_id': a.student_id,
        'class_id': a.class_id,
        'date': a.date.isoformat(),
        'status': a.status
    } for a in recent_attendance]

    assessment_data = [{
        'type': 'assessment',
        'student_id': a.student_id,
        'subject': a.subject,
        'score': a.score,
        'max_score': a.max_score,
        'date': a.date.isoformat()
    } for a in recent_assessments]

    return jsonify({'recent': attendance_data + assessment_data})
