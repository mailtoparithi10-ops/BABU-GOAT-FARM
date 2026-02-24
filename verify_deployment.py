"""
Pre-deployment verification script
Checks if all required files are present and configured correctly
Run: python verify_deployment.py
"""
import os
import sys

def check_file(filepath, description):
    """Check if a file exists"""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} - NOT FOUND")
        return False

def check_gitignore():
    """Check if .gitignore has required entries"""
    if not os.path.exists('.gitignore'):
        print("❌ .gitignore not found")
        return False
    
    with open('.gitignore', 'r') as f:
        content = f.read()
    
    required = ['.env', 'venv', '__pycache__']
    missing = [item for item in required if item not in content]
    
    if missing:
        print(f"⚠️  .gitignore missing: {', '.join(missing)}")
        return False
    else:
        print("✅ .gitignore configured correctly")
        return True

def main():
    print("=" * 60)
    print("Render Deployment Verification")
    print("=" * 60)
    print()
    
    all_good = True
    
    # Check core backend files
    print("Checking Backend Files:")
    all_good &= check_file('app.py', 'Main application')
    all_good &= check_file('routes.py', 'API routes')
    all_good &= check_file('models.py', 'Database models')
    all_good &= check_file('auth.py', 'Authentication')
    all_good &= check_file('config.py', 'Configuration')
    all_good &= check_file('database.py', 'Database setup')
    print()
    
    # Check requirements
    print("Checking Dependencies:")
    all_good &= check_file('requirements-prod.txt', 'Production requirements')
    all_good &= check_file('requirements.txt', 'Local requirements')
    print()
    
    # Check deployment files
    print("Checking Deployment Files:")
    all_good &= check_file('render.yaml', 'Render configuration')
    all_good &= check_file('.env.example', 'Environment template')
    print()
    
    # Check documentation
    print("Checking Documentation:")
    all_good &= check_file('README.md', 'Main documentation')
    all_good &= check_file('RENDER_DEPLOYMENT.md', 'Deployment guide')
    all_good &= check_file('RENDER_CHECKLIST.md', 'Deployment checklist')
    print()
    
    # Check frontend
    print("Checking Frontend:")
    all_good &= check_file('goat-farm-frontend/package.json', 'Frontend package.json')
    all_good &= check_file('goat-farm-frontend/vite.config.js', 'Vite config')
    all_good &= check_file('goat-farm-frontend/src/services/api.js', 'API service')
    print()
    
    # Check gitignore
    print("Checking Git Configuration:")
    all_good &= check_gitignore()
    print()
    
    # Check for sensitive files
    print("Checking for Sensitive Files:")
    if os.path.exists('.env'):
        print("⚠️  .env file exists - Make sure it's in .gitignore!")
        with open('.gitignore', 'r') as f:
            if '.env' in f.read():
                print("✅ .env is in .gitignore")
            else:
                print("❌ .env is NOT in .gitignore - ADD IT NOW!")
                all_good = False
    else:
        print("✅ No .env file in root (good for deployment)")
    print()
    
    # Final verdict
    print("=" * 60)
    if all_good:
        print("✅ ALL CHECKS PASSED!")
        print()
        print("Your project is ready for Render deployment.")
        print()
        print("Next steps:")
        print("1. Generate SECRET_KEY: python generate_secret.py")
        print("2. Push to GitHub: git push origin main")
        print("3. Follow RENDER_CHECKLIST.md")
    else:
        print("❌ SOME CHECKS FAILED")
        print()
        print("Please fix the issues above before deploying.")
        sys.exit(1)
    print("=" * 60)

if __name__ == "__main__":
    main()
