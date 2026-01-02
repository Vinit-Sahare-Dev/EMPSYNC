@echo off
echo Finding and killing process on port 8888...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8888') do (
    echo Killing process %%a
    taskkill /f /pid %%a
)

echo.
echo Starting Spring Boot application...
cd empsync-backend
mvn spring-boot:run

pause
