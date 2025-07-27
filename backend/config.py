import os

class Config:
     SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///student_performance.db'
     SQLALCHEMY_TRACK_MODIFICATIONS = False
