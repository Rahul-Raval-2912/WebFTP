#!/bin/bash

echo "🚀 WebFTP Project Setup"
echo "======================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🔨 Compiling TypeScript frontend..."
npm run build:frontend

if [ $? -eq 0 ]; then
    echo "✅ Frontend compiled successfully"
else
    echo "❌ Frontend compilation failed"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Open Terminal 1 and run: npm start"
echo "2. Open Terminal 2 and run: npm run frontend"
echo "3. Open browser: http://localhost:8080"
echo ""
echo "📖 See DEMO_GUIDE.md for presentation steps"
