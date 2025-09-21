import React, { useState } from 'react';

interface CertificationFormProps {
  imageData: string | null;
  onSubmit: (formData: {
    image: string;
    publisher: string;
    method: string;
    modelId?: string;
  }) => void;
  loading: boolean;
  onCancel: () => void;
}

export const CertificationForm: React.FC<CertificationFormProps> = ({
  imageData,
  onSubmit,
  loading,
  onCancel
}) => {
  const [publisher, setPublisher] = useState<string>('');
  const [method, setMethod] = useState<string>('CAMERA');
  const [modelId, setModelId] = useState<string>('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!publisher.trim()) {
      newErrors.publisher = 'Publisher is required';
    }
    
    if (!method) {
      newErrors.method = 'Method is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && imageData) {
      const formData = {
        image: imageData,
        publisher,
        method,
        ...(modelId && { modelId })
      };
      
      onSubmit(formData);
    }
  };

  return (
    <div className="animate-fade-in backdrop-blur-sm bg-white/80 rounded-xl shadow-lg p-6 border border-nim-silver-200">
      <h3 className="text-xl font-bold text-nim-silver-800 mb-4">Certify Image</h3>
      
      {imageData && (
        <div className="mb-6">
          <div className="aspect-square w-full max-h-48 overflow-hidden rounded-lg mb-2 flex items-center justify-center bg-nim-silver-100">
            <img 
              src={imageData} 
              alt="Image to certify" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <p className="text-xs text-nim-silver-500 text-center">
            Image loaded successfully
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="publisher" className="block text-sm font-medium text-nim-silver-700">
            Publisher Name or ID <span className="text-nim-orange-500">*</span>
          </label>
          <input
            type="text"
            id="publisher"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.publisher ? 'border-red-300' : 'border-nim-silver-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-nim-green-500 focus:border-nim-green-500`}
            placeholder="Your name, wallet address, or company"
          />
          {errors.publisher && (
            <p className="mt-1 text-sm text-red-600">{errors.publisher}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="method" className="block text-sm font-medium text-nim-silver-700">
            Certification Method <span className="text-nim-orange-500">*</span>
          </label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.method ? 'border-red-300' : 'border-nim-silver-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-nim-green-500 focus:border-nim-green-500`}
          >
            <option value="CAMERA">Camera (Original Photo)</option>
            <option value="SCREENSHOT">Screenshot</option>
            <option value="AI_GENERATED">AI Generated</option>
            <option value="ILLUSTRATION">Illustration</option>
          </select>
          {errors.method && (
            <p className="mt-1 text-sm text-red-600">{errors.method}</p>
          )}
        </div>
        
        {method === 'AI_GENERATED' && (
          <div>
            <label htmlFor="modelId" className="block text-sm font-medium text-nim-silver-700">
              AI Model ID
            </label>
            <input
              type="text"
              id="modelId"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-nim-silver-300 rounded-md shadow-sm focus:outline-none focus:ring-nim-green-500 focus:border-nim-green-500"
              placeholder="e.g., DALL-E 3, Midjourney v5, etc."
            />
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-nim-silver-300 rounded-md text-nim-silver-700 hover:bg-nim-silver-50 focus:outline-none focus:ring-2 focus:ring-nim-green-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-nim-green-600 hover:bg-nim-green-700 focus:outline-none focus:ring-2 focus:ring-nim-green-500 focus:ring-offset-2"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              'Certify Image'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
