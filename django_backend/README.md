# Django Backend for FAPES Edital Management System

This is the Django REST API backend that serves the Vue.js frontend for the FAPES Edital Management System.

## Setup Instructions

1. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Start development server:**
   ```bash
   python manage.py runserver 8002
   ```
   
   Or use the startup script:
   ```bash
   ./start_server.sh
   ```

## Project Structure

```
django_backend/
├── manage.py
├── requirements.txt
├── django_backend/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── authentication/    # JWT authentication
│   ├── editals/          # Edital management
│   ├── conversations/    # Chat history
│   └── metrics/          # Analytics and metrics
└── fixtures/             # Sample data
```

## Configuration

- **Server Port:** 8002
- **Database:** SQLite (for development)
- **CORS:** Configured for localhost:5173 (Vue.js frontend)
- **Authentication:** JWT tokens

## API Documentation

Once the server is running, visit:
- Browsable API: http://localhost:8002/api/
- Admin interface: http://localhost:8002/admin/

## Environment Variables

Create a `.env` file with:
```
SECRET_KEY=your-secret-key
DEBUG=True
```