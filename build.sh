#!/bin/bash
set -e

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Build complete! Frontend is pre-built in goat-farm-frontend/dist"
