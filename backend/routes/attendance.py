from flask import Blueprint, request, jsonify
from models import db, Attendance

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/', methods=['POST'])
def log_attendance():
    data = request.get_json()
    attendance = Attendance(
        student_id=data['student_id'],
        class_id=data['class_id'],
        date=data['date'],
        status=data['status']
    )
    db.session.add(attendance)
    db.session.commit()
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
