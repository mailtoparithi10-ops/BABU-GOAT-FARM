"""
Generate a secure SECRET_KEY for production deployment
Run: python generate_secret.py
"""
import secrets

print("=" * 60)
print("SECRET_KEY Generator for Render Deployment")
print("=" * 60)
print()
print("Copy this SECRET_KEY for your Render environment variables:")
print()
print(secrets.token_urlsafe(32))
print()
print("=" * 60)
print("⚠️  Keep this secret! Don't commit it to git.")
print("=" * 60)
