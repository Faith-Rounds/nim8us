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
    <div className="backdrop-blur-sm bg-gradient-to-r from-nim-silver-50/70 to-white/70 rounded-xl p-5 mb-6 shadow-md border border-nim-silver-100 animate-fade-in transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-3 sm:mb-0">
          <div className="flex-shrink-0 h-12 w-12 mr-4 animate-pulse-slow">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="text-nim-orange-500 fill-current">
              <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm7.138-23.358c-2.308-2.309-5.539-3.205-8.554-2.69l1.691 1.691-2.309 2.309-4.617-4.617 4.617-4.618 2.309 2.31-1.309 1.308c3.74-.575 7.693.617 10.566 3.49 3.615 3.615 4.541 9.001 2.309 13.498l-2.155-2.155c1.227-3.262.552-7.062-2.048-9.662l-.5.136zm-14.569 3.144c-1.227 3.262-.552 7.062 2.048 9.662l.5-.136c2.308 2.309 5.539 3.205 8.554 2.69l-1.691-1.691 2.309-2.309 4.617 4.617-4.617 4.617-2.309-2.309 1.309-1.308c-3.74.575-7.693-.617-10.566-3.49-3.615-3.615-4.541-9.001-2.309-13.498l2.155 2.155z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-nim-silver-600">FTSO Price</div>
            <div className="text-2xl font-bold text-nim-green-700">
              {formatPrice(data.usdPriceE6)}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-6 py-2 px-4 bg-white/50 backdrop-blur-sm rounded-full shadow-sm">
          <div className="text-center px-3">
            <div className="text-sm font-medium text-nim-silver-600">Cert Fee</div>
            <div className="text-base font-medium text-nim-orange-600">{formatFLR(data.requiredFLR)} FLR</div>
          </div>
          
          <div className="text-center px-3 border-l border-r border-nim-silver-100">
            <div className="text-sm font-medium text-nim-silver-600">Round</div>
            <div className="text-base font-medium text-nim-green-600">{data.ftsoRoundId}</div>
          </div>
          
          <div className="text-center px-3">
            <div className="text-sm font-medium text-nim-silver-600">Updated</div>
            <div className="text-base font-medium text-nim-silver-700">{formatTime(data.timestamp)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
