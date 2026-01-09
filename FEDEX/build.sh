#!/usr/bin/env bash
# Install Chrome and ChromeDriver for Selenium
# Updated for modern Debian/Ubuntu (apt-key is deprecated)

set -e  # Exit on error

echo "📦 Installing Chrome dependencies..."

# Update package list
apt-get update

# Install dependencies for Chrome
apt-get install -y \
    wget \
    gnupg \
    unzip \
    curl \
    ca-certificates

echo "🔑 Adding Google Chrome repository..."

# Add Google's signing key (modern method)
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | \
    gpg --dearmor -o /usr/share/keyrings/google-chrome-keyring.gpg

# Add Chrome repository with signed-by
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | \
    tee /etc/apt/sources.list.d/google-chrome.list

echo "📥 Installing Google Chrome..."

# Update and install Chrome
apt-get update
apt-get install -y google-chrome-stable

echo "🚗 Installing ChromeDriver..."

# Get Chrome version
CHROME_VERSION=$(google-chrome --version | awk '{print $3}' | cut -d '.' -f 1)
echo "Chrome version: $CHROME_VERSION"

# Get matching ChromeDriver version
CHROMEDRIVER_VERSION=$(curl -s "https://googlechromelabs.github.io/chrome-for-testing/LATEST_RELEASE_$CHROME_VERSION")
echo "ChromeDriver version: $CHROMEDRIVER_VERSION"

# Download and install ChromeDriver
wget -q "https://storage.googleapis.com/chrome-for-testing-public/$CHROMEDRIVER_VERSION/linux64/chromedriver-linux64.zip"
unzip -q chromedriver-linux64.zip
chmod +x chromedriver-linux64/chromedriver
mv chromedriver-linux64/chromedriver /usr/local/bin/chromedriver
rm -rf chromedriver-linux64.zip chromedriver-linux64

echo "🧹 Cleaning up..."

# Clean up
apt-get clean
rm -rf /var/lib/apt/lists/*

echo "✅ Chrome and ChromeDriver installed successfully!"
echo "Chrome: $(google-chrome --version)"
echo "ChromeDriver: $(chromedriver --version)"
