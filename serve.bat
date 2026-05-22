@echo off
REM GDD 메이커 — local dev server
REM Babel-standalone fetches .jsx files via XHR, so file:// won't work.
REM Run this to serve on http://localhost:8000

cd /d "%~dp0"
echo Starting GDD 메이커 at http://localhost:8000
echo Press Ctrl+C to stop.
start "" http://localhost:8000/
py -m http.server 8000
