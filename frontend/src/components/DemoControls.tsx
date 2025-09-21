import React from 'react';

interface DemoControlsProps {
  onTriggerResult: (resultType: string) => void;
  onToggleMode: () => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({ 
  onTriggerResult, 
  onToggleMode 
}) => {
  return (
    <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-800 mb-3">
        🎬 Demo Controls (Presentation Mode)
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
        <button
          onClick={() => onTriggerResult('verified')}
          className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
        >
          ✓ Show Verified
        </button>
        <button
          onClick={() => onTriggerResult('modified')}
          className="px-3 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
        >
          ⚠ Show Modified
        </button>
        <button
          onClick={() => onTriggerResult('revoked')}
          className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          ✗ Show Revoked
        </button>
        <button
          onClick={() => onTriggerResult('unknown')}
          className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
        >
          ? Show Unknown
        </button>
        <button
          onClick={onToggleMode}
          className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          🔄 Live Mode
        </button>
      </div>
      
      <p className="text-xs text-yellow-700">
        Click buttons above to simulate different verification results, or drag images normally.
      </p>
    </div>
  );
};
