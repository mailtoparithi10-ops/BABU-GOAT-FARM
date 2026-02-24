@echo off
echo ========================================
echo Babu Goat Farm - Initial Setup
echo ========================================
echo.

echo Step 1: Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Error creating virtual environment!
    pause
    exit /b 1
)

echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat

echo Step 3: Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error installing dependencies!
    pause
    exit /b 1
)

echo Step 4: Setting up frontend...
cd goat-farm-frontend
call npm install
if errorlevel 1 (
    echo Error installing frontend dependencies!
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy .env.example to .env
echo 2. Update .env with your database and settings
echo 3. Run: start_dev.bat
echo.
pause
