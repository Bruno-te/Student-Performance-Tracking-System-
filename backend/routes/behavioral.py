from flask import Blueprint, request, jsonify
from models import db, Behavioral
from datetime import datetime, date
from sqlalchemy import and_, or_


behavioral_bp = Blueprint('behavioral', __name__)

@behavioral_bp.route('/', methods=['GET'])
def get_behavioral():
# Get query parameters for filtering
    student_id = request.args.get('student_id')
    behavior_type = request.args.get('behavior_type')
    category = request.args.get('category')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    teacher_id = request.args.get('teacher_id')
    
    # Build query with filters
    query = Behavioral.query
    
    if student_id:
        query = query.filter(Behavioral.student_id == student_id)
    
    if behavior_type:
        query = query.filter(Behavioral.behavior_type == behavior_type)
    
    if category:
        query = query.filter(Behavioral.category.ilike(f'%{category}%'))
    
    if teacher_id:
        query = query.filter(Behavioral.teacher_id == teacher_id)
    
    if start_date:
        try:
            start_date_obj = datetime.fromisoformat(start_date).date()
            query = query.filter(Behavioral.date >= start_date_obj)
        except ValueError:
            return jsonify({'error': 'Invalid start_date format. Use YYYY-MM-DD'}), 400
    
    if end_date:
        try:
            end_date_obj = datetime.fromisoformat(end_date).date()
            query = query.filter(Behavioral.date <= end_date_obj)
        except ValueError:
            return jsonify({'error': 'Invalid end_date format. Use YYYY-MM-DD'}), 400
    
    # Order by date descending (most recent first)
    records = query.order_by(Behavioral.date.desc()).all()
    return jsonify([
        {
            'behavior_id': b.behavior_id,
        } for b in records
    ]) 

@behavioral_bp.route('/student/<student_id>', methods=['GET'])
def get_behavioral_by_student(student_id):
    """Get all behavioral records for a specific student"""
    behavior_type = request.args.get('behavior_type')
    limit = request.args.get('limit', type=int)
    
    query = Behavioral.query.filter(Behavioral.student_id == student_id)
    
    if behavior_type:
        query = query.filter(Behavioral.behavior_type == behavior_type)
    
    query = query.order_by(Behavioral.date.desc())
    
    if limit:
        query = query.limit(limit)
    
    records = query.all()
    
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
        
        # Validate required fields
    if not data.get('student_id'):
            return jsonify({'error': 'student_id is required'}), 400
        
    if not data.get('category'):
            return jsonify({'error': 'category is required'}), 400
        
    record = Behavioral(
            student_id=data['student_id'],
            date=datetime.fromisoformat(data['date']).date() if data.get('date') else date.today(),
            behavior_type=data.get('behavior_type', 'positive'),
            category=data.get('category', ''),
            notes=data.get('notes', ''),
            teacher_id=data.get('teacher_id')
        )
        
    db.session.add(record)
    db.session.commit()
    return jsonify({
            'message': 'Behavioral record added successfully',
            'behavior_id': record.behavior_id,
            'student_id': record.student_id,
            'date': record.date.isoformat(),
            'behavior_type': record.behavior_type,
            'category': record.category
        }), 201
@behavioral_bp.route('/<int:behavior_id>', methods=['PUT'])
def update_behavioral(behavior_id):
    """Update an existing behavioral record"""
    try:
        record = Behavioral.query.get_or_404(behavior_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'behavior_type' in data:
            record.behavior_type = data['behavior_type']
        if 'category' in data:
            record.category = data['category']
        if 'notes' in data:
            record.notes = data['notes']
        if 'teacher_id' in data:
            record.teacher_id = data['teacher_id']
        if 'date' in data:
            record.date = datetime.fromisoformat(data['date']).date()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Behavioral record updated successfully',
            'behavior_id': record.behavior_id
        })
        
    except ValueError as e:
        return jsonify({'error': f'Invalid date format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update behavioral record: {str(e)}'}), 500
    
@behavioral_bp.route('/<int:behavior_id>', methods=['DELETE'])
def delete_behavioral(behavior_id):
    """Delete a behavioral record"""
    try:
        record = Behavioral.query.get_or_404(behavior_id)
        db.session.delete(record)
        db.session.commit()
        
        return jsonify({'message': 'Behavioral record deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete behavioral record: {str(e)}'}), 500    
