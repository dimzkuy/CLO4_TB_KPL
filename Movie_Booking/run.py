#!/usr/bin/env python3
"""
Startup script untuk Cinema Booking System
"""
import os
import sys
import subprocess

def main():
    print("🎬 Cinema Booking System - Startup")
    print("=" * 40)
    
    # Change to project directory
    project_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_dir)
    
    # Check if we're in the right directory
    if not os.path.exists('api/auth_api.py'):
        print("❌ auth_api.py not found!")
        print(f"📁 Current directory: {os.getcwd()}")
        print("💡 Make sure you're in the Movie_Booking directory")
        return
    
    print("📁 Project directory: " + os.getcwd())
    print("🚀 Starting Flask server...")
    
    try:
        # Run Flask app directly
        subprocess.run([sys.executable, 'api/auth_api.py'])
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except FileNotFoundError:
        print("❌ Python not found!")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()