# nim8us - Anti-Deepfake Provenance System

> Making deepfakes irrelevant by proving what's real

## 📝 Summary

nim8us establishes trust in digital media through cross-chain provenance verification, combining Flare's price oracles with XRPL's NFTs to combat deepfakes.

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

4.Visit http://localhost:3000 to see the application

## 💡 Use Cases

- **Media Organizations**: Verify photos before publishing
- **Legal Systems**: Establish digital evidence provenance
- **Social Platforms**: Automatically flag unverified content
- **Creative Industries**: Protect original digital assets
- **NFT Markets**: Ensure authenticity of digital assets

## 🔍 Full Description

### The Problem

Deepfakes and manipulated media are rapidly eroding trust in digital content. Current approaches that try to detect fake images are in a constant arms race with ever-improving AI generation capabilities. Rather than focusing on detecting what's fake, nim8us offers a paradigm shift by definitively proving what's real.

Key problems nim8us addresses:

1. **Trust Gap**: News organizations, legal systems, and social platforms struggle to verify the authenticity of digital content
2. **Detection Limitations**: AI-based deepfake detectors constantly need updates as generation technology improves
3. **Provenance Tracking**: No standardized way to track the origin and history of digital content
4. **Cross-Platform Verification**: Lack of interoperable standards for content authentication

### Our Solution

nim8us uses a cross-chain approach leveraging the complementary strengths of Flare and XRPL:

**Flare Network Integration:**

- Smart contracts for immutable certification records
- FTSO price feeds to dynamically set certification fees
- State Connector to provide cross-chain interoperability
- Attestation layer for verifying content without revealing it

**XRPL Integration:**

- NFTs for tradeable proof of authenticity
- Fast and low-cost settlement of authenticity certificates
- Long-term archival of verification records
- Decentralized discovery of authentic content

By combining these blockchain technologies, nim8us creates an unbroken chain of provenance that makes verification as simple as taking a photo. We're not trying to detect what's fake - we're proving what's real.

## 🧰 Technical Implementation

### Tech Stack & SDKs

- **Flare SDK**: Used for smart contract interactions and FTSO queries
- **FTSO Data Provider API**: For real-time price data to calculate dynamic fees
- **Flare State Connector**: Enabling cross-chain verification of image certificates
- **XRPL JS SDK**: For NFT minting and querying of authenticity certificates
- **XRPL Hooks**: (Planned) For on-ledger verification logic
- **Smart Contracts**: Solidity-based verification and certification contracts
- **Backend**: Node.js, Express, TypeScript for API layer
- **Frontend**: React, TypeScript, TailwindCSS with glassmorphism design

### Unique Cross-Chain Features

1. **Flare + XRPL Synergy**: Flare's smart contract capabilities combined with XRPL's efficient transaction processing creates a unique solution impossible on either chain alone

2. **FTSO-Based Dynamic Pricing**: Leverages Flare's decentralized price oracles to ensure certification fees remain stable in USD terms despite cryptocurrency volatility

3. **Cross-Chain Attestations**: Images certified on Flare can be verified on XRPL and vice versa, creating a seamless verification experience

4. **Trustless Verification**: The verification process is entirely on-chain and doesn't require trusting a central authority

## 🎤 Presentation

[View Presentation Slides](https://www.canva.com/design/DAGzmRWoC58/-REueo_-FAgAB8XaYU7iSQ/edit?utm_content=DAGzmRWoC58&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## 🎬 Demo

### Video Demonstration

[Watch Full Demo Video](https://drive.google.com/file/d/1rDA7Vr4vZxzWBAA8NRIM_i8i2Kpt7KI2/view?usp=sharing)


### Code Walkthrough

[Watch Full Demo Video]([https://drive.google.com/file/d/1rDA7Vr4vZxzWBAA8NRIM_i8i2Kpt7KI2/view?usp=sharing](https://drive.google.com/file/d/1nQRKyui01OQub_WetWPRl7DicLAXHKBc/view?usp=sharing))

### Screenshots

- <img width="1026" height="888" alt="Screenshot 2025-09-21 at 11 51 21 AM" src="https://github.com/user-attachments/assets/e2c2e026-9c8d-40c6-a372-70ff8d72af46" />

- <img width="1099" height="835" alt="Screenshot 2025-09-21 at 11 51 33 AM" src="https://github.com/user-attachments/assets/7336db1f-3fc5-4d93-9697-2914b95a50db" />

- <img width="1096" height="877" alt="Screenshot 2025-09-21 at 11 51 10 AM" src="https://github.com/user-attachments/assets/93335146-7838-4fc6-8d81-2d41677b0091" />
