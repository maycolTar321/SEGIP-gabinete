<#
.SYNOPSIS
    Script seguro para iniciar el servidor web del SEGIP Gabinete Jurídico.
#>

param (
    [ValidateSet('dev', 'preview')]
    [string]$Modo = 'dev'
)

Write-Host "Iniciando sistema SEGIP Gabinete Jurídico en modo: $Modo..." -ForegroundColor Cyan

if ($Modo -eq 'dev') {
    Write-Host "Abriendo en modo desarrollo (Hot-Reload)..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host "Compilando e iniciando en modo previsualización de producción..." -ForegroundColor Green
    npm run build
    npm run preview
}
