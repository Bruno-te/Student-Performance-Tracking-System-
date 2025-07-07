import json
from backend.app import app
from backend.models import db

def test_add_student():
    client = app.test_client()
    response = client.post('/students/', json={
        "full_name": "Test Student",
        "gender": "Male",
        "date_of_birth": "2004-05-10",
        "class_id": 1,
        "guardian_contact": "0788123456"
    })
    assert response.status_code == 201
    assert b"Student added" in response.data
