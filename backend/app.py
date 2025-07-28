from flask import Flask
from config import Config
from models import db
from routes.students import students_bp
from routes.attendance import attendance_bp
# dev
from routes.teacher_assignments import teacher_assignments_bp
from routes.assessments import assessments_bp  
from routes.Behavioral import behavioral_bp

from routes.assessments import assessments_bp
from routes.participation import participation_bp 
# main

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# Register blueprints
app.register_blueprint(students_bp, url_prefix='/students')
app.register_blueprint(attendance_bp, url_prefix='/attendance') 
# dev
app.register_blueprint(teacher_assignments_bp, url_prefix='/api/teacher-assignments')
app.register_blueprint(assessments_bp, url_prefix='/api/assessments')
app.register_blueprint(behavioral_bp, url_prefix='/api/behavioral') 
app.register_blueprint(participation_bp, url_prefix='/api/participation')
# main

# Simple home route to avoid 404 on "/"
@app.route('/')
def index():
    return "Welcome to the Student Performance Tracking System API."

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="127.0.0.1", port=8080)
