from flask import Blueprint, request, jsonify
from backend.models import db, Student

students_bp = Blueprint('students', __name__)

@students_bp.route('/', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([{
        'id': s.student_id,
        'name': s.full_name,
        'class_id': s.class_id
    } for s in students])

@students_bp.route('/', methods=['POST'])
def add_student():
    data = request.get_json()
    student = Student(
        full_name=data['full_name'],
        gender=data.get('gender'),
        date_of_birth=data.get('date_of_birth'),
        class_id=data.get('class_id'),
        guardian_contact=data.get('guardian_contact')
    )
    db.session.add(student)
    db.session.commit()
    return jsonify({'message': 'Student added', 'id': student.student_id}), 201
