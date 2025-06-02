#!/usr/bin/env python3
"""
Cinema Booking System - Main Application Entry Point
Flask API + Frontend Integration
"""
import os
import sys
import subprocess
import webbrowser
import time
import threading

def check_dependencies():
    """Check and install Flask dependencies"""
    print("📦 Checking dependencies...")
    
    packages = ['flask', 'flask-cors']
    missing = []
    
    for package in packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"   ✅ {package}")
        except ImportError:
            missing.append(package)
            print(f"   ❌ {package} - missing")
    
    if missing:
        print(f"📥 Installing missing packages: {', '.join(missing)}")
        try:
            subprocess.check_call([
                sys.executable, '-m', 'pip', 'install'
            ] + missing, stdout=subprocess.DEVNULL)
            print("✅ All dependencies installed")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies")
            print("💡 Try manually: pip install flask flask-cors")
            return False
    
    return True

def open_browser():
    """Open browser after server starts"""
    time.sleep(2)
    print("🌐 Opening browser...")
    webbrowser.open('http://localhost:5000')

def print_startup_info():
    """Print startup information"""
    print("\n" + "="*60)
    print("🎬 CINEMA BOOKING SYSTEM")
    print("="*60)
    print("🐍 Python Flask Server")
    print(f"📁 Project: {os.getcwd()}")
    print(f"🌐 Server: http://localhost:5000")
    print(f"🏠 Landing: http://localhost:5000/sections/landing_page.html")
    print("-" * 60)
    print("🚀 Available Pages:")
    print("   / → Landing Page")
    print("   /sections/login.html → Login")
    print("   /sections/register.html → Register")
    print("   /sections/film_landing.html → Film Preview")
    print("-" * 60)
    print("📡 API Endpoints:")
    print("   POST /api/login → User login")
    print("   POST /api/register → User registration")
    print("   GET /api/health → Health check")
    print("-" * 60)
    print("👥 Demo Account:")
    print("   Username: admin")
    print("   Password: admin123")
    print("-" * 60)
    print("💡 Press Ctrl+C to stop the server")
    print("="*60 + "\n")

def main():
    """Main application entry point"""
    # Change to project directory
    project_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_dir)
    
    print_startup_info()
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Check if auth_api.py exists
    if not os.path.exists('api/auth_api.py'):
        print("❌ api/auth_api.py not found!")
        print(f"📁 Current directory: {os.getcwd()}")
        print("💡 Make sure you're in the Movie_Booking directory")
        return
    
    # Open browser in background
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    print("🚀 Starting Flask API server...")
    
    try:
        # Run Flask app
        subprocess.run([sys.executable, 'api/auth_api.py'])
    except KeyboardInterrupt:
        print("\n👋 Cinema Booking System stopped")
    except FileNotFoundError:
        print("❌ Python not found!")
        print("💡 Install Python from: https://python.org/downloads/")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()