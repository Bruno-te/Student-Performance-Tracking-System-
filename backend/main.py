#importing the required Flask and libraries
from flask import Flask, request, redirect, url_for, session, render_template_string
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os

#initialazing the flask application
app = Flask(__name__)
app.secret_key = 'your_secret_key'

# Connect to your PostgreSQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Jamorant12@localhost/urugendo'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# -------------------- MODELS --------------------
# Define a user model for the users table
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100))

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
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user and check_password_hash(user.password_hash, request.form['password']):
            session['user_id'] = user.user_id
            session['username'] = user.username
            return redirect(url_for('home'))
        return 'Invalid username or password.'

    return render_template_string('''
    <h2>Login</h2>
    <form method="POST">
        Username: <input name="username"><br>
        Password: <input type="password" name="password"><br>
        <button type="submit">Log In</button>
    </form>
    ''')

# Home page (requires login)
@app.route('/')
def home():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return f"Welcome, {session['username']}! <br><a href='/logout'>Logout</a>"

# Logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# -------------------- MAIN --------------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='127.0.0.1', port=5050)
