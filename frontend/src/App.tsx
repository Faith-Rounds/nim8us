import React, { useState, useEffect } from 'react';
import { DropzoneArea } from './components/DropzoneArea';
import { VerdictStrip } from './components/VerdictStrip';
import { FTSOWidget } from './components/FTSOWidget';
import { DemoControls } from './components/DemoControls';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';

// Mock data for offline demo
const MOCK_FTSO_DATA = {
  usdPriceE6: 23456,
  ftsoRoundId: 1234567,
  requiredFLR: "426940639269406",
  timestamp: Math.floor(Date.now() / 1000)
};

const MOCK_VERIFIED_RESULT = {
  status: 'verified' as const,
  certificate: {
    proofId: 'abc123def456',
    contentHash: 'hash123',
    publisher: '0x742d35Cc6734C0532925a3b8D23456789AbCdEf00',
    method: 'CAMERA',
    ftsoRoundId: 1234567,
    usdPriceE6: 23456,
    createdAt: new Date().toISOString(),
    imageUrl: ''
  },
  explorers: {
    flare: 'https://coston2.testnet.flarescan.com/tx/0x123...',
    xrpl: 'https://testnet.xrpl.org/transactions/ABC123...'
  },
  method: 'direct_hash' as const
};

const MOCK_MODIFIED_RESULT = {
  ...MOCK_VERIFIED_RESULT,
  status: 'modified' as const,
  method: 'similarity_detection' as const,
  similarity: {
    ssimScore: 0.847,
    pixelDifference: 0.153
  }
};

function App() {
  const [result, setResult] = useState<any>(null);
  const [ftsoData, setFtsoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(DEMO_MODE);

  useEffect(() => {
    if (demoMode) {
      setFtsoData(MOCK_FTSO_DATA);
    } else {
      fetchFTSOData();
      const interval = setInterval(fetchFTSOData, 30000);
      return () => clearInterval(interval);
    }
  }, [demoMode]);

  const fetchFTSOData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/ftso/price`);
      if (response.ok) {
        const data = await response.json();
        setFtsoData(data);
      }
    } catch (error) {
      console.error('Failed to fetch FTSO data:', error);
      // Fallback to mock data
      setFtsoData(MOCK_FTSO_DATA);
    }
  };

  const handleImageDrop = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      if (demoMode) {
        // Demo mode: simulate different results based on filename
        const filename = file.name.toLowerCase();
        if (filename.includes('modified') || filename.includes('fake')) {
          setResult(MOCK_MODIFIED_RESULT);
        } else if (filename.includes('unknown')) {
          setResult({ status: 'unknown' });
        } else {
          setResult(MOCK_VERIFIED_RESULT);
        }
      } else {
        // Real API call
        const base64 = await fileToBase64(file);
        const response = await fetch(`${API_BASE_URL}/v1/verify-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        if (!response.ok) {
          throw new Error(`Verification failed: ${response.statusText}`);
        }

        const result = await response.json();
        setResult(result);
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const copyProofLink = () => {
    if (result?.certificate) {
      const proofLink = `${window.location.origin}/verify?hash=${result.certificate.contentHash}`;
      navigator.clipboard.writeText(proofLink);
      alert('Proof link copied to clipboard!');
    }
  };

  const triggerDemoResult = (resultType: string) => {
    setLoading(true);
    setTimeout(() => {
      switch (resultType) {
        case 'verified':
          setResult(MOCK_VERIFIED_RESULT);
          break;
        case 'modified':
          setResult(MOCK_MODIFIED_RESULT);
          break;
        case 'revoked':
          setResult({
            ...MOCK_VERIFIED_RESULT,
            status: 'revoked',
            revocation: {
              reason: 'Copyright violation',
              revokedAt: new Date().toISOString(),
              replacementProofId: 'replacement123'
            }
          });
          break;
        case 'unknown':
          setResult({ status: 'unknown' });
          break;
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">nim8us Verifier</h1>
              <p className="text-blue-100">Anti-Deepfake Provenance System</p>
            </div>
            {demoMode && (
              <div className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-semibold">
                DEMO MODE
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        
        {/* Demo Controls (for presentation) */}
        {demoMode && (
          <DemoControls 
            onTriggerResult={triggerDemoResult}
            onToggleMode={() => setDemoMode(!demoMode)}
          />
        )}

        {/* FTSO Widget */}
        {ftsoData && <FTSOWidget data={ftsoData} />}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Drop Zone */}
        <div className="mb-8">
          <DropzoneArea 
            onDrop={handleImageDrop}
            disabled={loading}
            demoMode={demoMode}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {demoMode ? 'Analyzing image...' : 'Verifying provenance...'}
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <VerdictStrip 
            result={result}
            onCopyLink={copyProofLink}
            demoMode={demoMode}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-600">
          <p>© 2024 nim8us - Powered by Flare FTSO + XRPL</p>
          <p className="text-sm mt-2">Making deepfakes irrelevant by proving what's real</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
