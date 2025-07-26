from flask import Blueprint, request, jsonify, session
from models import db, User, Teacher, Parent
from werkzeug.security import generate_password_hash
import secrets
import string

admin_bp = Blueprint('admin', __name__)

def require_admin():
    """Decorator to require admin authentication"""
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401
    
    user = User.query.get(session['user_id'])
    if not user or user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    return None

def generate_secure_password(length=12):
    """Generate a secure random password"""
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(characters) for _ in range(length))

@admin_bp.route('/users', methods=['GET'])
def get_users():
    """Get all users with their details"""
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    users = User.query.all()
    return jsonify([
        {
            'user_id': u.user_id,
            'username': u.username,
            'email': u.email,
            'role': u.role
        } for u in users
    ])

@admin_bp.route('/users/teachers', methods=['POST'])
def create_teacher():
    """Create a new teacher user with automatic password generation"""
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'email', 'full_name']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Check if username or email already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Generate secure password
    password = generate_secure_password()
    
    try:
        # Create user account
        user = User(
            username=data['username'],
            password_hash=generate_password_hash(password),
            role='teacher',
            email=data['email']
        )
        db.session.add(user)
        db.session.flush()  # Get the user_id
        
        # Create teacher profile
        teacher = Teacher(
            user_id=user.user_id,
            full_name=data['full_name'],
            email=data['email'],
            phone=data.get('phone', '')
        )
        db.session.add(teacher)
        db.session.commit()
        
        return jsonify({
            'message': 'Teacher created successfully',
            'user_id': user.user_id,
            'username': user.username,
            'password': password,  # Return password for admin to share
            'teacher_id': teacher.teacher_id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create teacher: {str(e)}'}), 500

@admin_bp.route('/users/parents', methods=['POST'])
def create_parent():
    """Create a new parent user with automatic password generation"""
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'email', 'full_name']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Check if username or email already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Generate secure password
    password = generate_secure_password()
    
    try:
        # Create user account
        user = User(
            username=data['username'],
            password_hash=generate_password_hash(password),
            role='parent',
            email=data['email']
        )
        db.session.add(user)
        db.session.flush()  # Get the user_id
        
        # Create parent profile
        parent = Parent(
            user_id=user.user_id,
            full_name=data['full_name'],
            phone=data.get('phone', ''),
            address=data.get('address', '')
        )
        db.session.add(parent)
        db.session.commit()
        
        return jsonify({
            'message': 'Parent created successfully',
            'user_id': user.user_id,
            'username': user.username,
            'password': password,  # Return password for admin to share
            'parent_id': parent.parent_id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create parent: {str(e)}'}), 500

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user():
    """Update user information"""
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    # Update user fields
    if 'email' in data:
        # Check if email is already taken by another user
        existing = User.query.filter_by(email=data['email']).first()
        if existing and existing.user_id != user_id:
            return jsonify({'error': 'Email already exists'}), 400
        user.email = data['email']
    
    if 'username' in data:
        # Check if username is already taken by another user
        existing = User.query.filter_by(username=data['username']).first()
        if existing and existing.user_id != user_id:
            return jsonify({'error': 'Username already exists'}), 400
        user.username = data['username']
    
    try:
        db.session.commit()
        return jsonify({'message': 'User updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update user: {str(e)}'}), 500

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user():
    """Delete a user (with cascade protection for admin)"""
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    user = User.query.get_or_404(user_id)
    
    # Prevent admin from deleting themselves
    if user.user_id == session['user_id']:
        return jsonify({'error': 'Cannot delete your own admin account'}), 400
    
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete user: {str(e)}'}), 500

@admin_bp.route('/users/<int:user_id>/reset-password', methods=['POST'])
def reset_user_password():
    """Reset a user's password"""
    auth_error = require_admin()
    if auth_error:
        return auth_error
    
    user = User.query.get_or_404(user_id)
    
    # Generate new secure password
    new_password = generate_secure_password()
    user.password_hash = generate_password_hash(new_password)
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Password reset successfully',
            'new_password': new_password
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to reset password: {str(e)}'}), 500
