import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneAreaProps {
  onDrop: (file: File) => void;
  disabled: boolean;
  demoMode: boolean;
}

export const DropzoneArea: React.FC<DropzoneAreaProps> = ({
  onDrop,
  disabled,
  demoMode
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Verify Image Provenance
      </h2>
      
      <div 
        {...getRootProps()} 
        className={`border-2 ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'
        } rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-blue-50 hover:border-blue-400 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        
        {isDragActive ? (
          <p className="text-lg text-blue-500 text-center font-medium">
            Drop your image here...
          </p>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-600 font-medium">
              Drop your image here, or click to select
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPEG, PNG, WebP
            </p>
            {demoMode && (
              <p className="text-xs text-blue-500 mt-3">
                Hint: Try filenames with "modified", "fake", or "unknown" to see different results in demo mode.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
