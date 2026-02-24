#!/bin/bash
set -e

echo "Building React frontend..."
cd goat-farm-frontend
npm install
npm run build
cd ..

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Build complete! Frontend and backend are ready."
