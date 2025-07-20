from flask import Blueprint, request, jsonify
from models import db, Participation
from datetime import datetime

participation_bp = Blueprint('participation', __name__)

dev
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

# POST /api/participation
@participation_bp.route('/', methods=['POST'])
def add_participation():
    data = request.get_json()
    try:
        participation = Participation(
            student_id=data['student_id'],
            event_name=data['event_name'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            status=data['status'],
            remarks=data.get('remarks', '')
        )
        db.session.add(participation)
        db.session.commit()
        return jsonify({'message': 'Participation added successfully'}), 201
    except KeyError as e:
        return jsonify({'error': f'Missing field: {str(e)}'}), 400

# GET /api/participation
@participation_bp.route('/', methods=['GET'])
def get_all_participation():
    records = Participation.query.all()
    return jsonify([
        {
            "participation_id": p.participation_id,
            "student_id": p.student_id,
            "event_name": p.event_name,
            "date": p.date.isoformat(),
            "status": p.status,
            "remarks": p.remarks
        } for p in records
    ]), 200

# GET /api/participation/:id
@participation_bp.route('/<int:pid>', methods=['GET'])
def get_participation_by_id(pid):
    p = Participation.query.get(pid)
    if not p:
        return jsonify({'error': 'Participation not found'}), 404
    return jsonify({
        "participation_id": p.participation_id,
        "student_id": p.student_id,
        "event_name": p.event_name,
        "date": p.date.isoformat(),
        "status": p.status,
        "remarks": p.remarks
    }), 200

# PUT /api/participation/:id
@participation_bp.route('/<int:pid>', methods=['PUT'])
def update_participation(pid):
    data = request.get_json()
    participation = Participation.query.get(pid)
    if not participation:
        return jsonify({'error': 'Participation not found'}), 404

    if 'status' in data:
        participation.status = data['status']
    if 'remarks' in data:
        participation.remarks = data['remarks']
    if 'event_name' in data:
        participation.event_name = data['event_name']
    if 'date' in data:
        participation.date = datetime.strptime(data['date'], '%Y-%m-%d').date()

    db.session.commit()
    return jsonify({'message': 'Participation updated successfully'}), 200

# DELETE /api/participation/:id
@participation_bp.route('/<int:pid>', methods=['DELETE'])
def delete_participation(pid):
    participation = Participation.query.get(pid)
    if not participation:
        return jsonify({'error': 'Participation not found'}), 404

    db.session.delete(participation)
    db.session.commit()
    return jsonify({'message': 'Participation deleted successfully'}), 200

 main
