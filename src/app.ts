import express, { Request, Response } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { ImageProcessor } from './services/ImageProcessor';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const imageProcessor = new ImageProcessor();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'nim8us API',
      version: '1.0.0',
      description: 'nim8us API for image certification and verification',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/app.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// In-memory "database" for demo
const certificates = new Map();
const ftsoData = {
  usdPriceE6: 23456, // $0.023456
  ftsoRoundId: 1234567,
  requiredFLR: "426940639269406", // ~0.43 FLR
  timestamp: Math.floor(Date.now() / 1000)
};

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /v1/ftso/price:
 *   get:
 *     summary: Get FTSO price information
 *     description: Returns the current FTSO price information with mock data
 *     responses:
 *       200:
 *         description: Successful response with FTSO price data
 */
// Mock FTSO price endpoint
app.get('/v1/ftso/price', (req: Request, res: Response) => {
  // Simulate price fluctuation
  const basePrice = 23456;
  const fluctuation = Math.random() * 2000 - 1000; // ±$0.001
  const currentPrice = Math.max(10000, basePrice + fluctuation);
  
  const mockData = {
    ...ftsoData,
    usdPriceE6: Math.floor(currentPrice),
    ftsoRoundId: ftsoData.ftsoRoundId + Math.floor((Date.now() - 1640995200000) / 1800), // ~every 30 min
    requiredFLR: ((10000 * 1e18) / currentPrice).toString(),
    timestamp: Math.floor(Date.now() / 1000)
  };
  
  res.json(mockData);
});

/**
 * @swagger
 * /v1/certify:
 *   post:
 *     summary: Certify an image
 *     description: Process and certify an image, storing its hash and metadata
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - publisher
 *               - method
 *             properties:
 *               image:
 *                 type: string
 *                 description: Base64 encoded image data
 *               publisher:
 *                 type: string
 *                 description: Publisher identifier
 *               method:
 *                 type: string
 *                 description: Certification method
 *               modelId:
 *                 type: string
 *                 description: Optional AI model ID used for generation
 *     responses:
 *       200:
 *         description: Successful certification
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
// Mock certification endpoint
app.post('/v1/certify', async (req: Request, res: Response) => {
  try {
    const { image, publisher, method, modelId } = req.body;
    
    if (!image || !publisher || !method) {
      return res.status(400).json({ 
        error: 'Missing required fields: image, publisher, method' 
      });
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Process image
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');
    const { contentHash, metadata } = await imageProcessor.normalize(imageBuffer);
    
    // Check for "duplicates"
    if (certificates.has(contentHash)) {
      const existing = certificates.get(contentHash);
      return res.json({ 
        proofId: existing.proofId, 
        status: 'duplicate',
        certificate: existing
      });
    }
    
    // Generate mock blockchain data
    const proofId = contentHash;
    const mockTxHash = '0x' + crypto.randomBytes(32).toString('hex');
    const mockXrplTx = crypto.randomBytes(32).toString('hex').toUpperCase();
    
    const certificateData = {
      proofId,
      contentHash,
      publisher,
      method,
      modelId: modelId || null,
      flareTx: mockTxHash,
      xrplTx: mockXrplTx,
      ftsoRoundId: ftsoData.ftsoRoundId,
      usdPriceE6: ftsoData.usdPriceE6,
      feePaidFLR: ftsoData.requiredFLR,
      metadata,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      imageSize: imageBuffer.length
    };
    
    // Store in mock database
    certificates.set(contentHash, certificateData);
    
    res.json({
      proofId,
      flareTx: mockTxHash,
      xrplTx: mockXrplTx,
      ftsoRoundId: ftsoData.ftsoRoundId,
      usdPriceE6: ftsoData.usdPriceE6,
      feePaidFLR: ftsoData.requiredFLR,
      proofLink: `${req.protocol}://${req.get('host')}/verify?hash=${contentHash}`,
      status: 'confirmed'
    });
    
  } catch (error: any) {
    console.error('Certification failed:', error);
    res.status(500).json({ 
      error: 'Certification failed', 
      details: error.message 
    });
  }
});

/**
 * @swagger
 * /v1/verify/{hash}:
 *   get:
 *     summary: Verify content by hash
 *     description: Verify content authenticity using its content hash
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *         description: Content hash to verify
 *     responses:
 *       200:
 *         description: Verification result
 */
// Mock verification by hash
app.get('/v1/verify/:hash', (req: Request, res: Response) => {
  const { hash } = req.params;
  
  const certificate = certificates.get(hash);
  
  if (!certificate) {
    return res.json({ status: 'unknown' });
  }
  
  res.json({
    status: certificate.revoked ? 'revoked' : 'verified',
    certificate: {
      proofId: certificate.proofId,
      contentHash: certificate.contentHash,
      publisher: certificate.publisher,
      method: certificate.method,
      ftsoRoundId: certificate.ftsoRoundId,
      usdPriceE6: certificate.usdPriceE6,
      createdAt: certificate.createdAt,
    },
    explorers: {
      flare: `https://coston2.testnet.flarescan.com/tx/${certificate.flareTx}`,
      xrpl: `https://testnet.xrpl.org/transactions/${certificate.xrplTx}`
    }
  });
});

/**
 * @swagger
 * /v1/verify-image:
 *   post:
 *     summary: Verify image authenticity
 *     description: Verify image by normalizing, hashing, and comparing to stored certificates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 description: Base64 encoded image data
 *     responses:
 *       200:
 *         description: Verification result
 *       400:
 *         description: Missing image
 *       500:
 *         description: Server error
 */
// Mock image verification with similarity
app.post('/v1/verify-image', async (req: Request, res: Response) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');
    const { contentHash } = await imageProcessor.normalize(imageBuffer);
    
    // Check for exact match first
    if (certificates.has(contentHash)) {
      const certificate = certificates.get(contentHash);
      return res.json({
        status: certificate.revoked ? 'revoked' : 'verified',
        certificate,
        method: 'direct_hash'
      });
    }
    
    // Simulate "finding similar" image for demo
    const allCerts = Array.from(certificates.values());
    if (allCerts.length > 0) {
      // Pick a random existing certificate and simulate modification detection
      const original = allCerts[Math.floor(Math.random() * allCerts.length)];
      
      // Check if image size suggests modification
      if (imageProcessor.isLikelyModified(original.imageSize, imageBuffer.length)) {
        const similarity = await imageProcessor.calculateSimilarity(
          Buffer.alloc(original.imageSize), // Mock original
          imageBuffer
        );
        
        return res.json({
          status: original.revoked ? 'revoked' : 'modified',
          certificate: original,
          method: 'similarity_detection',
          similarity: {
            ssimScore: similarity.ssimScore,
            pixelDifference: similarity.pixelDifference
          }
        });
      }
    }
    
    res.json({ status: 'unknown' });
    
  } catch (error: any) {
    console.error('Image verification failed:', error);
    res.status(500).json({ 
      error: 'Image verification failed', 
      details: error.message 
    });
  }
});

/**
 * @swagger
 * /v1/revoke:
 *   post:
 *     summary: Revoke a certificate
 *     description: Mark a certificate as revoked with a reason
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - proofId
 *               - reason
 *             properties:
 *               proofId:
 *                 type: string
 *                 description: The ID of the proof to revoke
 *               reason:
 *                 type: string
 *                 description: Reason for revocation
 *               replacementProofId:
 *                 type: string
 *                 description: Optional ID of a replacement proof
 *     responses:
 *       200:
 *         description: Successful revocation
 *       404:
 *         description: Certificate not found
 */
// Mock revocation
app.post('/v1/revoke', (req: Request, res: Response) => {
  const { proofId, reason, replacementProofId } = req.body;
  
  const certificate = certificates.get(proofId);
  if (!certificate) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  
  certificate.revoked = true;
  certificate.revokeReason = reason;
  certificate.replacementProofId = replacementProofId;
  certificate.revokedAt = new Date().toISOString();
  
  res.json({
    success: true,
    revokeTx: '0x' + crypto.randomBytes(32).toString('hex'),
    proofId,
    reason
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: API health check
 *     description: Returns the current status of the API
 *     responses:
 *       200:
 *         description: API status information
 */
// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    certificates: certificates.size,
    demo: true
  });
});

/**
 * @swagger
 * /demo/stats:
 *   get:
 *     summary: Get demo statistics
 *     description: Returns statistics about the demo environment
 *     responses:
 *       200:
 *         description: Demo statistics
 */
// Demo data endpoint
app.get('/demo/stats', (req: Request, res: Response) => {
  res.json({
    totalCertificates: certificates.size,
    ftsoRound: ftsoData.ftsoRoundId,
    usdPrice: ftsoData.usdPriceE6 / 1000000,
    recentCertificates: Array.from(certificates.values()).slice(-5)
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 nim8us DEMO API running on port ${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/health`);
  console.log(`💰 FTSO: http://localhost:${PORT}/v1/ftso/price`);
  console.log(`📊 Demo stats: http://localhost:${PORT}/demo/stats`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});

export default app;
