from flask import Blueprint, request, jsonify
from models import db, Participation
from datetime import datetime

participation_bp = Blueprint('participation', __name__)

@participation_bp.route('/date/<date>', methods=['GET'], strict_slashes=False)
def get_participation_by_date(date):
    logs = Participation.query.filter_by(date=datetime.fromisoformat(date).date()).all()
    return jsonify([
        {
            'id': p.id,
            'student_id': p.student_id,
            'date': p.date.isoformat(),
            'subject': p.subject,
            'activity_type': p.activity_type,
            'description': p.description,
            'rating': p.rating,
            'teacher_id': p.teacher_id,
            'timestamp': p.timestamp.isoformat() if p.timestamp else None
        } for p in logs
    ])

@participation_bp.route('/', methods=['GET'], strict_slashes=False)
def get_all_participation():
    logs = Participation.query.all()
    return jsonify([
        {
            'id': p.id,
            'student_id': p.student_id,
            'date': p.date.isoformat(),
            'subject': p.subject,
            'activity_type': p.activity_type,
            'description': p.description,
            'rating': p.rating,
            'teacher_id': p.teacher_id,
            'timestamp': p.timestamp.isoformat() if p.timestamp else None
        } for p in logs
    ])

@participation_bp.route('/', methods=['POST'], strict_slashes=False)
def add_participation():
    data = request.get_json()
    log = Participation(
        student_id=data['student_id'],
        date=datetime.fromisoformat(data['date']).date(),
        subject=data.get('subject'),
        activity_type=data.get('activity_type'),
        description=data.get('description'),
        rating=data.get('rating'),
        teacher_id=data.get('teacher_id'),
        timestamp=datetime.fromisoformat(data['timestamp']) if data.get('timestamp') else None
    )
    db.session.add(log)
    db.session.commit()
    return jsonify({'message': 'Participation log added', 'id': log.id}), 201 