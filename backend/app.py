from flask import Flask
from backend.config import Config
from backend.models import db
from backend.routes.students import students_bp
from backend.routes.attendance import attendance_bp

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# Register blueprints
app.register_blueprint(students_bp, url_prefix='/students')
app.register_blueprint(attendance_bp, url_prefix='/attendance')

if __name__ == '__main__':
    app.run(debug=True)
