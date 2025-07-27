from flask import Blueprint, request, jsonify
from models import db, Attendance

attendance_bp = Blueprint('attendance', __name__)

# Log new attendance
@attendance_bp.route('/', methods=['POST'])
def log_attendance():
    data = request.get_json()
    required_fields = ['student_id', 'class_id', 'date', 'status']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400

    attendance = Attendance(
        student_id=data['student_id'],
        class_id=data['class_id'],
        date=data['date'],
        status=data['status']
    )
    db.session.add(attendance)
    db.session.commit()
    return jsonify({'message': 'Attendance logged'}), 201

# List all attendance records
@attendance_bp.route('/', methods=['GET'])
def get_all_attendance():
    student_id = request.args.get('student_id')
    class_id = request.args.get('class_id')
    date = request.args.get('date')

    query = Attendance.query
    if student_id:
        query = query.filter_by(student_id=student_id)
    if class_id:
        query = query.filter_by(class_id=class_id)
    if date:
        query = query.filter_by(date=date)

    records = query.all()
    return jsonify([
        {
            'attendance_id': r.attendance_id,
            'student_id': r.student_id,
            'class_id': r.class_id,
            'date': r.date,
            'status': r.status
        } for r in records
    ])

# Get a specific record
@attendance_bp.route('/<int:attendance_id>', methods=['GET'])
def get_attendance_by_id(attendance_id):
    record = Attendance.query.get(attendance_id)
    if not record:
        return jsonify({'error': 'Record not found'}), 404
    return jsonify({
        'attendance_id': record.attendance_id,
        'student_id': record.student_id,
        'class_id': record.class_id,
        'date': record.date,
        'status': record.status
    })

# Update an attendance record
@attendance_bp.route('/<int:attendance_id>', methods=['PUT'])
def update_attendance(attendance_id):
    record = Attendance.query.get(attendance_id)
    if not record:
        return jsonify({'error': 'Record not found'}), 404

    data = request.get_json()
    record.student_id = data.get('student_id', record.student_id)
    record.class_id = data.get('class_id', record.class_id)
    record.date = data.get('date', record.date)
    record.status = data.get('status', record.status)

    db.session.commit()
    return jsonify({'message': 'Attendance updated'})

#  Delete a record
@attendance_bp.route('/<int:attendance_id>', methods=['DELETE'])
def delete_attendance(attendance_id):
    record = Attendance.query.get(attendance_id)
    if not record:
        return jsonify({'error': 'Record not found'}), 404

    db.session.delete(record)
    db.session.commit()
    return jsonify({'message': 'Attendance record deleted'})

# Batch log attendance
@attendance_bp.route('/batch', methods=['POST'])
def log_attendance_batch():
    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({'error': 'Expected a list of attendance records'}), 400
    created = 0
    for record in data:
        required_fields = ['student_id', 'class_id', 'date', 'status']
        if not all(field in record for field in required_fields):
            continue  # skip invalid records
        attendance = Attendance(
            student_id=record['student_id'],
            class_id=record['class_id'],
            date=record['date'],
            status=record['status']
        )
        db.session.add(attendance)
        created += 1
    db.session.commit()
    return jsonify({'message': f'Batch attendance logged: {created} records'}), 201
