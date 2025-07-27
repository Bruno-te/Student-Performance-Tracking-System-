<<<<<<< HEAD
#importing the required Flask and libraries
from flask import Flask, request, redirect, url_for, session, render_template_string
=======
from models import User
from flask import Flask, request, redirect, url_for, session, render_template_string, jsonify
>>>>>>> d33c2e7582e78e40349d53ad46d984682688e515
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import timedelta
from flask_cors import CORS
from models import db
from routes.students import students_bp
from routes.assessments import assessments_bp
from routes.attendance import attendance_bp
from routes.participation import participation_bp
from routes.behavioral import behavioral_bp
from routes.admin import admin_bp

#initialazing the flask application
app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    expose_headers=["Content-Type", "Authorization"]
)
app.secret_key = 'your_secret_key'

# Connection to PostgreSQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Jtatum230100@localhost:5434/urugendo'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)
db.init_app(app)

# -------------------- MODELS --------------------
<<<<<<< HEAD
# Define a user model for the users table
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100))
=======
# (Model definitions removed. Use: from models import User, ...)
>>>>>>> d33c2e7582e78e40349d53ad46d984682688e515

# -------------------- ROUTES --------------------
# Route for Sign-up page
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        role = request.form['role']
        email = request.form.get('email')

        # Check if user exists
        if User.query.filter_by(username=username).first():
            return 'Username already exists.'

        hashed_pw = generate_password_hash(password)
        new_user = User(username=username, password_hash=hashed_pw, role=role, email=email)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))

    return render_template_string('''
    <h2>Sign Up</h2>
    <form method="POST">
        Username: <input name="username"><br>
        Password: <input type="password" name="password"><br>
        Role: <select name="role">
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
        </select><br>
        Email: <input name="email"><br>
        <button type="submit">Sign Up</button>
    </form>
    ''')

# Login page
@app.route('/api/login', methods=['POST', 'OPTIONS'])
def api_login():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    try:
        # Try to get JSON, fallback to form data
        data = request.get_json(silent=True)
        if not data:
            data = request.form
        username = data.get('username') if data else None
        remember = data.get('remember', False) if data else False
        print("DEBUG: Received data:", data)
        print("DEBUG: Username:", username, "Remember:", remember)
        
        if not username:
            return jsonify({'success': False, 'message': 'Username is required.'}), 400
        
        user = User.query.filter_by(username=username).first()
        if user:
            session['user_id'] = user.user_id
            session['username'] = user.username
            session.permanent = remember
            return jsonify({'success': True, 'username': user.username, 'role': user.role})
        return jsonify({'success': False, 'message': 'Invalid username'}), 401
    
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/api/signup', methods=['POST', 'OPTIONS'])
def api_signup():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json(silent=True)
    if not data:
        data = request.form
    username = data.get('username') if data else None
    password = data.get('password') if data else None
    email = data.get('email') if data else None
    role = data.get('role', 'user') if data else 'user'
    if not username or not password or not email:
        return jsonify({'success': False, 'message': 'All fields are required.'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'success': False, 'message': 'Username already exists.'}), 400
    hashed_pw = generate_password_hash(password)
    new_user = User(username=username, password_hash=hashed_pw, role=role, email=email)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'success': True, 'message': 'User created successfully.'})

@app.route('/api/forgot-password', methods=['POST', 'OPTIONS'])
def api_forgot_password():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json(silent=True)
    if not data:
        data = request.form
    email = data.get('email') if data else None
    if not email:
        return jsonify({'success': False, 'message': 'Email is required.'}), 400
    return jsonify({'success': True, 'message': 'If this email exists, a reset link has been sent.'})

# Home page (requires login)
@app.route('/')
def home():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
    return jsonify({'success': True, 'username': session['username']})

# Logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# -------------------- MAIN --------------------
@app.route('/test')
def test():
    return "Test!"

if __name__ == '__main__':
    app.register_blueprint(students_bp, url_prefix='/api/students/')
    app.register_blueprint(assessments_bp, url_prefix='/assessments')
    app.register_blueprint(attendance_bp, url_prefix='/attendance')
    app.register_blueprint(participation_bp, url_prefix='/participation')
    app.register_blueprint(behavioral_bp, url_prefix='/behavioral')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.run(debug=True, host='127.0.0.1', port=5051)