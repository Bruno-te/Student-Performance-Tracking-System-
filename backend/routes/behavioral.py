from flask import Blueprint, request, jsonify
from models import db, Behavioral
from datetime import datetime

behavioral_bp = Blueprint('behavioral', __name__)

@behavioral_bp.route('/', methods=['GET'])
def get_behavioral():
    records = Behavioral.query.all()
    return jsonify([
        {
            'behavior_id': b.behavior_id,
            'student_id': b.student_id,
            'date': b.date.isoformat(),
            'behavior_type': b.behavior_type,
            'category': b.category,
            'notes': b.notes,
            'teacher_id': b.teacher_id,
            'created_at': b.created_at.isoformat() if b.created_at else None,
            'updated_at': b.updated_at.isoformat() if b.updated_at else None
        } for b in records
    ])

@behavioral_bp.route('/', methods=['POST'])
def add_behavioral():
    data = request.get_json()
    record = Behavioral(
        student_id=data['student_id'],
        date=datetime.fromisoformat(data['date']).date() if data.get('date') else datetime.now().date(),
        behavior_type=data.get('behavior_type', 'positive'),
        category=data.get('category', ''),
        notes=data.get('notes', ''),
        teacher_id=data.get('teacher_id')
    )
    db.session.add(record)
    db.session.commit()
    return jsonify({'message': 'Behavioral record added', 'behavior_id': record.behavior_id}), 201