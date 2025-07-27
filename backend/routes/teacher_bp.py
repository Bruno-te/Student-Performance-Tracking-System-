from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Teacher, Class, Student
from werkzeug.security import check_password_hash

teacher_bp = Blueprint('teacher', __name__)

# ---------- LOGIN ----------

@teacher_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password, data['password']):
        # Get the linked teacher profile
        teacher = Teacher.query.filter_by(user_id=user.user_id).first()
        if not teacher:
            return jsonify({'error': 'No teacher profile linked to this user'}), 404
        
        access_token = create_access_token(identity=teacher.teacher_id)
        return jsonify(access_token=access_token), 200

    return jsonify({'error': 'Invalid credentials'}), 401

# ---------- DASHBOARD ----------

@teacher_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    teacher_id = get_jwt_identity()
    teacher = Teacher.query.get(teacher_id)

    if not teacher:
        return jsonify({'error': 'Teacher not found'}), 404

    class_data = []
    for c in teacher.classes:
        students = Student.query.filter_by(class_id=c.class_id).all()
        class_data.append({
            'class_id': c.class_id,
            'class_name': c.class_name,
            'students': [{
                'student_id': s.student_id,
                'full_name': s.full_name,
                'gender': s.gender,
                'dob': s.date_of_birth.isoformat() if s.date_of_birth else None
            } for s in students]
        })

    return jsonify({
        'teacher': {
            'teacher_id': teacher.teacher_id,
            'full_name': teacher.full_name,
            'email': teacher.email,
            'phone': teacher.phone
        },
        'classes': class_data
    })
