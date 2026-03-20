@echo off
setlocal enabledelayedexpansion

echo.
echo 4 Relief-Zone: Full Reset Script
echo ==================================
echo.

echo ^⏳ This will:
echo   1. Delete .next build cache
echo   2. Delete node_modules
echo   3. Delete package lock files
echo   4. Reinstall clean dependencies
echo   5. Run setup to create database
echo.

set /p continue="Continue? (y/n): "
if /i not "%continue%"=="y" (
    echo Cancelled.
    exit /b 1
)

echo.
echo ^🗑️ Cleaning build artifacts...
if exist .next (
    rmdir /s /q .next
    echo ^✓ Deleted .next
) else (
    echo ^✓ .next doesn't exist
)

echo.
echo ^🗑️ Cleaning node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo ^✓ Deleted node_modules
) else (
    echo ^✓ node_modules doesn't exist
)

echo.
echo ^🗑️ Cleaning lock files...
if exist pnpm-lock.yaml del pnpm-lock.yaml && echo ^✓ Deleted pnpm-lock.yaml
if exist package-lock.json del package-lock.json && echo ^✓ Deleted package-lock.json
if exist yarn.lock del yarn.lock && echo ^✓ Deleted yarn.lock

echo.
echo ^📦 Installing fresh dependencies...
where pnpm >nul 2>nul
if %ERRORLEVEL% == 0 (
    pnpm install
    set PACKAGE_MANAGER=pnpm
) else (
    npm install
    set PACKAGE_MANAGER=npm
)
echo ^✓ Dependencies installed

echo.
echo ^🗄️ Setting up database...
call %PACKAGE_MANAGER% run setup

echo.
echo ^✅ Reset complete!
echo.
echo ^📝 Next steps:
echo   1. Clear browser cache (F12 ^→ right-click reload ^→ Empty cache and hard reload)
echo   2. Start dev server: npm run dev
echo   3. Go to http://localhost:3000/register to create an account
echo.

pause
