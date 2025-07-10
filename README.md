# URUGENDO+ (Student Management App)

This is a basic Flask-based backend for managing student data, user authentication, and role-based access (admin, teacher, parent) using a PostgreSQL database.

## 🚀 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/urugendo-app.git
cd urugendo-app
```

2. Set up a virtual environment
```bash
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Set up the PostgreSQL database
Make sure PostgreSQL is installed and running

Create a database named urugendo:

```sql

CREATE DATABASE urugendo;
Run the schema:

Open pgAdmin or use terminal:

psql -U postgres -d urugendo -f schema.sql
```

5. Update DB credentials in main.py
Replace:

```python
postgresql://postgres:your_password@localhost/urugendo
with your actual DB username and password.
```

✅ Running the App
```bash
python main.py
```
Visit http://127.0.0.1:5000/signup to create an account.

📦 Dependencies
```ini
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
psycopg2-binary==2.9.7
bcrypt==4.1.2
Werkzeug==2.3.8
