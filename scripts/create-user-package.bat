@echo off
echo Creating user installation package for Pharmacy AI Platform...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check if Ollama is installed
ollama --version >nul 2>&1
if errorlevel 1 (
    echo Installing Ollama...
    powershell -Command "iwr -useb https://ollama.ai/install.sh | sh"
    if errorlevel 1 (
        echo ERROR: Failed to install Ollama
        echo Please install manually from https://ollama.ai
        pause
        exit /b 1
    )
)

REM Start Ollama service
echo Starting Ollama service...
start /B ollama serve

REM Wait for Ollama to start
timeout /t 10 /nobreak >nul

REM Check if biomistral model is installed
ollama list | findstr "biomistral" >nul
if errorlevel 1 (
    echo Downloading biomistral model (4.4GB)...
    echo This may take several minutes...
    ollama pull cniongolo/biomistral:latest
    if errorlevel 1 (
        echo ERROR: Failed to download biomistral model
        pause
        exit /b 1
    )
)

REM Install project dependencies
echo Installing project dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM Build the project
echo Building the project...
npm run build
if errorlevel 1 (
    echo ERROR: Failed to build project
    pause
    exit /b 1
)

REM Create startup script
echo Creating startup script...
(
echo @echo off
echo echo Starting Pharmacy AI Platform...
echo echo.
echo echo 1. Starting Ollama service...
echo start /B ollama serve
echo timeout /t 5 /nobreak ^>nul
echo.
echo echo 2. Starting the application...
echo echo.
echo echo Opening browser...
echo start http://localhost:3000
echo npm run start
echo.
echo echo If browser doesn't open automatically, visit:
echo echo http://localhost:3000
echo.
echo pause
) > start-pharmacy-ai.bat

REM Create desktop shortcut
echo Creating desktop shortcut...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\Pharmacy AI.lnk'); $Shortcut.TargetPath = '%CD%\start-pharmacy-ai.bat'; $Shortcut.WorkingDirectory = '%CD%'; $Shortcut.IconLocation = '%CD%\public\logo.svg'; $Shortcut.Save()"

echo.
echo ✅ Installation completed successfully!
echo.
echo To start the application:
echo 1. Double-click "Pharmacy AI" on your desktop
echo 2. Or run "start-pharmacy-ai.bat"
echo.
echo The application will open in your browser at:
echo http://localhost:3000
echo.
echo 📝 Note: The first AI response may take 1-2 minutes
echo    as the local model processes your request.
echo.
echo 🏥 The AI is specialized for clinical and pharmaceutical queries
echo    using the biomistral medical model.
echo.
pause
