from flask import Blueprint, request, jsonify
from models import db, Parent, Student, Attendance, Assessment, Behavior
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token

parents_bp = Blueprint('parents', __name__)

@parents_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    parent = Parent.query.filter_by(email=data['email']).first()
    if parent and check_password_hash(parent.password, data['password']):
        access_token = create_access_token(identity=parent.parent_id)
        return jsonify(access_token=access_token)
    return jsonify({'error': 'Invalid credentials'}), 401

@parents_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    parent_id = get_jwt_identity()
    parent = Parent.query.get(parent_id)
    student = parent.student

    attendance = Attendance.query.filter_by(student_id=student.student_id).all()
    assessments = Assessment.query.filter_by(student_id=student.student_id).all()
    behaviors = Behavior.query.filter_by(student_id=student.student_id).all()

    return jsonify({
        'student': {
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
