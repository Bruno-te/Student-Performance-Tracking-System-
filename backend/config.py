import os

class Config:
    # Use SQLite for testing/development
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///student_performance.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
