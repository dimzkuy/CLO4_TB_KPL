from flask import Flask, request, jsonify, send_from_directory, redirect, url_for
from flask_cors import CORS
import json
import os
from datetime import datetime
import hashlib

app = Flask(__name__, static_folder='..', static_url_path='')
CORS(app)

# Configuration
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
USERS_FILE = os.path.join(DATA_DIR, 'users.json')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

def load_users():
    """Load users dari JSON file - format sama dengan Express"""
    if not os.path.exists(USERS_FILE):
        # Create initial data sama seperti Express
        initial_data = {
            "users": [
                {
                    "username": "admin",
                    "password": "admin123",
                    "email": "admin@cinemabook.com",
                    "registerDate": "2025-05-27"
                }
            ]
        }
        save_users(initial_data)
        return initial_data
    
    try:
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return {"users": []}

def save_users(users_data):
    """Save users data ke JSON file"""
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users_data, f, indent=2, ensure_ascii=False)

# STATIC FILE ROUTES - sama seperti Express
@app.route('/')
def root():
    """Root route redirect ke landing_page - sama seperti Express"""
    return redirect('/sections/landing_page.html')

@app.route('/sections/<path:filename>')
def serve_sections(filename):
    """Serve HTML files dari sections directory"""
    sections_dir = os.path.join(os.path.dirname(__file__), '..', 'sections')
    file_path = os.path.join(sections_dir, filename)
    
    print(f'Looking for file at: {file_path}')
    
    if os.path.exists(file_path):
        return send_from_directory(sections_dir, filename)
    else:
        print(f'File not found: {file_path}')
        return f'File {filename} tidak ditemukan', 404

@app.route('/sections/landing_page.html')
def landing_page():
    """Handle landing page explicitly - sama seperti Express"""
    sections_dir = os.path.join(os.path.dirname(__file__), '..', 'sections')
    file_path = os.path.join(sections_dir, 'landing_page.html')
    
    print(f'Mencari file di: {file_path}')
    
    if os.path.exists(file_path):
        return send_from_directory(sections_dir, 'landing_page.html')
    else:
        print(f'File tidak ditemukan: {file_path}')
        return 'File landing_page.html tidak ditemukan', 404

@app.route('/sections/home.html')
def home_page():
    """Handle home page - sama seperti Express"""
    sections_dir = os.path.join(os.path.dirname(__file__), '..', 'sections')
    file_path = os.path.join(sections_dir, 'home.html')
    
    if os.path.exists(file_path):
        return send_from_directory(sections_dir, 'home.html')
    else:
        return 'File home.html tidak ditemukan', 404

@app.route('/styles/<path:filename>')
def serve_styles(filename):
    """Serve CSS files"""
    styles_dir = os.path.join(os.path.dirname(__file__), '..', 'styles')
    return send_from_directory(styles_dir, filename)

@app.route('/scripts/<path:filename>')
def serve_scripts(filename):
    """Serve JavaScript files"""
    scripts_dir = os.path.join(os.path.dirname(__file__), '..', 'scripts')
    return send_from_directory(scripts_dir, filename)

@app.route('/img/<path:filename>')
def serve_images(filename):
    """Serve image files"""
    img_dir = os.path.join(os.path.dirname(__file__), '..', 'img')
    return send_from_directory(img_dir, filename)

@app.route('/data/<path:filename>')
def serve_data(filename):
    """Serve data files"""
    return send_from_directory(DATA_DIR, filename)

# API ROUTES - Format response sama persis dengan Express

@app.route('/api/register', methods=['POST'])
def register():
    """API register - format sama dengan Express server.js"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'Invalid request data'
            }), 400
        
        username = data.get('username', '').strip()
        password = data.get('password', '')
        email = data.get('email', '').strip()
        
        print(f'Registration request received: {{"username": "{username}", "email": "{email}", "password": "{password}"}}')
        
        # Validation
        if not username or not password:
            return jsonify({
                'success': False,
                'message': 'Username dan password wajib diisi'
            }), 400
        
        # Load users data
        users_data = load_users()
        
        # Check existing user - sama seperti Express logic
        existing_user = None
        for user in users_data['users']:
            if user['username'] == username or user['email'] == email:
                existing_user = user
                break
        
        if existing_user:
            message = 'Username sudah terdaftar' if existing_user['username'] == username else 'Email sudah terdaftar'
            return jsonify({
                'success': False,
                'message': message
            }), 400
        
        # Add new user - format sama dengan Express
        new_user = {
            'username': username,
            'password': password,
            'email': email or '',
            'registerDate': datetime.now().strftime('%Y-%m-%d')
        }
        
        users_data['users'].append(new_user)
        
        # Save to file
        save_users(users_data)
        
        print(f'User registered successfully: {new_user}')
        
        # Response format sama dengan Express
        return jsonify({
            'success': True,
            'message': 'Pendaftaran berhasil'
        }), 200
        
    except Exception as error:
        print(f'Registration error: {error}')
        return jsonify({
            'success': False,
            'message': f'Server error: {str(error)}'
        }), 500

@app.route('/api/login', methods=['POST'])
def login():
    """API login - format sama dengan Express server.js"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'Invalid request data'
            }), 400
        
        username_or_email = data.get('usernameOrEmail', '').strip()
        password = data.get('password', '')
        
        # Support both 'username' dan 'usernameOrEmail' untuk compatibility
        if not username_or_email:
            username_or_email = data.get('username', '').strip()
        
        if not username_or_email or not password:
            return jsonify({
                'success': False,
                'message': 'Username/Email dan password wajib diisi'
            }), 400
        
        # Load users data
        users_data = load_users()
        
        # Find user - logic sama dengan Express
        user = None
        for u in users_data['users']:
            if ((u['username'] == username_or_email or u['email'] == username_or_email) and 
                u['password'] == password):
                user = u
                break
        
        if user:
            # Response format sama persis dengan Express
            return jsonify({
                'success': True,
                'message': 'Login berhasil',
                'username': user['username'],
                'email': user['email']
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Username/Email atau password salah'
            }), 401
            
    except Exception as error:
        print(f'Login error: {error}')
        return jsonify({
            'success': False,
            'message': 'Server error'
        }), 500

# REQUEST LOGGING - sama seperti Express
@app.before_request
def log_request():
    """Log request paths untuk debugging - sama seperti Express"""
    print(f'Request path: {request.path}')

# 404 HANDLER - sama seperti Express
@app.errorhandler(404)
def not_found(error):
    """404 handler - format sama dengan Express"""
    return f'Cannot GET {request.path}', 404

@app.errorhandler(500)
def internal_error(error):
    """500 handler"""
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500

# HEALTH CHECK endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Flask API is running',
        'port': 5000,
        'compatible_with': 'Express server.js'
    }), 200

if __name__ == "__main__":
    print("🎬 Cinema Booking Flask API")
    print("=" * 50)
    print(f"🔄 Compatible dengan Express server.js")
    print(f"📁 Static files served from: {os.path.join(os.path.dirname(__file__), '..')}")
    print(f"👥 Users file: {USERS_FILE}")
    print("=" * 50)
    
    # Initialize users file
    load_users()
    
    print("✅ Flask API Server ready!")
    print(f"🌐 Server running at: http://localhost:5000")
    print(f"🏠 Landing page: http://localhost:5000/sections/landing_page.html")
    print(f"🔀 Root redirects to: http://localhost:5000/")
    print("=" * 50)
    print("📡 API Endpoints (Express compatible):")
    print("   POST /api/register")
    print("   POST /api/login")
    print("   GET  /api/health")
    print("=" * 50)
    print("👥 Default account: admin / admin123")
    print("💡 Press Ctrl+C to stop the server")
    print("=" * 50)
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )