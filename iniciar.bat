@echo off
cd /d "%~dp0"

echo Iniciando backend e frontend do sistema de Etiquetas SEDEX...

start "Backend - Etiquetas SEDEX" cmd /k "cd backend && venv\Scripts\python.exe -m uvicorn app.presentation.main:app --reload --port 8000"
start "Frontend - Etiquetas SEDEX" cmd /k "cd frontend && npm run dev"

echo.
echo Duas janelas foram abertas (backend e frontend).
echo Acesse http://localhost:5173 no navegador.
echo Para desligar, feche as duas janelas.
