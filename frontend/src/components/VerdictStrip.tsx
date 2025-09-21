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
      case 'verified': return {
        bgColor: 'bg-nim-green-50/80 backdrop-blur-sm',
        borderColor: 'border-nim-green-500',
        textColor: 'text-nim-green-700',
        iconBg: 'bg-nim-green-100',
        iconColor: 'text-nim-green-600',
      };
      case 'modified': return {
        bgColor: 'bg-nim-orange-50/80 backdrop-blur-sm',
        borderColor: 'border-nim-orange-500',
        textColor: 'text-nim-orange-700',
        iconBg: 'bg-nim-orange-100',
        iconColor: 'text-nim-orange-600',
      };
      case 'revoked': return {
        bgColor: 'bg-red-50/80 backdrop-blur-sm',
        borderColor: 'border-red-500',
        textColor: 'text-red-700',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
      };
      case 'unknown':
      default: return {
        bgColor: 'bg-nim-silver-50/80 backdrop-blur-sm',
        borderColor: 'border-nim-silver-500',
        textColor: 'text-nim-silver-700',
        iconBg: 'bg-nim-silver-100',
        iconColor: 'text-nim-silver-600',
      };
    }
  };

  const getStatusIcon = () => {
    const colors = getStatusColor();
    
    switch (result.status) {
      case 'verified': 
        return (
          <div className={`flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full ${colors.iconBg} sm:h-20 sm:w-20 shadow-lg animate-fade-in`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`h-10 w-10 ${colors.iconColor}`}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
        );
      case 'modified': 
        return (
          <div className={`flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full ${colors.iconBg} sm:h-20 sm:w-20 shadow-lg animate-fade-in`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`h-10 w-10 ${colors.iconColor}`}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'revoked': 
        return (
          <div className={`flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full ${colors.iconBg} sm:h-20 sm:w-20 shadow-lg animate-fade-in`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`h-10 w-10 ${colors.iconColor}`}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={`flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full ${colors.iconBg} sm:h-20 sm:w-20 shadow-lg animate-fade-in`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`h-10 w-10 ${colors.iconColor}`}>
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
    <div className={`border-l-4 rounded-xl shadow-lg ${getStatusColor().borderColor} ${getStatusColor().bgColor} animate-slide-up`}>
      <div className="p-6">
        <div className="flex items-start">
          {getStatusIcon()}
          <div className="ml-4 animate-slide-in" style={{ animationDelay: '100ms' }}>
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
                      className="inline-flex items-center px-3 py-1.5 border border-nim-silver-200 text-xs font-medium rounded-full text-nim-silver-700 bg-white hover:bg-nim-silver-50 transition-all duration-300 shadow-sm"
                    >
                      <svg className="mr-1.5 h-4 w-4 text-nim-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
                      View on Flare
                    </a>
                    <a 
                      href={result.explorers.xrpl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-nim-silver-200 text-xs font-medium rounded-full text-nim-silver-700 bg-white hover:bg-nim-silver-50 transition-all duration-300 shadow-sm"
                    >
                      <svg className="mr-1.5 h-4 w-4 text-nim-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
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
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white bg-nim-green-600 hover:bg-nim-green-700 transition-colors duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Proof Link
                </button>
              )}
              
              {demoMode && (
                <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-nim-silver-600 bg-white/80 backdrop-blur-sm rounded-full border border-nim-silver-200 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-nim-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
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
