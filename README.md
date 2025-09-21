# nim8us - Anti-Deepfake Provenance System

> Making deepfakes irrelevant by proving what's real

## 🎯 What It Does

nim8us creates tamper-proof certificates for images, especially to combat deepfakes:

- **Companies** can prove content authenticity  
- **Platforms** can verify images before publishing
- **Users** can check if images are real or fake

## 🏗️ Architecture

- **Flare Smart Contracts**: Immutable provenance records + FTSO pricing
- **XRPL NFTs**: Tradeable authenticity certificates  
- **Cross-Chain**: Programmable liquidity for verified content

## 🚀 Quick Demo

```bash
# Setup (5 minutes)
./setup-demo.sh

# Visit http://localhost:3000
# Drag images to verify authenticity
```

### 🎬 Demo Flow
- Upload authentic image → ✅ VERIFIED
- Upload modified image → ⚠️ MODIFIED (shows changes)
- Upload unknown image → ❓ UNKNOWN
- Check blockchain proof → Links to Flare + XRPL

## 🛠️ Technical Components

### Backend API (Express + TypeScript)
- Image processing and normalization
- Content hash generation
- Similarity detection for modified images
- FTSO price simulation

### Smart Contracts (Solidity)
- ProofRegistry.sol: Main contract for image certification
- Uses FTSO for price oracles
- Creates tamper-proof provenance records

### Frontend (React + TypeScript)
- Drag-and-drop interface
- Realtime verification results
- Blockchain explorer integration
- Demo mode for presentations

## 📋 Development Setup

### Prerequisites
- Node.js 16+
- npm
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/Faith-Rounds/nim8us.git
cd nim8us
```

2. Install dependencies
```bash
# Install contract dependencies
cd nim8us-contracts
npm install
cd ..

# Install backend dependencies
cd src
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. Start development servers
```bash
# Terminal 1: Start backend API
cd src
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start
```

4. Visit http://localhost:3000 to see the application

## 💡 Use Cases

- **Media Organizations**: Verify photos before publishing
- **Legal Systems**: Establish digital evidence provenance
- **Social Platforms**: Automatically flag unverified content
- **Creative Industries**: Protect original digital assets
- **NFT Markets**: Ensure authenticity of digital assets
