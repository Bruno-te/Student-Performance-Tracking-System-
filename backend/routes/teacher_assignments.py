from flask import Blueprint, request, jsonify
from models import db, TeacherClassSubject, Teacher, Class, User
import bcrypt

teacher_assignments_bp = Blueprint('teacher_assignments', __name__)
auth_bp = Blueprint('auth', __name__)

# Placeholder for admin authentication/authorization
def admin_required(f):
    def wrapper(*args, **kwargs):
        # TODO: Implement admin check
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

@teacher_assignments_bp.route('/', methods=['POST'])
@admin_required
def assign_teacher():
    data = request.get_json()
    teacher_id = data.get('teacher_id')
    class_id = data.get('class_id')
    subject = data.get('subject')
    if not all([teacher_id, class_id, subject]):
        return jsonify({'message': 'Missing required fields'}), 400
    assignment = TeacherClassSubject(teacher_id=teacher_id, class_id=class_id, subject=subject)
    db.session.add(assignment)
    db.session.commit()
    return jsonify({'message': 'Assignment created', 'id': assignment.id}), 201

@teacher_assignments_bp.route('/', methods=['GET'])
@admin_required
def list_assignments():
    assignments = TeacherClassSubject.query.all()
    result = []
    for a in assignments:
        result.append({
            'id': a.id,
            'teacher_id': a.teacher_id,
            'teacher_name': a.teacher.full_name if a.teacher else None,
            'class_id': a.class_id,
            'class_name': a.class_.class_name if a.class_ else None,
            'subject': a.subject
        })
    return jsonify(result)

@teacher_assignments_bp.route('/<int:assignment_id>', methods=['DELETE'])
@admin_required
def delete_assignment(assignment_id):
    assignment = TeacherClassSubject.query.get(assignment_id)
    if not assignment:
        return jsonify({'message': 'Assignment not found'}), 404
    db.session.delete(assignment)
    db.session.commit()
    return jsonify({'message': 'Assignment deleted'})

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'Invalid username or password'}), 401
    if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({'message': 'Invalid username or password'}), 401
    # You can add token generation here if needed
    return jsonify({'message': 'Login successful', 'user_id': user.user_id, 'role': user.role}), 200 