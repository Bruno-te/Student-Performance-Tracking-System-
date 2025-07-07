from flask import Flask
from config import Config
from models import db
from routes.students import students_bp
from routes.attendance import attendance_bp

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# Register blueprints
app.register_blueprint(students_bp, url_prefix='/students')
app.register_blueprint(attendance_bp, url_prefix='/attendance')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)  # Using port 5001 to avoid conflicts
