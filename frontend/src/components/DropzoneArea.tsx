import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneAreaProps {
  onDrop: (file: File) => void;
  disabled: boolean;
  demoMode: boolean;
  mode: 'verify' | 'certify';
}

export const DropzoneArea: React.FC<DropzoneAreaProps> = ({
  onDrop,
  disabled,
  demoMode,
  mode
}) => {
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onDrop(acceptedFiles[0]);
    }
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled
  });

  const getColorClasses = () => {
    if (mode === 'verify') {
      return {
        border: isDragActive ? 'border-nim-green-500 bg-nim-green-50' : 'border-dashed border-nim-silver-300',
        hover: 'hover:bg-nim-green-50 hover:border-nim-green-400',
        icon: 'text-nim-green-500',
        text: isDragActive ? 'text-nim-green-600' : 'text-nim-silver-700'
      };
    } else {
      return {
        border: isDragActive ? 'border-nim-orange-500 bg-nim-orange-50' : 'border-dashed border-nim-silver-300',
        hover: 'hover:bg-nim-orange-50 hover:border-nim-orange-400',
        icon: 'text-nim-orange-500',
        text: isDragActive ? 'text-nim-orange-600' : 'text-nim-silver-700'
      };
    }
  };
  
  const colors = getColorClasses();

  return (
    <div className="backdrop-blur-sm bg-white/80 rounded-xl shadow-lg p-6 border border-nim-silver-100 animate-fade-in">
      <h2 className="text-xl font-semibold text-nim-silver-800 mb-3">
        {mode === 'verify' ? 'Verify Image Authenticity' : 'Certify New Image'}
      </h2>
      
      <div 
        {...getRootProps()} 
        className={`border-2 ${
          colors.border
        } rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          colors.hover
        } ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="mb-4 animate-pulse-slow">
          {mode === 'verify' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-14 h-14 ${colors.icon}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-14 h-14 ${colors.icon}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        
        {isDragActive ? (
          <p className={`text-lg ${colors.text} text-center font-medium animate-slide-up`}>
            Drop your image here...
          </p>
        ) : (
          <div className="text-center">
            <p className={`text-lg ${colors.text} font-medium`}>
              Drop your image here, or click to select
            </p>
            <p className="text-sm text-nim-silver-500 mt-1">
              Supported formats: JPEG, PNG, WebP
            </p>
            {demoMode && (
              <p className={`text-xs ${mode === 'verify' ? 'text-nim-green-500' : 'text-nim-orange-500'} mt-3`}>
                {mode === 'verify' 
                  ? 'Hint: Try filenames with "modified", "fake", or "unknown" to see different results.'
                  : 'Hint: Upload any image to create a new certificate in demo mode.'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
