<#
Script de ajuda para inicializar o projeto localmente em Windows PowerShell.
Uso (no diretório raiz do repositório):
  .\start-local.ps1

O script tenta (em ordem):
  1) usar Docker Compose se o `docker` estiver instalado;
  2) usar Maven se `mvn` estiver instalado;
  3) como fallback, instruir a iniciar apenas o frontend localmente.
#>

Set-StrictMode -Version Latest

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Write-Host "Iniciando verificação de ferramentas..."

function Has-Command([string]$name){
    $p = Get-Command $name -ErrorAction SilentlyContinue
    return $null -ne $p
}

if (Has-Command docker) {
    Write-Host "Docker encontrado. Subindo containers via docker-compose..." -ForegroundColor Green
    Push-Location $root
    docker-compose up --build
    Pop-Location
    exit 0
}

if (Has-Command mvn) {
    Write-Host "Maven encontrado. Iniciando backend (Spring Boot)..." -ForegroundColor Green
    Push-Location (Join-Path $root 'backend')
    mvn spring-boot:run
    Pop-Location
    exit 0
}

Write-Host "Nem Docker nem Maven encontrados. Instruções para iniciar apenas o frontend:" -ForegroundColor Yellow
Write-Host "1) Abra PowerShell no diretório 'frontend' e execute:" -ForegroundColor Cyan
Write-Host "   npm.cmd install" -ForegroundColor White
Write-Host "   npm.cmd run start -- --host 127.0.0.1 --port 4201" -ForegroundColor White
Write-Host "Ou, se preferir usar o binário local do Angular CLI (se node_modules já existir):" -ForegroundColor Cyan
Write-Host "   node .\node_modules\@angular\cli\bin\ng serve --host 127.0.0.1 --port 4201" -ForegroundColor White

Write-Host ""
Write-Host "=== Credenciais de acesso ===" -ForegroundColor Magenta
Write-Host "  ADMIN   → admin@petshop.com   / admin123" -ForegroundColor Magenta
Write-Host "  CLIENTE → cliente@petshop.com / cliente123" -ForegroundColor Magenta
Write-Host ""
Write-Host "=== URLs (via Docker) ===" -ForegroundColor Magenta
Write-Host "  Frontend → http://localhost:24743" -ForegroundColor Magenta
Write-Host "  API      → http://localhost:28743/api" -ForegroundColor Magenta
Write-Host ""
Write-Host "=== URLs (local sem Docker) ===" -ForegroundColor Magenta
Write-Host "  Frontend → http://localhost:4200" -ForegroundColor Magenta
Write-Host "  API      → http://localhost:8743/api" -ForegroundColor Magenta
Write-Host ""
Write-Host "AVISO: Para rodar localmente sem Docker, altere o application.properties:" -ForegroundColor Yellow
Write-Host "  Troque 'db' por 'localhost' na URL do datasource." -ForegroundColor Yellow
