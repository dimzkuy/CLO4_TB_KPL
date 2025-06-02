"""
Quick Start Script for Cinema Booking System
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    # Change to project directory
    project_dir = Path(__file__).parent
    os.chdir(project_dir)
    
    print("🎬 Starting Cinema Booking System...")
    
    try:
        # Run the main app
        subprocess.run([sys.executable, 'app.py'], check=True)
    except KeyboardInterrupt:
        print("\n👋 System stopped by user")
    except FileNotFoundError:
        print("❌ Python not found. Please install Python first.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running application: {e}")
        print("\n💡 Try installing dependencies first:")
        print("   pip install flask flask-cors")

if __name__ == '__main__':
    main()