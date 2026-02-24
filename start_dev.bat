@echo off
echo ========================================
echo Babu Goat Farm - Development Server
echo ========================================
echo.

echo Starting Flask Backend...
start cmd /k "python app.py"

timeout /t 3 /nobreak > nul

echo Starting React Frontend...
cd goat-farm-frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo Servers starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================
