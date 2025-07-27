from flask import Blueprint, request, jsonify
from models import db, Assessment, Student
from datetime import datetime, date
from flask_cors import cross_origin

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

assessments_bp = Blueprint('assessments', __name__)

@assessments_bp.route('/', methods=['GET'])
@assessments_bp.route('', methods=['GET'])  # Handle both with and without trailing slash
@cross_origin()
def get_assessments():
    assessments = Assessment.query.all()
    return jsonify([
        {
            'id': a.assessment_id,  # Fixed: use assessment_id instead of id
            'student_id': a.student_id,
            'subject': a.subject_name,  # Fixed: use subject_name instead of subject
            'assessment_type': a.assessment_type,
            'assessment_name': a.assessment_name if hasattr(a, 'assessment_name') else a.assessment_type,
            'score': a.score,
            'max_score': a.max_score,
            'date': a.date_taken.isoformat(),  # Fixed: use date_taken instead of date
            'term': a.term,
            'teacher_id': getattr(a, 'teacher_id', 'unknown')  # Safe access in case field doesn't exist
        } for a in assessments
    ])



@assessments_bp.route('/<int:assessment_id>', methods=['GET'])
def get_assessment(assessment_id):
    """Get details for a specific assessment"""
    assessment = Assessment.query.get_or_404(assessment_id)
    
    # Get student info for additional context
    student = Student.query.get(assessment.student_id)
    
    return jsonify({
        'id': assessment.assessment_id,
        'student_id': assessment.student_id,
        'student_name': student.full_name if student else None,
        'subject_name': assessment.subject_name,
        'assessment_type': assessment.assessment_type,
        'score': assessment.score,
        'max_score': assessment.max_score,
        'percentage': round((assessment.score / assessment.max_score) * 100, 2) if assessment.max_score > 0 else 0,
        'date_taken': assessment.date_taken.isoformat() if assessment.date_taken else None,
        'term': assessment.term,
        'academic_year': assessment.academic_year,
        'notes': assessment.notes,
        'created_at': assessment.created_at.isoformat() if assessment.created_at else None,
        'updated_at': assessment.updated_at.isoformat() if assessment.updated_at else None
    })

@assessments_bp.route('/', methods=['POST'])
def add_assessment():
    """Add a new assessment record"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['student_id', 'subject_name', 'assessment_type', 'score', 'max_score', 'date_taken']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Validate student exists
    student = Student.query.get(data['student_id'])
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    # Validate score is not greater than max_score
    if data['score'] > data['max_score']:
        return jsonify({'error': 'Score cannot be greater than max score'}), 400
    
    # Parse date
    try:
        date_taken = datetime.strptime(data['date_taken'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    assessment = Assessment(
        student_id=data['student_id'],
        subject_name=data['subject_name'],
        assessment_type=data['assessment_type'],
        score=data['score'],
        max_score=data['max_score'],
        date_taken=date_taken,
        term=data.get('term'),
        academic_year=data.get('academic_year'),
        notes=data.get('notes'),
        subject_id=data.get('subject_id', 1)  # Default subject_id until subjects table exists
    )
    
    db.session.add(assessment)
    db.session.commit()
    
    return jsonify({
        'message': 'Assessment added successfully',
        'id': assessment.assessment_id,
        'percentage': round((assessment.score / assessment.max_score) * 100, 2)
    }), 201

@assessments_bp.route('/<int:assessment_id>', methods=['PUT'])
def update_assessment(assessment_id):
    """Update an assessment record"""
    assessment = Assessment.query.get_or_404(assessment_id)
    data = request.get_json()
    
    # Validate student exists if student_id is being updated
    if 'student_id' in data:
        student = Student.query.get(data['student_id'])
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        assessment.student_id = data['student_id']
    
    # Validate score vs max_score
    new_score = data.get('score', assessment.score)
    new_max_score = data.get('max_score', assessment.max_score)
    if new_score > new_max_score:
        return jsonify({'error': 'Score cannot be greater than max score'}), 400
    
    # Update fields
    if 'subject_name' in data:
        assessment.subject_name = data['subject_name']
    if 'assessment_type' in data:
        assessment.assessment_type = data['assessment_type']
    if 'score' in data:
        assessment.score = data['score']
    if 'max_score' in data:
        assessment.max_score = data['max_score']
    if 'date_taken' in data:
        try:
            assessment.date_taken = datetime.strptime(data['date_taken'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    if 'term' in data:
        assessment.term = data['term']
    if 'academic_year' in data:
        assessment.academic_year = data['academic_year']
    if 'notes' in data:
        assessment.notes = data['notes']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Assessment updated successfully',
        'id': assessment.assessment_id,
        'percentage': round((assessment.score / assessment.max_score) * 100, 2)
    })

@assessments_bp.route('/<int:assessment_id>', methods=['DELETE'])
def delete_assessment(assessment_id):
    """Delete an assessment record"""
    assessment = Assessment.query.get_or_404(assessment_id)
    
    db.session.delete(assessment)
    db.session.commit()
    
    return jsonify({'message': 'Assessment deleted successfully'}), 200

# Additional useful endpoints for analytics
@assessments_bp.route('/statistics', methods=['GET'])
def get_assessment_statistics():
    """Get assessment statistics"""
    student_id = request.args.get('student_id', type=int)
    subject_name = request.args.get('subject')
    term = request.args.get('term')
    
    query = Assessment.query
    
    if student_id:
        query = query.filter_by(student_id=student_id)
    if subject_name:
        query = query.filter_by(subject_name=subject_name)
    if term:
        query = query.filter_by(term=term)
    
    assessments = query.all()
    
    if not assessments:
        return jsonify({'message': 'No assessments found'})
    
    # Calculate statistics
    scores = [a.score for a in assessments]
    max_scores = [a.max_score for a in assessments]
    percentages = [(a.score / a.max_score) * 100 for a in assessments if a.max_score > 0]
    
    stats = {
        'total_assessments': len(assessments),
        'average_score': round(sum(scores) / len(scores), 2) if scores else 0,
        'average_percentage': round(sum(percentages) / len(percentages), 2) if percentages else 0,
        'highest_score': max(scores) if scores else 0,
        'lowest_score': min(scores) if scores else 0,
        'highest_percentage': round(max(percentages), 2) if percentages else 0,
        'lowest_percentage': round(min(percentages), 2) if percentages else 0
    }
    
    return jsonify(stats)
