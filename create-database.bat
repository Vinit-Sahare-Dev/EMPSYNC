@echo off
echo Creating employee_management_system database...
echo.

REM Try to find PostgreSQL installation
set PG_PATH=""
if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" (
    set PG_PATH="C:\Program Files\PostgreSQL\15\bin"
) else if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" (
    set PG_PATH="C:\Program Files\PostgreSQL\14\bin"
) else if exist "C:\Program Files\PostgreSQL\13\bin\psql.exe" (
    set PG_PATH="C:\Program Files\PostgreSQL\13\bin"
) else if exist "C:\Program Files\PostgreSQL\12\bin\psql.exe" (
    set PG_PATH="C:\Program Files\PostgreSQL\12\bin"
)

if %PG_PATH%=="" (
    echo PostgreSQL not found in standard locations.
    echo Please install PostgreSQL or add it to your PATH.
    echo.
    echo You can manually create the database using:
    echo 1. Open pgAdmin or psql
    echo 2. Run: CREATE DATABASE employee_management_system;
    echo.
    pause
    exit /b 1
)

echo Found PostgreSQL at: %PG_PATH%
echo.

REM Create database using psql
%PG_PATH%\psql.exe -U postgres -h localhost -c "CREATE DATABASE employee_management_system;" 2>nul

if %ERRORLEVEL% EQU 0 (
    echo Database created successfully!
) else (
    echo Database may already exist or there was an error.
    echo Continuing anyway...
)

echo.
echo Done! You can now start your Spring Boot application.
pause
