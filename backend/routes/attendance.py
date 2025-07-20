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
dev
    return jsonify({'message': 'Attendance logged'}), 201

@attendance_bp.route('/', methods=['GET'])
def get_attendance():
    from datetime import datetime
    date_str = request.args.get('date')
    query = Attendance.query
    if date_str:
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
            query = query.filter_by(date=date_obj)
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400
    attendance_records = query.all()
    result = []
    for record in attendance_records:
        result.append({
            'attendance_id': record.attendance_id,
            'student_id': record.student_id,
            'class_id': record.class_id,
            'date': record.date.isoformat(),
            'status': record.status
        })
    return jsonify(result), 200

    return jsonify({'message': 'Attendance logged', 'id': attendance.id}), 201

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
            'id': r.id,
            'student_id': r.student_id,
            'class_id': r.class_id,
            'date': r.date,
            'status': r.status
        } for r in records
    ])

# Get a specific record
@attendance_bp.route('/<int:id>', methods=['GET'])
def get_attendance(id):
    record = Attendance.query.get(id)
    if not record:
        return jsonify({'error': 'Record not found'}), 404
    return jsonify({
        'id': record.id,
        'student_id': record.student_id,
        'class_id': record.class_id,
        'date': record.date,
        'status': record.status
    })

# Update an attendance record
@attendance_bp.route('/<int:id>', methods=['PUT'])
def update_attendance(id):
    record = Attendance.query.get(id)
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
@attendance_bp.route('/<int:id>', methods=['DELETE'])
def delete_attendance(id):
    record = Attendance.query.get(id)
    if not record:
        return jsonify({'error': 'Record not found'}), 404

    db.session.delete(record)
    db.session.commit()
    return jsonify({'message': 'Attendance record deleted'})
main
