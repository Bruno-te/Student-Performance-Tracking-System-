-- Users table for login
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'teacher', 'parent')) NOT NULL,
    email VARCHAR(100)
);

-- Parents table
CREATE TABLE parents (
    parent_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    address TEXT
);

-- Students table
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10),
    date_of_birth DATE,
    class_id INT,
    guardian_contact VARCHAR(15)
);

-- Linking table: students <-> parents
CREATE TABLE student_parent_link (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    parent_id INT REFERENCES parents(parent_id) ON DELETE CASCADE
);

-- Teachers table
CREATE TABLE teachers (
    teacher_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(15),
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE
);

-- Classes table
CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL,
    teacher_id INT REFERENCES teachers(teacher_id)
);

-- Attendance table
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id),
    class_id INT REFERENCES classes(class_id),
    date DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('present', 'absent', 'late')) NOT NULL
);

-- Assessments table
CREATE TABLE assessments (
    assessment_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id),
    subject VARCHAR(50),
    score NUMERIC(5,2),
    max_score NUMERIC(5,2),
    assessment_date DATE NOT NULL,
    remarks TEXT
);

-- Participation table
CREATE TABLE participation (
    participation_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id),
    class_id INT REFERENCES classes(class_id),
    date DATE,
    engagement_level INT CHECK (engagement_level BETWEEN 1 AND 5),
    notes TEXT
);

-- Behavior table
CREATE TABLE behavior (
    behavior_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id),
    incident_date DATE,
    category VARCHAR(50),
    description TEXT
);
