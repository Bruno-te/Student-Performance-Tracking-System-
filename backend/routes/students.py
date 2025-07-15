import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, Blueprint, request, jsonify
from models import db, Student, Class
import datetime
import uuid

students_bp = Blueprint('students', __name__)

@students_bp.route('/', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([{
        'id': s.student_id,
        'name': s.full_name,
        'class_id': s.class_id
    } for s in students])

@students_bp.route('/', methods=['POST', 'OPTIONS'])
@students_bp.route('', methods=['POST', 'OPTIONS'])
def add_student():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    class_id = data.get('class_id')
    # Ensure the class exists
    class_obj = Class.query.get(class_id)
    if not class_obj:
        class_obj = Class(class_id=class_id, class_name=f'P{class_id}')
        db.session.add(class_obj)
        db.session.commit()
    student = Student(
        student_id=str(uuid.uuid4()),
        full_name=data['full_name'],
        gender=data.get('gender'),
        date_of_birth=data.get('date_of_birth'),
        class_id=class_id,
        guardian_contact=data.get('guardian_contact')
    )
    db.session.add(student)
    db.session.commit()
    return jsonify({'message': 'Student added', 'id': student.student_id}), 201

@students_bp.route('/<student_id>', methods=['GET'])
def get_student(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'message': 'Student not found'}), 404
    return jsonify({
        'id': student.student_id,
        'name': student.full_name,
        'gender': student.gender,
        'date_of_birth': student.date_of_birth.isoformat() if student.date_of_birth else None,
        'class_id': student.class_id,
        'guardian_contact': student.guardian_contact
    })

@students_bp.route('/<student_id>', methods=['PUT'])
def update_student(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'message': 'Student not found'}), 404
    data = request.get_json()
    student.full_name = data.get('full_name', student.full_name)
    student.gender = data.get('gender', student.gender)
    dob = data.get('date_of_birth')
    if dob:
        try:
            student.date_of_birth = datetime.datetime.strptime(dob, '%Y-%m-%d').date()
        except Exception:
            pass
    student.class_id = data.get('class_id', student.class_id)
    student.guardian_contact = data.get('guardian_contact', student.guardian_contact)
    db.session.commit()
    return jsonify({'message': 'Student updated'})

@students_bp.route('/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'message': 'Student not found'}), 404
    db.session.delete(student)
    db.session.commit()
    return jsonify({'message': 'Student deleted'})

#  Local test when running this file directly
if __name__ == '__main__':
    app = Flask(__name__)
    from config import Config
    app.config.from_object(Config)
    db.init_app(app)

    with app.app_context():
        db.create_all()
        print("Inserting test student...")

        test_student = Student(
            full_name="Taylor West",
            gender="F",
            date_of_birth=datetime.date(2006, 8, 15),
            class_id=1,
            guardian_contact="0786715414"
        )
        db.session.add(test_student)
        db.session.commit()
        print(f"Inserted student with ID: {test_student.student_id}")

        # Show inserted student(s)
        students = Student.query.all()
        for s in students:
            print({
                'id': s.student_id,
                'name': s.full_name,
                'gender': s.gender,
                'dob': s.date_of_birth,
                'class_id': s.class_id,
                'guardian_contact': s.guardian_contact
            })
