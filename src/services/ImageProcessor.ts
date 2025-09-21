import sharp from 'sharp';
import crypto from 'crypto';

export interface NormalizedImage {
  contentHash: string;
  normalizedBuffer: Buffer;
  metadata: {
    width: number;
    height: number;
    format: string;
  };
}

export class ImageProcessor {
  
  async normalize(imageBuffer: Buffer): Promise<NormalizedImage> {
    try {
      // Normalize image for consistent hashing
      const normalized = await sharp(imageBuffer)
        .rotate() // Auto-rotate based on EXIF orientation
        .resize(1024, 1024, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .toColorspace('srgb')
        .png({ quality: 100, compressionLevel: 0 })
        .withMetadata({ exif: {} }) // Reset EXIF data
        .toBuffer();
      
      // Generate content hash
      const contentHash = crypto
        .createHash('sha256')
        .update(normalized)
        .digest('hex');
      
      const metadata = await sharp(normalized).metadata();
      
      return {
        contentHash,
        normalizedBuffer: normalized,
        metadata: {
          width: metadata.width || 0,
          height: metadata.height || 0,
          format: 'png'
        }
      };
      
    } catch (error: any) {
      throw new Error(`Image normalization failed: ${error.message}`);
    }
  }
  
  // Simple similarity check for demo
  async calculateSimilarity(
    image1Buffer: Buffer,
    image2Buffer: Buffer
  ): Promise<{
    ssimScore: number;
    pixelDifference: number;
  }> {
    try {
      // For demo: just compare file sizes as proxy for similarity
      const sizeDiff = Math.abs(image1Buffer.length - image2Buffer.length);
      const avgSize = (image1Buffer.length + image2Buffer.length) / 2;
      const similarity = Math.max(0, 1 - (sizeDiff / avgSize));
      
      return { 
        ssimScore: similarity, 
        pixelDifference: 1 - similarity 
      };
      
    } catch (error: any) {
      throw new Error(`Similarity calculation failed: ${error.message}`);
    }
  }
  
  // Check if image "looks" modified (for demo)
  isLikelyModified(originalSize: number, currentSize: number): boolean {
    const sizeDifference = Math.abs(originalSize - currentSize) / originalSize;
    return sizeDifference > 0.1; // 10% size difference suggests modification
  }
}

export default ImageProcessor;
