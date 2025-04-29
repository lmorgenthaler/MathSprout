# MathSprout Backend

This is the Django backend for MathSprout, handling secure student creation through Supabase.

## Setup

1. Create a `.env` file in the backend directory with:
```
SUPABASE_URL=your-project-url-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
DJANGO_SECRET_KEY=django-insecure-generate-a-new-key-here
```

2. Install dependencies:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install django djangorestframework django-cors-headers python-dotenv requests
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start the development server:
```bash
python manage.py runserver
```

## API Endpoints

### Create Student
- **URL**: `/api/create-student/`
- **Method**: `POST`
- **Data Params**:
  ```json
  {
    "email": "student@example.com",
    "password": "student_id_or_password",
    "user_metadata": {
      "name": "Student Name",
      "grade": "Grade 5",
      "classroom": "Class A",
      "parent_name": "Parent Name",
      "parent_email": "parent@example.com"
    }
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: `{ "message": "Student created successfully", "user": {...} }`
- **Error Response**:
  - **Code**: 400
  - **Content**: `{ "error": "Email and password are required" }`

## Security Notes
- The service role key has full admin access to your Supabase project
- Never expose the service role key in the frontend
- All sensitive operations are handled securely on the backend 