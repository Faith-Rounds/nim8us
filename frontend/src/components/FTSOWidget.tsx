import React from 'react';

interface FTSOWidgetProps {
  data: {
    usdPriceE6: number;
    ftsoRoundId: number;
    requiredFLR: string;
    timestamp: number;
  };
}

export const FTSOWidget: React.FC<FTSOWidgetProps> = ({ data }) => {
  const formatPrice = (priceE6: number): string => {
    return `$${(priceE6 / 1000000).toFixed(6)}`;
  };

  const formatFLR = (flrWei: string): string => {
    const flrAmount = parseFloat(flrWei) / 1e18;
    return flrAmount >= 1 
      ? flrAmount.toFixed(2)
      : flrAmount.toFixed(4);
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-2 sm:mb-0">
          <div className="flex-shrink-0 h-10 w-10 mr-3">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 fill-current">
              <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm7.138-23.358c-2.308-2.309-5.539-3.205-8.554-2.690l1.691 1.691-2.309 2.309-4.617-4.617 4.617-4.618 2.309 2.31-1.309 1.308c3.740-.575 7.693.617 10.566 3.49 3.615 3.615 4.541 9.001 2.309 13.498l-2.155-2.155c1.227-3.262.552-7.062-2.048-9.662l-.5.136zm-14.569 3.144c-1.227 3.262-.552 7.062 2.048 9.662l.5-.136c2.308 2.309 5.539 3.205 8.554 2.69l-1.691-1.691 2.309-2.309 4.617 4.617-4.617 4.617-2.309-2.309 1.309-1.308c-3.74.575-7.693-.617-10.566-3.49-3.615-3.615-4.541-9.001-2.309-13.498l2.155 2.155z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">FTSO Price</div>
            <div className="text-xl font-semibold text-blue-900">
              {formatPrice(data.usdPriceE6)}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <div className="text-center px-3">
            <div className="text-sm font-medium text-gray-500">Cert Fee</div>
            <div className="text-base font-medium text-blue-700">{formatFLR(data.requiredFLR)} FLR</div>
          </div>
          
          <div className="text-center px-3">
            <div className="text-sm font-medium text-gray-500">Round</div>
            <div className="text-base font-medium text-blue-700">{data.ftsoRoundId}</div>
          </div>
          
          <div className="text-center px-3">
            <div className="text-sm font-medium text-gray-500">Updated</div>
            <div className="text-base font-medium text-blue-700">{formatTime(data.timestamp)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
