import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, Blueprint, request, jsonify
from models import db, Student
import datetime

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
