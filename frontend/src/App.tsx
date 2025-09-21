import React, { useState, useEffect } from 'react';
import { DropzoneArea } from './components/DropzoneArea';
import { VerdictStrip } from './components/VerdictStrip';
import { FTSOWidget } from './components/FTSOWidget';
import { DemoControls } from './components/DemoControls';
import { TabNavigation } from './components/TabNavigation';
import { CertificationForm } from './components/CertificationForm';

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
  const [activeTab, setActiveTab] = useState<'verify' | 'certify'>('verify');
  const [result, setResult] = useState<any>(null);
  const [ftsoData, setFtsoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(DEMO_MODE);
  const [imageData, setImageData] = useState<string | null>(null);

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
    
    try {
      // Convert file to base64 for display and API calls
      const base64 = await fileToBase64(file);
      setImageData(base64);
      
      if (activeTab === 'verify') {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
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
          // Real API call for verification
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
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Operation failed');
      setImageData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCertify = async (formData: { image: string; publisher: string; method: string; modelId?: string }) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      if (demoMode) {
        // Demo mode: always return success
        setResult({
          ...MOCK_VERIFIED_RESULT,
          certificate: {
            ...MOCK_VERIFIED_RESULT.certificate,
            publisher: formData.publisher,
            method: formData.method,
            modelId: formData.modelId || null,
            createdAt: new Date().toISOString()
          },
          status: 'certified'
        });
      } else {
        // Real API call for certification
        const response = await fetch(`${API_BASE_URL}/v1/certify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Certification failed: ${response.statusText}`);
        }

        const result = await response.json();
        setResult(result);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Certification failed');
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
      <header className="bg-gradient-to-br from-nim-silver-800 to-nim-green-900 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center animate-fade-in">
              <div className="mr-3 bg-white/10 backdrop-blur-sm rounded-xl p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-nim-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-0.5">nim8us</h1>
                <p className="text-nim-silver-200 text-sm">Anti-Deepfake Provenance System</p>
              </div>
            </div>
            {demoMode && (
              <div className="bg-nim-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md animate-pulse-slow">
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
        
        {/* Tab Navigation */}
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {error && (
          <div className="mb-6 p-4 bg-nim-orange-50/80 backdrop-blur-sm border border-nim-orange-200 rounded-xl animate-fade-in shadow-sm">
            <p className="text-nim-orange-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          </div>
        )}
        
        {/* Different UI based on active tab and state */}
        {!imageData || activeTab === 'verify' ? (
          // Show Dropzone when no image or in verify mode
          <div className="mb-8">
            <DropzoneArea 
              onDrop={handleImageDrop}
              disabled={loading}
              demoMode={demoMode}
              mode={activeTab}
            />
          </div>
        ) : activeTab === 'certify' && imageData && !result ? (
          // Show certification form when image is uploaded in certify mode
          <CertificationForm
            imageData={imageData}
            onSubmit={handleCertify}
            loading={loading}
            onCancel={() => {
              setImageData(null);
              setError(null);
            }}
          />
        ) : null}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 animate-fade-in">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nim-green-600 mx-auto"></div>
            <p className="mt-4 text-nim-silver-600">
              {demoMode
                ? 'Analyzing image...'
                : activeTab === 'verify'
                  ? 'Verifying provenance...'
                  : 'Certifying image...'
              }
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
      <footer className="bg-nim-silver-50/80 backdrop-blur-sm border-t border-nim-silver-100 mt-16 py-8 shadow-inner">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <span className="bg-nim-green-100 text-nim-green-800 px-3 py-1 rounded-full text-xs font-semibold">Flare FTSO</span>
            <span className="bg-nim-orange-100 text-nim-orange-800 px-3 py-1 rounded-full text-xs font-semibold">XRPL</span>
            <span className="bg-nim-silver-100 text-nim-silver-800 px-3 py-1 rounded-full text-xs font-semibold">Blockchain</span>
          </div>
          <p className="text-nim-silver-600">© 2024 nim8us - Making deepfakes irrelevant</p>
          <p className="text-nim-silver-500 text-sm mt-2">Proving what's real with cross-chain provenance</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
