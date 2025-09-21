import React from 'react';

interface VerdictStripProps {
  result: any;
  onCopyLink: () => void;
  demoMode: boolean;
}

export const VerdictStrip: React.FC<VerdictStripProps> = ({ 
  result, 
  onCopyLink,
  demoMode
}) => {
  const getStatusColor = () => {
    switch (result.status) {
      case 'verified': return 'bg-green-100 border-green-500';
      case 'modified': return 'bg-yellow-100 border-yellow-500';
      case 'revoked': return 'bg-red-100 border-red-500';
      case 'unknown':
      default: return 'bg-gray-100 border-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (result.status) {
      case 'verified': 
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:h-16 sm:w-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'modified': 
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:h-16 sm:w-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-yellow-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'revoked': 
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:h-16 sm:w-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 sm:h-16 sm:w-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusTitle = () => {
    switch (result.status) {
      case 'verified': return 'Verified Original';
      case 'modified': return 'Likely Modified Content';
      case 'revoked': return 'Certificate Revoked';
      case 'unknown':
      default: return 'Unknown Content';
    }
  };

  const getStatusDescription = () => {
    switch (result.status) {
      case 'verified': 
        return 'This image matches our verification records and appears to be an unmodified original.';
      case 'modified': 
        return result.similarity ? 
          `This image appears to be a modified version of a verified original (${Math.round(result.similarity.ssimScore * 100)}% similar).` :
          'This image appears to be a modified version of a verified original.';
      case 'revoked': 
        return result.revocation ? 
          `Certificate was revoked: ${result.revocation.reason}` :
          'This certificate has been revoked by the publisher.';
      case 'unknown':
      default: 
        return 'This content has not been previously registered in our verification system.';
    }
  };

  return (
    <div className={`border-l-4 rounded-lg shadow-lg ${getStatusColor()}`}>
      <div className="p-6">
        <div className="flex items-start">
          {getStatusIcon()}
          <div className="ml-4">
            <h3 className="text-lg font-medium">
              {getStatusTitle()}
            </h3>
            <p className="mt-1 text-gray-700">
              {getStatusDescription()}
            </p>
            
            {result.certificate && (
              <div className="mt-4 bg-white bg-opacity-50 rounded-md p-3 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Certificate Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Publisher:</span>{' '}
                    <span className="font-mono">{result.certificate.publisher?.substring(0, 10)}...{result.certificate.publisher?.slice(-8)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Method:</span>{' '}
                    <span>{result.certificate.method}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Verified:</span>{' '}
                    <span>{new Date(result.certificate.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">FTSO Round:</span>{' '}
                    <span>{result.certificate.ftsoRoundId}</span>
                  </div>
                </div>
                
                {/* Blockchain links */}
                {result.explorers && (
                  <div className="mt-3 space-x-2">
                    <a 
                      href={result.explorers.flare} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View on Flare
                    </a>
                    <a 
                      href={result.explorers.xrpl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View on XRPL
                    </a>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4 flex flex-wrap gap-2">
              {result.certificate && (
                <button
                  onClick={onCopyLink}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Copy Proof Link
                </button>
              )}
              
              {demoMode && (
                <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md">
                  Demo Mode: {result.method || 'standard'} verification
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
