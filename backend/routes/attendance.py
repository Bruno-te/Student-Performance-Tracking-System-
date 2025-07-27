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

# PUT /api/attendance/<int:attendance_id>/confirm
@attendance_bp.route('/<int:attendance_id>/confirm', methods=['PUT'])
def confirm_attendance(attendance_id):
    """Confirm a specific attendance record"""
    record = Attendance.query.get(attendance_id)
    if not record:
        return jsonify({'error': 'Attendance record not found'}), 404

    # Check if already confirmed
    if record.status == 'Confirmed':
        return jsonify({'message': f'Attendance ID {attendance_id} is already confirmed'}), 200

    record.status = 'Confirmed'
    db.session.commit()
    return jsonify({
        'message': f'Attendance ID {attendance_id} confirmed successfully',
        'attendance_id': attendance_id,
        'status': 'Confirmed'
    }), 200

# PUT /api/attendance/confirm/batch
@attendance_bp.route('/confirm/batch', methods=['PUT'])
def confirm_attendance_batch():
    """Confirm multiple attendance records at once"""
    data = request.get_json()
    
    if not data or 'attendance_ids' not in data:
        return jsonify({'error': 'Missing attendance_ids in request body'}), 400
    
    attendance_ids = data['attendance_ids']
    if not isinstance(attendance_ids, list):
        return jsonify({'error': 'attendance_ids must be a list'}), 400
    
    confirmed_count = 0
    already_confirmed_count = 0
    not_found_ids = []
    
    for attendance_id in attendance_ids:
        record = Attendance.query.get(attendance_id)
        if not record:
            not_found_ids.append(attendance_id)
            continue
            
        if record.status == 'Confirmed':
            already_confirmed_count += 1
        else:
            record.status = 'Confirmed'
            confirmed_count += 1
    
    db.session.commit()
    
    response = {
        'message': f'Batch confirmation completed',
        'confirmed': confirmed_count,
        'already_confirmed': already_confirmed_count,
        'not_found': len(not_found_ids)
    }
    
    if not_found_ids:
        response['not_found_ids'] = not_found_ids
    
    return jsonify(response), 200

# PUT /api/attendance/confirm/class
@attendance_bp.route('/confirm/class', methods=['PUT'])
def confirm_attendance_by_class():
    """Confirm all attendance records for a specific class and date"""
    data = request.get_json()
    
    required_fields = ['class_id', 'date']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
    
    class_id = data['class_id']
    date = data['date']
    
    # Find all attendance records for this class and date
    records = Attendance.query.filter_by(class_id=class_id, date=date).all()
    
    if not records:
        return jsonify({'error': 'No attendance records found for the specified class and date'}), 404
    
    confirmed_count = 0
    already_confirmed_count = 0
    
    for record in records:
        if record.status == 'Confirmed':
            already_confirmed_count += 1
        else:
            record.status = 'Confirmed'
            confirmed_count += 1
    
    db.session.commit()
    
    return jsonify({
        'message': f'All attendance records for class {class_id} on {date} confirmed',
        'total_records': len(records),
        'confirmed': confirmed_count,
        'already_confirmed': already_confirmed_count
    }), 200
