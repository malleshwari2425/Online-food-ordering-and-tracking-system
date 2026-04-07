@echo off
echo ========================================================
echo        Starting QuickDine Food Ordering System         
echo ========================================================
echo.

echo Starting Django Backend Server on port 8000...
start "QuickDine Backend" cmd /k "cd "e:\online-food ordering" && python manage.py runserver"

echo Starting React Frontend on Vite...
start "QuickDine Frontend" cmd /k "cd "e:\online-food ordering\frontend" && npm run dev -- --open"

echo.
echo Both servers have been launched in separate windows!
echo The app should open automatically in your browser shortly at http://localhost:5173
echo.
pause
