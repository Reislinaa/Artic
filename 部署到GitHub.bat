@echo off
chcp 65001 >nul
title ARTIC - 一键部署到 GitHub Pages

echo ============================================
echo   ARTIC - 一键部署到 GitHub Pages
echo ============================================
echo.

REM 切到项目目录
cd /d "%~dp0"

REM 检查参数
if "%~2"=="" (
    echo 用法: 部署到GitHub.bat ^<GitHub用户名^> ^<仓库名^>
    echo 示例: 部署到GitHub.bat Reislinaa Artic
    echo.
    pause
    exit /b 1
)

set USERNAME=%~1
set REPO=%~2
set BASE=/%REPO%/

echo [1/3] 构建生产版本...
call npm run build 2>nul || goto :error
if errorlevel 1 goto :error

echo.
echo [2/3] 临时改 base 路径...
set VITE_BASE=%BASE%
set OLDBASE=
echo.

echo [3/3] 重新构建 (base=%BASE%)...
call node scripts/build-with-base.mjs "%BASE%" || goto :error

echo.
echo [4/4] 推送到 gh-pages 分支...
call node scripts/deploy-gh-pages.mjs "%USERNAME%" "%REPO%" || goto :error

echo.
echo ============================================
echo   部署完成
echo   访问: https://%USERNAME%.github.io/%REPO%/
echo ============================================
echo.
pause
exit /b 0

:error
echo.
echo 部署失败，请检查上面的错误信息
pause
exit /b 1