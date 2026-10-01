@echo off
setlocal
if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" manage.py %*
) else (
    python manage.py %*
)
