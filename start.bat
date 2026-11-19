@echo off
setlocal
cd /d "%~dp0"

echo.
echo  ============================================
echo   Portafolio Zettafuego - servidor local
echo  ============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo  [ERROR] No se encontro Node.js.
  echo  Instala Node desde https://nodejs.org y vuelve a intentar.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo  Instalando dependencias...
  call npm.cmd install
  if errorlevel 1 (
    echo  [ERROR] npm install fallo.
    pause
    exit /b 1
  )
)

echo  Abriendo http://localhost:5173 ...
echo  (deja esta ventana abierta; Ctrl+C para detener)
echo.

start "" "http://localhost:5173"
call npm.cmd run dev -- --host 127.0.0.1 --port 5173

pause
