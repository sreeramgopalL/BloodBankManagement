@echo off
echo Stopping Blood Bank Microservices on ports 8761, 9090, 8082, 8083, 8084, 8085, 8086...
for %%P in (8761 9090 8082 8083 8084 8085 8086) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%P" ^| findstr "LISTENING"') do (
        echo Stopping PID %%a on port %%P
        taskkill /F /PID %%a 2>nul
    )
)
echo All backend services stopped.
