import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, Blueprint, request, jsonify
from models import db, Student, Class, Guardian, EmergencyContact
import datetime
import uuid
from flask_cors import CORS, cross_origin

students_bp = Blueprint('students', __name__)
CORS(students_bp)

@students_bp.route('/', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_students():
    if request.method == 'OPTIONS':
        return '', 200
    students = Student.query.all()
    return jsonify([
        {
            'id': s.student_id,
            'name': s.full_name,
            'class_id': s.class_id,
            'guardians': [
                {
                    'firstName': g.first_name,
                    'lastName': g.last_name,
                    'relationship': g.relationship,
                    'contact': g.contact
                } for g in s.guardians
            ],
            'emergencyContacts': [
                {
                    'firstName': e.first_name,
                    'lastName': e.last_name,
                    'relationship': e.relationship,
                    'contact': e.contact
                } for e in s.emergency_contacts
            ]
        } for s in students
    ])

@students_bp.route('/', methods=['POST', 'OPTIONS'])
@students_bp.route('', methods=['POST', 'OPTIONS'])
@cross_origin()
def add_student():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    class_id = data.get('class_id')
    if not class_id:
        return jsonify({'message': 'class_id is required'}), 400
    # Ensure the class exists
    class_obj = Class.query.get(class_id)
    if not class_obj:
        class_obj = Class(class_id=class_id, class_name=f'P{class_id}')
        db.session.add(class_obj)
        db.session.commit()
    # Generate student_id in format RW-000
    last_student = Student.query.order_by(Student.student_id.desc()).first()
    if last_student and str(last_student.student_id).startswith('RW-'):
        try:
            last_num = int(str(last_student.student_id).split('-')[1])
        except Exception:
            last_num = 0
    else:
        last_num = 0
    new_num = last_num + 1
    new_student_id = f"RW-{new_num:03d}"
    # Parse date of birth properly
    dob = None
    if data.get('dateOfBirth'):
        try:
            dob = datetime.datetime.strptime(data['dateOfBirth'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'message': 'Invalid date format for date of birth. Use YYYY-MM-DD'}), 400
    
    student = Student(
        student_id=new_student_id,
        full_name=data['full_name'],
        gender=data.get('gender'),
        date_of_birth=dob,
        enrollment_date=datetime.date.today(),  # Automatically set enrollment date
        class_id=class_id
    )
    db.session.add(student)
    db.session.flush()  # Get student_id for relationships
    # Save guardians
    for g in data.get('guardians', []):
        guardian = Guardian(
            student_id=student.student_id,
            first_name=g.get('firstName'),
            last_name=g.get('lastName'),
            relationship=g.get('relationship'),
            contact=g.get('contact')
        )
        db.session.add(guardian)
    # Save emergency contacts
    for e in data.get('emergencyContacts', []):
        emergency = EmergencyContact(
            student_id=student.student_id,
            first_name=e.get('firstName'),
            last_name=e.get('lastName'),
            relationship=e.get('relationship'),
            contact=e.get('contact')
        )
        db.session.add(emergency)
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
        'enrollment_date': student.enrollment_date.isoformat() if student.enrollment_date else None,
        'class_id': student.class_id,
        'guardians': [
            {
                'firstName': g.first_name,
                'lastName': g.last_name,
                'relationship': g.relationship,
                'contact': g.contact
            } for g in student.guardians
        ],
        'emergencyContacts': [
            {
                'firstName': e.first_name,
                'lastName': e.last_name,
                'relationship': e.relationship,
                'contact': e.contact
            } for e in student.emergency_contacts
        ]
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

@students_bp.route('/classes', methods=['GET'])
def get_classes():
    classes = Class.query.all()
    return jsonify([
        {
            'class_id': c.class_id,
            'class_name': c.class_name
        } for c in classes
    ])

#  Local test when running this file directly
if __name__ == '__main__':
    app = Flask(__name__)
    from config import Config
    app.config.from_object(Config)
    db.init_app(app)

    with app.app_context():
        db.create_all()
        # Pre-populate classes
        class_names = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']
        for idx, name in enumerate(class_names, start=1):
            if not Class.query.filter_by(class_id=idx).first():
                db.session.add(Class(class_id=idx, class_name=name))
        db.session.commit()
        print('Classes pre-populated.')

        print("Inserting test student...")

        test_student = Student(
            student_id=str(uuid.uuid4()),
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
