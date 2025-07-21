from flask import Blueprint, request, jsonify
from models import db, TeacherClassSubject, Teacher, Class

teacher_assignments_bp = Blueprint('teacher_assignments', __name__)

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