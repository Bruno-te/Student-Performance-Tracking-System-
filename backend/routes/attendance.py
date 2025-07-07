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
