# KODESK Database Setup Script
# This script helps set up PostgreSQL database for KODESK

Write-Host "=== KODESK Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
$pgPath = Get-ChildItem "C:\Program Files\PostgreSQL" -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1

if (-not $pgPath) {
    Write-Host "❌ PostgreSQL not found in standard location." -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL is installed and try again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To install PostgreSQL, run:" -ForegroundColor Yellow
    Write-Host "  winget install PostgreSQL.PostgreSQL.17" -ForegroundColor White
    exit 1
}

$pgVersion = $pgPath.Name
$pgBinPath = Join-Path $pgPath.FullName "bin"
$psqlPath = Join-Path $pgBinPath "psql.exe"

if (-not (Test-Path $psqlPath)) {
    Write-Host "❌ psql.exe not found at: $psqlPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found PostgreSQL $pgVersion" -ForegroundColor Green
Write-Host ""

# Add PostgreSQL to PATH for this session
$env:Path = "$pgBinPath;$env:Path"

# Check if PostgreSQL service is running
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue | Select-Object -First 1

if (-not $pgService) {
    Write-Host "⚠️  PostgreSQL service not found. Please start PostgreSQL service manually." -ForegroundColor Yellow
    Write-Host "You can start it from Services (services.msc) or run:" -ForegroundColor Yellow
    Write-Host "  net start postgresql-x64-17" -ForegroundColor White
    Write-Host ""
} elseif ($pgService.Status -ne 'Running') {
    Write-Host "⚠️  PostgreSQL service is not running. Attempting to start..." -ForegroundColor Yellow
    try {
        Start-Service -Name $pgService.Name
        Start-Sleep -Seconds 3
        Write-Host "✅ PostgreSQL service started" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start PostgreSQL service: $_" -ForegroundColor Red
        Write-Host "Please start it manually from Services (services.msc)" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ PostgreSQL service is running" -ForegroundColor Green
}

Write-Host ""

# Prompt for PostgreSQL password
$pgPassword = Read-Host "Enter PostgreSQL 'postgres' user password" -AsSecureString
$pgPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword)
)

# Set PGPASSWORD environment variable
$env:PGPASSWORD = $pgPasswordPlain

Write-Host ""
Write-Host "Creating database 'kodesk_db'..." -ForegroundColor Cyan

# Create database
$createDbResult = & $psqlPath -U postgres -c "CREATE DATABASE kodesk_db;" 2>&1

if ($LASTEXITCODE -eq 0 -or $createDbResult -match "already exists") {
    Write-Host "✅ Database 'kodesk_db' exists or created successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database creation result: $createDbResult" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Initializing database schema..." -ForegroundColor Cyan

# Run initialization script
$initScript = Join-Path $PSScriptRoot "backend\scripts\initDatabase.sql"

if (Test-Path $initScript) {
    $initResult = & $psqlPath -U postgres -d kodesk_db -f $initScript 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database schema initialized successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Schema initialization warnings/errors:" -ForegroundColor Yellow
        Write-Host $initResult
    }
} else {
    Write-Host "❌ Initialization script not found at: $initScript" -ForegroundColor Red
}

# Update .env file with password
$envFile = Join-Path $PSScriptRoot "backend\.env"
if (Test-Path $envFile) {
    Write-Host ""
    Write-Host "Updating .env file with database password..." -ForegroundColor Cyan
    
    $envContent = Get-Content $envFile -Raw
    $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$pgPasswordPlain"
    Set-Content -Path $envFile -Value $envContent -NoNewline
    
    Write-Host "✅ .env file updated" -ForegroundColor Green
}

# Clear password from memory
$pgPasswordPlain = $null
$env:PGPASSWORD = $null

Write-Host ""
Write-Host "=== Database Setup Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Seed sample data (recommended):" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run seed" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the backend server:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""

