import { ImageProcessor } from '../services/ImageProcessor';
import fs from 'fs/promises';
import path from 'path';

describe('ImageProcessor', () => {
  let imageProcessor: ImageProcessor;
  
  beforeEach(() => {
    imageProcessor = new ImageProcessor();
  });
  
  // Helper to create a test image buffer
  const createTestImageBuffer = async (color: string, width = 100, height = 100): Promise<Buffer> => {
    // Create a simple SVG with the specified color
    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
      </svg>
    `;
    
    // Use sharp to convert SVG to PNG buffer
    const sharp = require('sharp');
    return sharp(Buffer.from(svgContent))
      .png()
      .toBuffer();
  };
  
  describe('normalize', () => {
    it('should normalize an image and generate a content hash', async () => {
      // Create a test image
      const imageBuffer = await createTestImageBuffer('red');
      
      // Normalize the image
      const result = await imageProcessor.normalize(imageBuffer);
      
      // Assertions
      expect(result.contentHash).toBeDefined();
      expect(result.contentHash.length).toBe(64); // SHA-256 hash length
      expect(result.normalizedBuffer).toBeInstanceOf(Buffer);
      expect(result.metadata.width).toBeGreaterThan(0);
      expect(result.metadata.height).toBeGreaterThan(0);
      expect(result.metadata.format).toBe('png');
    });
    
    it('should create the same hash for visually identical images', async () => {
      // Create two identical test images
      const image1 = await createTestImageBuffer('blue');
      const image2 = await createTestImageBuffer('blue');
      
      // Normalize both images
      const result1 = await imageProcessor.normalize(image1);
      const result2 = await imageProcessor.normalize(image2);
      
      // Hashes should be identical
      expect(result1.contentHash).toBe(result2.contentHash);
    });
    
    it('should create different hashes for different images', async () => {
      // Create two different test images
      const image1 = await createTestImageBuffer('blue');
      const image2 = await createTestImageBuffer('red');
      
      // Normalize both images
      const result1 = await imageProcessor.normalize(image1);
      const result2 = await imageProcessor.normalize(image2);
      
      // Hashes should be different
      expect(result1.contentHash).not.toBe(result2.contentHash);
    });
  });
  
  describe('calculateSimilarity', () => {
    it('should calculate similarity between identical images', async () => {
      const image = await createTestImageBuffer('green');
      
      const similarity = await imageProcessor.calculateSimilarity(image, image);
      
      expect(similarity.ssimScore).toBe(1);
      expect(similarity.pixelDifference).toBe(0);
    });
    
    it('should calculate similarity between different images', async () => {
      const image1 = await createTestImageBuffer('green');
      const image2 = await createTestImageBuffer('blue');
      
      const similarity = await imageProcessor.calculateSimilarity(image1, image2);
      
      expect(similarity.ssimScore).toBeLessThan(1);
      expect(similarity.pixelDifference).toBeGreaterThan(0);
    });
  });
  
  describe('isLikelyModified', () => {
    it('should detect when an image is likely modified', () => {
      // Original size and 15% larger size
      const originalSize = 1000;
      const modifiedSize = 1150;
      
      const result = imageProcessor.isLikelyModified(originalSize, modifiedSize);
      
      expect(result).toBe(true);
    });
    
    it('should not flag minor size differences as modified', () => {
      // Original size and 5% larger size (below threshold)
      const originalSize = 1000;
      const slightlyDifferentSize = 1050;
      
      const result = imageProcessor.isLikelyModified(originalSize, slightlyDifferentSize);
      
      expect(result).toBe(false);
    });
  });
});
