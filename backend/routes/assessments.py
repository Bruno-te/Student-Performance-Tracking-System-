from flask import Blueprint, request, jsonify
from models import db, Assessment
from datetime import datetime

assessments_bp = Blueprint('assessments', __name__)

@assessments_bp.route('/', methods=['GET'])
def get_assessments():
    assessments = Assessment.query.all()
    return jsonify([
        {
            'id': a.id,
            'student_id': a.student_id,
            'subject': a.subject,
            'assessment_type': a.assessment_type,
            'assessment_name': a.assessment_name,
            'score': a.score,
            'max_score': a.max_score,
            'date': a.date.isoformat(),
            'term': a.term,
            'teacher_id': a.teacher_id
        } for a in assessments
    ])

@assessments_bp.route('/', methods=['POST'])
def add_assessment():
    data = request.get_json()
    assessment = Assessment(
        student_id=data['student_id'],
        subject=data['subject'],
        assessment_type=data['assessment_type'],
        assessment_name=data['assessment_name'],
        score=data['score'],
        max_score=data['max_score'],
        date=datetime.fromisoformat(data['date']).date(),
        term=data.get('term'),
        teacher_id=data.get('teacher_id')
    )
    db.session.add(assessment)
    db.session.commit()
    return jsonify({'message': 'Assessment added', 'id': assessment.id}), 201 