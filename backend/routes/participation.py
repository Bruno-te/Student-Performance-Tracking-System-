from flask import Blueprint, request, jsonify
from models import db, Participation
from datetime import datetime

participation_bp = Blueprint('participation', __name__)

@participation_bp.route('/date/<date>', methods=['GET'], strict_slashes=False)
def get_participation_by_date(date):
    logs = Participation.query.filter_by(date=datetime.fromisoformat(date).date()).all()
    return jsonify([
        {
            'participation_id': p.participation_id,
            'student_id': p.student_id,
            'class_id': p.class_id,
            'event_name': p.event_name,
            'date': p.date.isoformat(),
            'status': p.status,
            'remarks': p.remarks
        } for p in logs
    ])

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

# GET /api/participation/average-rating
@participation_bp.route('/average-rating', methods=['GET'])
def average_participation_rating():
    rating_map = {
        "Excellent": 5,
        "Good": 4,
        "Average": 3,
        "Poor": 2,
        "None": 1
    }

    records = Participation.query.all()
    if not records:
        return jsonify({'average_rating': 0, 'message': 'No participation records found'}), 200

    ratings = []
    for p in records:
        status = p.status.strip().capitalize()
        score = rating_map.get(status)
        if score:
            ratings.append(score)

    if not ratings:
        return jsonify({'average_rating': 0, 'message': 'No valid ratings found'}), 200

    avg_rating = round(sum(ratings) / len(ratings), 2)
    return jsonify({'average_rating': avg_rating}), 200
