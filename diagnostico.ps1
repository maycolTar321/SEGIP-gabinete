# ==========================================================
#   SEGIP GABINETE JURIDICO - DIAGNOSTICO DEL SISTEMA
# ==========================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   SEGIP GABINETE JURIDICO - DIAGNOSTICO DEL SISTEMA      " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Comprobar Node.js y npm
Write-Host "`n1. Verificando entorno de ejecucion..." -ForegroundColor Yellow
$nodeVersion = node -v
$npmVersion = npm -v
Write-Host " - Node.js: $nodeVersion" -ForegroundColor Green
Write-Host " - npm:     $npmVersion" -ForegroundColor Green

# 2. Comprobar dependencias
Write-Host "`n2. Verificando arbol de dependencias..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host " - node_modules presente." -ForegroundColor Green
} else {
    Write-Host " - node_modules ausente. Ejecute 'npm install'." -ForegroundColor Red
}

# 3. Comprobar compilacion (build)
Write-Host "`n3. Ejecutando comprobador de tipos y compilacion..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host " - Compilacion de produccion: EXITOSA" -ForegroundColor Green
} else {
    Write-Host " - Compilacion: FALLIDA." -ForegroundColor Red
}

# 4. Comprobar conectividad con Google Apps Script
Write-Host "`n4. Probando conectividad con backend de Google Apps Script..." -ForegroundColor Yellow
$backendUrl = "https://script.google.com/macros/s/AKfycbwTl7eqlnCYKnNiTrwi6SMHYVPV4hcFHNB1ImfinMzNm9L88qbDDRRW9OoGNkmCsuEUmg/exec"

try {
    $res = Invoke-RestMethod -Uri ($backendUrl + "?action=ping") -TimeoutSec 10
    if ($res.success) {
        Write-Host " - Conexion con Google Apps Script: ACTIVA" -ForegroundColor Green
        Write-Host " - Sistema: $($res.sistema)" -ForegroundColor Gray
        Write-Host " - Version: $($res.version)" -ForegroundColor Gray
        Write-Host " - Hora del Servidor: $($res.horaServidor)" -ForegroundColor Gray
    } else {
        Write-Host " - Servidor respondio con estado no exitoso." -ForegroundColor Red
    }
} catch {
    Write-Host " - No se pudo conectar con el backend de Google Apps Script: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "   DIAGNOSTICO FINALIZADO                                 " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
