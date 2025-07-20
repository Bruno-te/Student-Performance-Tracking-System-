import json
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from models import db, Student, Assessment
from datetime import date

def test_add_assessment():
    """Test adding a new assessment"""
    client = app.test_client()
    
    # First, ensure we have a student to test with
    with app.app_context():
        # Create a test student if not exists
        test_student = Student(
            full_name="Test Student",
            gender="M",
            date_of_birth=date(2005, 1, 1),
            class_id=1,
            guardian_contact="0788123456"
        )
        db.session.add(test_student)
        db.session.commit()
        student_id = test_student.student_id
    
    # Test adding assessment
    response = client.post('/api/assessments/', json={
        "student_id": student_id,
        "subject_name": "Mathematics",
        "assessment_type": "quiz",
        "score": 85,
        "max_score": 100,
        "date_taken": "2024-01-15",
        "term": "Term 1",
        "academic_year": "2024-2025",
        "notes": "Good performance"
    })
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert "Assessment added successfully" in data["message"]
    assert data["percentage"] == 85.0

def test_get_assessments():
    """Test getting all assessments"""
    client = app.test_client()
    response = client.get('/api/assessments/')
    assert response.status_code == 200

def test_get_assessment_by_id():
    """Test getting a specific assessment"""
    client = app.test_client()
    
    # First add an assessment
    with app.app_context():
        student = Student.query.first()
        if not student:
            student = Student(
                full_name="Test Student 2",
                gender="F",
                date_of_birth=date(2005, 2, 1),
                class_id=1,
                guardian_contact="0788123457"
            )
            db.session.add(student)
            db.session.commit()
        
        assessment = Assessment(
            student_id=student.student_id,
            subject_name="Science",
            assessment_type="test",
            score=92,
            max_score=100,
            date_taken=date(2024, 1, 20),
            term="Term 1",
            academic_year="2024-2025",
            subject_id=1
        )
        db.session.add(assessment)
        db.session.commit()
        assessment_id = assessment.assessment_id
    
    # Test getting the specific assessment
    response = client.get(f'/api/assessments/{assessment_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['subject_name'] == "Science"
    assert data['percentage'] == 92.0

def test_update_assessment():
    """Test updating an assessment"""
    client = app.test_client()
    
    # First create an assessment
    with app.app_context():
        student = Student.query.first()
        assessment = Assessment(
            student_id=student.student_id,
            subject_name="English",
            assessment_type="assignment",
            score=75,
            max_score=100,
            date_taken=date(2024, 1, 25),
            term="Term 1",
            academic_year="2024-2025",
            subject_id=1
        )
        db.session.add(assessment)
        db.session.commit()
        assessment_id = assessment.assessment_id
    
    # Update the assessment
    response = client.put(f'/api/assessments/{assessment_id}', json={
        "score": 80,
        "notes": "Improved performance"
    })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "Assessment updated successfully" in data["message"]
    assert data["percentage"] == 80.0

def test_delete_assessment():
    """Test deleting an assessment"""
    client = app.test_client()
    
    # First create an assessment
    with app.app_context():
        student = Student.query.first()
        assessment = Assessment(
            student_id=student.student_id,
            subject_name="History",
            assessment_type="exam",
            score=90,
            max_score=100,
            date_taken=date(2024, 1, 30),
            term="Term 1",
            academic_year="2024-2025",
            subject_id=1
        )
        db.session.add(assessment)
        db.session.commit()
        assessment_id = assessment.assessment_id
    
    # Delete the assessment
    response = client.delete(f'/api/assessments/{assessment_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "Assessment deleted successfully" in data["message"]

def test_assessment_statistics():
    """Test getting assessment statistics"""
    client = app.test_client()
    response = client.get('/api/assessments/statistics')
    assert response.status_code == 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
    # Run tests
    test_add_assessment()
    test_get_assessments()
    test_get_assessment_by_id()
    test_update_assessment()
    test_delete_assessment()
    test_assessment_statistics()
    
    print("All tests passed!")