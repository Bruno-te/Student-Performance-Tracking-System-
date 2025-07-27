from flask import Blueprint, request, jsonify
<<<<<<< HEAD
from models import db, behavior
from datetime import date

behavior_bp = Blueprint('behavior', __name__)

@behavior_bp.route('/students/<int:student_id>/behavior', methods=['POST'])
def add_behavior(student_id):
    data = request.get_json()
    behavior = Behavior(
        student_id=student_id,
        behavior_type=data.get('behavior_type'),
        category=data.get('category'),
        notes=data.get('notes'),
        date=data.get('date', date.today()),
        teacher_id=data.get('teacher_id')
    )
    db.session.add(behavior)
    db.session.commit()
    return jsonify({'message': 'Behavior record added', 'id': behavior.behavior_id}), 201
=======
from models import db, Behavioral
from datetime import datetime
>>>>>>> d33c2e7582e78e40349d53ad46d984682688e515

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