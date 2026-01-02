@echo off
echo Starting Spring Boot application to create database...
echo.

cd empsync-backend
mvn spring-boot:run

echo.
echo If database was created successfully, please:
echo 1. Stop this application (Ctrl+C)
echo 2. Update application.properties to use employee_management_system database
echo 3. Restart the application
pause
