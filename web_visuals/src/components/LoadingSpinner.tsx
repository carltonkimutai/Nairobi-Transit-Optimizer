import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin text-tier1 mx-auto mb-4" />
        <p className="text-2xl font-semibold text-dark-text">
          Initializing Nairobi Transit Matrix...
        </p>
        <p className="text-sm text-gray-400 mt-2">Loading network data</p>
      </div>
    </div>
  );
};
