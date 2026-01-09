#!/bin/bash

echo "🚀 Starting AADYAM LOGISTICS Platform..."
echo ""

cd frontend

echo "📦 Installing dependencies (if needed)..."
npm install

echo ""
echo "🎨 Building Tailwind CSS..."
npx tailwindcss -i ./src/index.css -o ./src/output.css

echo ""
echo "🌐 Starting development server..."
echo "The application will open at http://localhost:3000"
echo ""
npm start
