@echo off
echo ========================================================
echo Starting Blood Bank Microservices Backend
echo ========================================================

cd /d "%~dp0"

echo [1/7] Starting Eureka Server (Port 8761)...
start "Eureka Server [8761]" cmd /k "title Eureka Server [8761] && mvnw.cmd -pl eureka-server spring-boot:run"

echo Waiting for Eureka Server to initialize...
ping 127.0.0.1 -n 9 >nul

echo [2/7] Starting API Gateway (Port 9090)...
start "API Gateway [9090]" cmd /k "title API Gateway [9090] && mvnw.cmd -pl api-gateway spring-boot:run"

echo [3/7] Starting Auth Service (Port 8086)...
start "Auth Service [8086]" cmd /k "title Auth Service [8086] && mvnw.cmd -pl auth-service spring-boot:run"

echo [4/7] Starting Donor and Camp Service (Port 8084)...
start "Donor Camp Service [8084]" cmd /k "title Donor Camp Service [8084] && mvnw.cmd -pl donor-camp-service spring-boot:run"

echo [5/7] Starting Inventory Service (Port 8083)...
start "Inventory Service [8083]" cmd /k "title Inventory Service [8083] && mvnw.cmd -pl inventory-service spring-boot:run"

echo [6/7] Starting Request and Issue Service (Port 8082)...
start "Request Issue Service [8082]" cmd /k "title Request Issue Service [8082] && mvnw.cmd -pl request-issue-service spring-boot:run"

echo [7/7] Starting Notification and Report Service (Port 8085)...
start "Notification Report Service [8085]" cmd /k "title Notification Report Service [8085] && mvnw.cmd -pl notification-report-service spring-boot:run"

echo.
echo All backend microservices are launching in separate windows!
echo Eureka Dashboard: http://localhost:8761
echo API Gateway:      http://localhost:9090
echo ========================================================
