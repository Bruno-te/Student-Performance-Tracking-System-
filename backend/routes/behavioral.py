from flask import Blueprint, request, jsonify
from models import db, Behavioral
from datetime import datetime

behavioral_bp = Blueprint('behavioral', __name__)

@behavioral_bp.route('/', methods=['GET'])
def get_behavioral():
    records = Behavioral.query.all()
    return jsonify([
        {
            'id': b.id,
            'student_id': b.student_id,
            'date': b.date.isoformat(),
            'type': b.type,
            'category': b.category,
            'description': b.description,
            'severity': b.severity,
            'action_taken': b.action_taken,
            'reported_by': b.reported_by,
            'timestamp': b.timestamp.isoformat() if b.timestamp else None
        } for b in records
    ])

@behavioral_bp.route('/', methods=['POST'])
def add_behavioral():
    data = request.get_json()
    record = Behavioral(
        student_id=data['student_id'],
        date=datetime.fromisoformat(data['date']).date(),
        type=data.get('type'),
        category=data.get('category'),
        description=data.get('description'),
        severity=data.get('severity'),
        action_taken=data.get('action_taken'),
        reported_by=data.get('reported_by'),
        timestamp=datetime.fromisoformat(data['timestamp']) if data.get('timestamp') else None
    )
    db.session.add(record)
    db.session.commit()
    return jsonify({'message': 'Behavioral record added', 'id': record.id}), 201 