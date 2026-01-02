@echo off
echo Killing any process on port 8888...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8888') do (
    taskkill /f /pid %%a 2>nul
)

echo.
echo Starting application with employee_management_system database...
cd empsync-backend
mvn spring-boot:run

pause
