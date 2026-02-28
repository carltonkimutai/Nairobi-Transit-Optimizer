import { useState } from 'react';
import { useDataLoader } from './hooks/useDataLoader';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import { SpatialNetworkPage } from './components/SpatialNetworkPage';
import { HubAnalyticsPage } from './components/HubAnalyticsPage';
import { ImpactSimulatorPage } from './components/ImpactSimulatorPage';

type PageType = 'map' | 'analytics' | 'simulator';

function App() {
  const { data, loading, error } = useDataLoader();
  const [currentPage, setCurrentPage] = useState<PageType>('map');

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-dark-bg flex items-center justify-center">
        <div className="bg-dark-surface p-8 rounded-lg border border-red-500 max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Data</h2>
          <p className="text-dark-text">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-tier1 text-white rounded-lg hover:bg-tier1/80"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header
        metrics={data.executiveMetrics}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <main>
        {currentPage === 'map' && <SpatialNetworkPage data={data} />}
        {currentPage === 'analytics' && (
          <HubAnalyticsPage
            hubStats={data.hubConnectivityStats}
            feederRoutes={data.feederRoutes}
          />
        )}
        {currentPage === 'simulator' && (
          <ImpactSimulatorPage metrics={data.executiveMetrics} />
        )}
      </main>
    </div>
  );
}

export default App;
