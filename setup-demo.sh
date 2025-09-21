#!/bin/bash
# setup-demo.sh

echo "🎬 Setting up nim8us demo..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
cd nim8us-contracts && npm install && cd ..
cd src && npm install && cd ..
cd frontend && npm install && cd ..

# 2. Compile contracts
echo "🔧 Compiling smart contracts..."
cd nim8us-contracts
npx hardhat compile
npx hardhat test
cd ..

# 3. Start backend
echo "🚀 Starting demo API..."
cd src
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# 4. Start frontend
echo "🎨 Starting demo frontend..."
cd frontend
REACT_APP_DEMO_MODE=true npm start &
FRONTEND_PID=$!
cd ..

echo "✅ Demo ready!"
echo "🔗 Frontend: http://localhost:3000"
echo "🔗 API: http://localhost:3001"
echo ""
echo "Press any key to stop demo..."
read -n 1

# Clean shutdown
kill $BACKEND_PID $FRONTEND_PID
