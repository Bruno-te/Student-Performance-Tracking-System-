from flask import Blueprint, request, jsonify
from models import db, Teacher, Student, Attendance, Assessment, Behavior
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

teacher_bp = Blueprint('teacher', __name__)

@teacher_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    teacher = Teacher.query.filter_by(email=data['email']).first()
    if teacher and check_password_hash(teacher.password, data['password']):
        access_token = create_access_token(identity=teacher.teacher_id)
        return jsonify(access_token=access_token)
    return jsonify({'error': 'Invalid credentials'}), 401

@teacher_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    teacher_id = get_jwt_identity()
    teacher = Teacher.query.get(teacher_id)

    students_data = []
    for student in teacher.students:
        attendance = Attendance.query.filter_by(student_id=student.student_id).all()
        assessments = Assessment.query.filter_by(student_id=student.student_id).all()
        behaviors = Behavior.query.filter_by(student_id=student.student_id).all()

        students_data.append({
            'student': {
                'id': student.student_id,
                'name': student.full_name,
                'class_id': student.class_id
            },
            'attendance': [{'date': a.date.isoformat(), 'status': a.status} for a in attendance],
            'assessments': [{
                'subject': a.subject_name,
                'score': a.score,
                'max_score': a.max_score,
                'type': a.assessment_type,
                'date': a.date_taken.isoformat()
            } for a in assessments],
            'behaviors': [{
                'type': b.behavior_type,
                'severity': b.severity,
                'notes': b.notes,
                'date': b.date.isoformat()
            } for b in behaviors]
        })

    return jsonify({
        'teacher': {
            'name': teacher.full_name,
            'subject': teacher.subject_name
        },
        'students': students_data
    })
