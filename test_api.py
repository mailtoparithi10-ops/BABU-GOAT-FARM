"""
Simple script to test the API endpoints locally
Run: python test_api.py
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_health():
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_root():
    print("Testing root endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_login():
    print("Testing login...")
    data = {
        "email": "admin@example.com",
        "password": "admin123"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")
    
    if response.status_code == 200:
        return response.json()["access_token"]
    return None

if __name__ == "__main__":
    print("=" * 50)
    print("API Testing Script")
    print("=" * 50 + "\n")
    
    try:
        test_health()
        test_root()
        token = test_login()
        
        if token:
            print(f"✅ Login successful! Token: {token[:20]}...")
        else:
            print("❌ Login failed")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure Flask app is running:")
        print("   python app.py")
