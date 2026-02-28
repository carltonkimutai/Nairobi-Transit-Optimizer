import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import type { NairobiTransitData, ExecutiveMetrics, HubConnectivityStats } from '../types';

export const useDataLoader = () => {
  const [data, setData] = useState<NairobiTransitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch all files simultaneously using Promise.all
        const [
          executiveMetricsRes,
          hubStatsRes,
          hubsDestRes,
          neighborhoodHubsRes,
          residentialNodesRes,
          heavyRailRes,
          feederRoutesRes,
        ] = await Promise.all([
          fetch('/web_exports/executive_metrics.csv'),
          fetch('/web_exports/hub_connectivity_stats.csv'),
          fetch('/web_exports/hubs_destinations.geojson'),
          fetch('/web_exports/neighborhood_hubs.geojson'),
          fetch('/web_exports/residential_nodes.geojson'),
          fetch('/web_exports/heavy_rail_backbone.geojson'),
          fetch('/web_exports/feeder_routes.geojson'),
        ]);

        // Parse CSV files
        const executiveMetricsText = await executiveMetricsRes.text();
        const hubStatsText = await hubStatsRes.text();

        const executiveMetricsParsed = Papa.parse<any>(executiveMetricsText, {
          header: true,
          dynamicTyping: true,
        });

        const hubStatsParsed = Papa.parse<any>(hubStatsText, {
          header: true,
          dynamicTyping: true,
        });

        // Parse GeoJSON files
        const [
          hubsDestinations,
          neighborhoodHubs,
          residentialNodes,
          heavyRailBackbone,
          feederRoutes,
        ] = await Promise.all([
          hubsDestRes.json(),
          neighborhoodHubsRes.json(),
          residentialNodesRes.json(),
          heavyRailRes.json(),
          feederRoutesRes.json(),
        ]);

        // Extract executive metrics (single row)
        const executiveMetrics: ExecutiveMetrics = executiveMetricsParsed.data[0];

        // Extract hub connectivity stats (multiple rows)
        const hubConnectivityStats: HubConnectivityStats[] = hubStatsParsed.data.filter(
          (row: any) => row.target_hub // Filter out empty rows
        );

        setData({
          executiveMetrics,
          hubConnectivityStats,
          hubsDestinations,
          neighborhoodHubs,
          residentialNodes,
          heavyRailBackbone,
          feederRoutes,
        });

        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};
