# Deployment Configuration for Render.com

## Environment Variables to Set in Render Dashboard:
- GOOGLE_CHROME_BIN=/usr/bin/google-chrome
- CHROMEDRIVER_PATH=/usr/local/bin/chromedriver
- PORT=10000

## Build Command:
chmod +x build.sh && ./build.sh && pip install -r requirements.txt

## Start Command:
gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120

## Notes:
1. The build.sh script installs Chrome and ChromeDriver
2. Selenium will run in headless mode
3. Free tier may have cold starts (first request slow)
4. Consider upgrading to paid tier for better performance
