import json
import os
import shutil
from datetime import datetime

def migrate_express_to_flask():
    """Migrate dari Express Node.js ke Flask Python"""
    
    print("🔄 Migrating from Express to Flask...")
    
    # Check if Express server exists
    express_server = "servers/server.js"
    if os.path.exists(express_server):
        print(f"✅ Found Express server: {express_server}")
        
        # Backup Express server
        backup_name = f"servers/server_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.js"
        shutil.copy2(express_server, backup_name)
        print(f"📦 Backed up Express server to: {backup_name}")
    
    # Check users.json format
    users_file = "data/users.json"
    if os.path.exists(users_file):
        with open(users_file, 'r') as f:
            users_data = json.load(f)
        
        print(f"✅ Found users.json with {len(users_data.get('users', []))} users")
        print("📋 Current users:")
        for user in users_data.get('users', []):
            print(f"   - {user['username']} ({user.get('email', 'no email')})")
    else:
        print("⚠️  No users.json found, Flask will create default data")
    
    # Create requirements.txt if not exists
    requirements_content = """Flask==2.3.3
Flask-CORS==4.0.0
"""
    
    if not os.path.exists("requirements.txt"):
        with open("requirements.txt", "w") as f:
            f.write(requirements_content)
        print("✅ Created requirements.txt")
    
    # Create run script
    run_script_content = """#!/usr/bin/env python3
import subprocess
import sys
import os

def main():
    print("🎬 Starting Cinema Booking Flask API...")
    
    # Install dependencies
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        return
    
    # Run Flask app
    try:
        subprocess.run([sys.executable, 'api/auth_api.py'])
    except KeyboardInterrupt:
        print("\\n👋 Server stopped")

if __name__ == "__main__":
    main()
"""
    
    with open("run_flask.py", "w") as f:
        f.write(run_script_content)
    print("✅ Created run_flask.py")
    
    # Create batch file for Windows
    batch_content = """@echo off
echo 🎬 Cinema Booking Flask API
echo ============================

cd /d "%~dp0"

echo 📦 Installing dependencies...
pip install -r requirements.txt

echo 🚀 Starting Flask server...
python api/auth_api.py

pause
"""
    
    with open("start_flask.bat", "w") as f:
        f.write(batch_content)
    print("✅ Created start_flask.bat")
    
    print("\n🎉 Migration completed!")
    print("=" * 50)
    print("📋 Migration Summary:")
    print("   ✅ Flask API created at: api/auth_api.py")
    print("   ✅ Requirements file: requirements.txt")
    print("   ✅ Run script: run_flask.py")
    print("   ✅ Batch file: start_flask.bat")
    if os.path.exists(express_server):
        print(f"   📦 Express backup: {backup_name}")
    print("\n🚀 Next steps:")
    print("   1. Install dependencies: pip install -r requirements.txt")
    print("   2. Run Flask server: python api/auth_api.py")
    print("   3. Or use: python run_flask.py")
    print("   4. Or double-click: start_flask.bat")
    print("\n🌐 Server akan berjalan di: http://localhost:5000")
    print("🏠 Landing page: http://localhost:5000/sections/landing_page.html")

if __name__ == "__main__":
    migrate_express_to_flask()