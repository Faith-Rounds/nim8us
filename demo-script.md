# nim8us Demo Script (3-4 minutes)

## Opening Hook (30 seconds)
"Deepfakes are everywhere. Companies can't tell what's real anymore. 
Current detection tools fail as AI gets better. 

We built nim8us - instead of detecting fakes, we prove what's real."

## Problem Statement (30 seconds)
- Show example of viral deepfake news
- "News organizations publish fake images by accident"
- "Legal systems can't trust digital evidence"
- "Social platforms overwhelmed by fake content"

## Solution Demo (2 minutes)

### 1. Live FTSO Pricing (20 seconds)
- Point to FTSO widget: "Live decentralized pricing from Flare"
- "Certificate costs $0.01 USD, but fee adjusts automatically"
- "Currently Round #1,234,567 at $0.023456 per FLR"

### 2. Easy Verification (30 seconds)
- Drag authentic image: "One-click verification"
- Show "VERIFIED ✓" result
- Click explorer links: "Immutable proof on Flare blockchain"
- "NFT on XRPL makes provenance tradeable"

### 3. Deepfake Detection (30 seconds)
- Drag modified image: "Modified image detected"
- Show "MODIFIED ⚠" with similarity scores
- Click "What Changed?": "Shows exactly what was altered"

### 4. Cross-Chain Value (30 seconds)
- "Flare provides smart contracts + real-time pricing"
- "XRPL provides fast settlement + tradeable NFTs"
- "Together: programmable liquidity for authenticity"

### 5. Enterprise Use Cases (20 seconds)
- "News orgs verify photos before publishing"
- "Platforms auto-flag unverified content"
- "Legal systems get tamper-proof evidence"

## Closing (30 seconds)
"We're not trying to detect deepfakes - we're making them irrelevant 
by proving what's real. Built on Flare + XRPL for global trust."

# Presentation Tips

## Demo Preparation
1. Run `./setup-demo.sh` at least 5 minutes before presentation
2. Have all demo images ready in the demo-assets folder
3. Test the verification flow with each image type once before presenting

## Technical Talking Points
- **Content Hash**: "We create a cryptographic fingerprint of images that remains consistent despite minor format changes"
- **Normalization**: "Our system normalizes images to focus on content, not file format"
- **Smart Contract**: "Immutable records on Flare blockchain with FTSO price oracle integration"
- **Cross-Chain**: "NFTs on XRPL provide tradeable proof of authenticity with fast settlement"

## Questions & Answers

### "How does this differ from other anti-deepfake tools?"
"Most tools try to detect fakes after they're created - an endless arms race. We focus on proving what's real from the source."

### "What if someone takes a screenshot of a verified image?"
"Screenshots or re-captures will be detected as modified from the original, similar to how a photocopy differs from an original document."

### "How do you handle privacy concerns?"
"We only store content hashes on-chain, not the images themselves. The system is opt-in for publishers who want to prove authenticity."

### "What are the costs to use nim8us?"
"Creating certificates costs about $0.01 USD worth of FLR tokens. Verification is free for end users."
