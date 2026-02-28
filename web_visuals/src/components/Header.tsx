import type { ExecutiveMetrics } from '../types';

interface HeaderProps {
  metrics: ExecutiveMetrics;
  currentPage: 'map' | 'analytics' | 'simulator';
  onPageChange: (page: 'map' | 'analytics' | 'simulator') => void;
}

export const Header = ({ metrics, currentPage, onPageChange }: HeaderProps) => {
  return (
    <header className="bg-dark-surface border-b border-gray-800">
      <div className="max-w-full px-6 py-4">
        {/* Title and Comparison */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h1 className="text-2xl font-bold text-dark-text mb-2 md:mb-0">
            The Nairobi Transit & Socio-Economic Optimizer
          </h1>

          {/* Tier Comparison */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Tier 1 Commute:</span>
              <span className="text-tier1 font-semibold">
                {metrics.avg_tier1_commute_km.toFixed(2)} km
              </span>
            </div>
            <span className="text-gray-600">vs</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Tier 3 Commute:</span>
              <span className="text-tier3 font-semibold">
                {metrics.avg_tier3_commute_km.toFixed(2)} km
              </span>
            </div>
            <div className="bg-penalty/10 border border-penalty px-3 py-1 rounded-lg">
              <span className="text-penalty font-bold">
                {metrics.commute_penalty_multiplier.toFixed(2)}x Penalty
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-2">
          <button
            onClick={() => onPageChange('map')}
            className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
              currentPage === 'map'
                ? 'bg-dark-bg text-dark-text border-b-2 border-tier1'
                : 'bg-dark-surface text-gray-400 hover:text-dark-text hover:bg-dark-bg/50'
            }`}
          >
            The Spatial Network
          </button>
          <button
            onClick={() => onPageChange('analytics')}
            className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
              currentPage === 'analytics'
                ? 'bg-dark-bg text-dark-text border-b-2 border-tier1'
                : 'bg-dark-surface text-gray-400 hover:text-dark-text hover:bg-dark-bg/50'
            }`}
          >
            Hub Analytics
          </button>
          <button
            onClick={() => onPageChange('simulator')}
            className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
              currentPage === 'simulator'
                ? 'bg-dark-bg text-dark-text border-b-2 border-tier1'
                : 'bg-dark-surface text-gray-400 hover:text-dark-text hover:bg-dark-bg/50'
            }`}
          >
            The Impact Simulator
          </button>
        </nav>
      </div>
    </header>
  );
};
