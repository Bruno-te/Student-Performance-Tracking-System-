#!/usr/bin/env python3

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from main import app
    from models import db, Student, Guardian, EmergencyContact, Class
    from datetime import date
    
    def create_test_data():
        """Create test students and related data"""
        with app.app_context():
            print("🎓 Creating test students...")
            
            # Create classes first
            classes_data = [
                (1, 'P1'), (2, 'P2'), (3, 'P3'), 
                (4, 'P4'), (5, 'P5'), (6, 'P6')
            ]
            
            for class_id, class_name in classes_data:
                if not Class.query.filter_by(class_id=class_id).first():
                    class_obj = Class(class_id=class_id, class_name=class_name)
                    db.session.add(class_obj)
                    print(f"✅ Created class: {class_name}")
            
            db.session.commit()
            
            # Test students
            students = [
                ('Alice', 'Johnson', date(2012, 3, 15), 'F', 1),
                ('Bob', 'Williams', date(2011, 7, 22), 'M', 2),
                ('Charlie', 'Davis', date(2010, 11, 8), 'M', 3),
                ('Diana', 'Miller', date(2009, 5, 30), 'F', 4),
                ('Ethan', 'Anderson', date(2008, 9, 12), 'M', 5),
                ('Fiona', 'Garcia', date(2007, 12, 25), 'F', 6),
            ]
            
            created_count = 0
            for first_name, last_name, dob, gender, class_id in students:
                full_name = f"{first_name} {last_name}"
                
                # Check if student exists
                if Student.query.filter_by(full_name=full_name).first():
                    print(f"⚠️  {full_name} already exists, skipping...")
                    continue
                
                # Generate student ID
                last_student = Student.query.order_by(Student.student_id.desc()).first()
                if last_student and str(last_student.student_id).startswith('RW-'):
                    try:
                        last_num = int(str(last_student.student_id).split('-')[1])
                    except:
                        last_num = 0
                else:
                    last_num = 0
                
                new_num = last_num + 1
                student_id = f"RW-{new_num:03d}"
                
                # Create student
                student = Student(
                    student_id=student_id,
                    full_name=full_name,
                    gender=gender,
                    date_of_birth=dob,
                    enrollment_date=date.today(),
                    class_id=class_id
                )
                db.session.add(student)
                db.session.flush()
                
                # Add guardians
                guardian1 = Guardian(
                    student_id=student.student_id,
                    first_name=f"Parent1_{first_name}",
                    last_name=last_name,
                    relationship="Father",
                    contact=f"078{8000000 + created_count * 10 + 1}"
                )
                guardian2 = Guardian(
                    student_id=student.student_id,
                    first_name=f"Parent2_{first_name}",
                    last_name=last_name,
                    relationship="Mother", 
                    contact=f"078{8000000 + created_count * 10 + 2}"
                )
                db.session.add(guardian1)
                db.session.add(guardian2)
                
                # Add emergency contact
                emergency = EmergencyContact(
                    student_id=student.student_id,
                    first_name=f"Emergency_{first_name}",
                    last_name="Contact",
                    relationship="Aunt",
                    contact=f"078{8000000 + created_count * 10 + 3}"
                )
                db.session.add(emergency)
                
                print(f"✅ Created: {full_name} (ID: {student_id}, Class: P{class_id})")
                created_count += 1
            
            db.session.commit()
            
            total_students = Student.query.count()
            print(f"\n🎉 Success! Created {created_count} new students.")
            print(f"📊 Total students in database: {total_students}")
            print("\n🔗 You can now test:")
            print("   - Student profiles")
            print("   - Assessment tracking")
            print("   - Attendance monitoring")
            print("   - Participation logging")
            print("   - Behavioral tracking")
    
    if __name__ == '__main__':
        create_test_data()
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're running this from the backend directory!")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
