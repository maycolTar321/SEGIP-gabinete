@echo off
title SEGIP - Gabinete Juridico (Sistema de Saneamiento de Datos)
color 0B

echo ======================================================================
echo    SERVICIO GENERAL DE IDENTIFICACION PERSONAL - SEGIP
echo    GABINETE JURIDICO - SISTEMA DE SANEAMIENTO DE DATOS
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/2] Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias necesarias...
    call npm install
)

echo [2/2] Iniciando servidor local en el navegador...
echo.
echo Presiona Ctrl+C en cualquier momento para detener el sistema.
echo ======================================================================
echo.

REM Inicia el servidor de desarrollo y abre automaticamente el navegador
start "" http://localhost:5173
call npm run dev

pause
