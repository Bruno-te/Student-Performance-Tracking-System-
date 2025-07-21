import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


from flask import Blueprint, request, jsonify
from models import db, Behavior
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


# Get all behavior records for a student
@behavior_bp.route('/students/<int:student_id>/behavior', methods=['GET'])
def get_student_behavior(student_id):
    behaviors = Behavior.query.filter_by(student_id=student_id).all()
    return jsonify([
        {
            'behavior_id': b.behavior_id,
            'behavior_type': b.behavior_type,
            'category': b.category,
            'notes': b.notes,
            'date': b.date.isoformat(),
            'teacher_id': b.teacher_id
        }
        for b in behaviors
    ])


# Update an existing behavior record
@behavior_bp.route('/behavior/<int:behavior_id>', methods=['PUT'])
def update_behavior(behavior_id):
    data = request.get_json()
    behavior = Behavior.query.get_or_404(behavior_id)

    behavior.behavior_type = data.get('behavior_type', behavior.behavior_type)
    behavior.category = data.get('category', behavior.category)
    behavior.notes = data.get('notes', behavior.notes)
    behavior.teacher_id = data.get('teacher_id', behavior.teacher_id)
    behavior.date = data.get('date', behavior.date)

    db.session.commit()
    return jsonify({'message': 'Behavior record updated'})


# Delete a behavior record
@behavior_bp.route('/behavior/<int:behavior_id>', methods=['DELETE'])
def delete_behavior(behavior_id):
    behavior = Behavior.query.get_or_404(behavior_id)
    db.session.delete(behavior)
    db.session.commit()
    return jsonify({'message': 'Behavior record deleted'})


# Generate a behavior summary report for a student
@behavior_bp.route('/students/<int:student_id>/behavior/report', methods=['GET'])
def behavior_report(student_id):
    behaviors = Behavior.query.filter_by(student_id=student_id).all()
    total = len(behaviors)
    positive = sum(1 for b in behaviors if b.behavior_type == 'positive')
    negative = sum(1 for b in behaviors if b.behavior_type == 'negative')
    score = positive - negative
    return jsonify({
        'student_id': student_id,
        'total_entries': total,
        'positive': positive,
        'negative': negative,
        'score': score
    })