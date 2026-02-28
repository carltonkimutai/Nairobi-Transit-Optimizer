import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import type { HubConnectivityStats } from '../types';

interface HubAnalyticsPageProps {
  hubStats: HubConnectivityStats[];
  feederRoutes: any; // GeoJSON FeatureCollection
}

export const HubAnalyticsPage = ({ hubStats, feederRoutes }: HubAnalyticsPageProps) => {
  const [selectedTiers, setSelectedTiers] = useState<Set<string>>(
    new Set(['Tier_1_WhiteCollar', 'Tier_2_Informal', 'Tier_3_MiddleIncome'])
  );

  const toggleTier = (tier: string) => {
    const newSet = new Set(selectedTiers);
    if (newSet.has(tier)) {
      newSet.delete(tier);
    } else {
      newSet.add(tier);
    }
    setSelectedTiers(newSet);
  };

  // Calculate tier-specific hub statistics from feeder routes
  const tierHubStats = useMemo(() => {
    if (selectedTiers.size === 3) {
      return hubStats;
    }

    if (selectedTiers.size === 0) {
      return [];
    }

    // Group feeder routes by hub and selected tiers
    const hubMap = new Map<string, {
      total_feeder_routes: number;
      total_population_served: number;
      distances: number[];
    }>();

    feederRoutes.features.forEach((feature: any) => {
      if (selectedTiers.has(feature.properties.tier)) {
        const hub = feature.properties.target_hub;
        if (!hubMap.has(hub)) {
          hubMap.set(hub, {
            total_feeder_routes: 0,
            total_population_served: 0,
            distances: [],
          });
        }
        const hubData = hubMap.get(hub)!;
        hubData.total_feeder_routes++;
        hubData.total_population_served += feature.properties.population_weight || 0;
        hubData.distances.push(feature.properties.route_distance_km || 0);
      }
    });

    // Convert to hub stats format
    return Array.from(hubMap.entries()).map(([hub, data]) => ({
      target_hub: hub,
      total_feeder_routes: data.total_feeder_routes,
      total_population_served: data.total_population_served,
      avg_feeder_distance: data.distances.reduce((a, b) => a + b, 0) / data.distances.length,
      estimated_daily_ridership: data.total_population_served * 0.15, // 15% ridership assumption
    }));
  }, [hubStats, feederRoutes, selectedTiers]);

  // Sort by ridership descending for the bar chart
  const sortedByRidership = useMemo(() => {
    return [...tierHubStats].sort(
      (a, b) => b.estimated_daily_ridership - a.estimated_daily_ridership
    );
  }, [tierHubStats]);

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(0);
  };

  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title and Tier Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-dark-text mb-2">Hub Analytics</h2>
            <p className="text-gray-400">
              Data-driven insights into transit hub performance and connectivity
            </p>
          </div>

          {/* Tier Selection Checkboxes */}
          <div className="flex gap-3 bg-dark-surface p-3 rounded-lg border border-gray-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTiers.has('Tier_1_WhiteCollar')}
                onChange={() => toggleTier('Tier_1_WhiteCollar')}
                className="w-4 h-4 rounded border-gray-600"
              />
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-tier1"></div>
                <span className="text-sm font-medium text-dark-text">Tier 1</span>
              </div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTiers.has('Tier_2_Informal')}
                onChange={() => toggleTier('Tier_2_Informal')}
                className="w-4 h-4 rounded border-gray-600"
              />
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-tier2"></div>
                <span className="text-sm font-medium text-dark-text">Tier 2</span>
              </div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTiers.has('Tier_3_MiddleIncome')}
                onChange={() => toggleTier('Tier_3_MiddleIncome')}
                className="w-4 h-4 rounded border-gray-600"
              />
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-tier3"></div>
                <span className="text-sm font-medium text-dark-text">Tier 3</span>
              </div>
            </label>
          </div>
        </div>

        {/* Chart 1: Daily Ridership by Hub */}
        <div className="bg-dark-surface p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-semibold text-dark-text mb-4">
            Estimated Daily Ridership by Target Hub
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Hubs are sorted by ridership in descending order
          </p>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sortedByRidership}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="target_hub"
                stroke="#9CA3AF"
                angle={-45}
                textAnchor="end"
                height={120}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9CA3AF"
                tickFormatter={formatNumber}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#E5E7EB',
                }}
                formatter={(value: number) => [
                  `${formatNumber(value)} passengers/day`,
                  'Daily Ridership',
                ]}
              />
              <Bar dataKey="estimated_daily_ridership" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Stats Summary */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-dark-bg p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">
                {selectedTiers.size === 3 ? 'Total Hubs' : 'Selected Tier Hubs'}
              </p>
              <p className="text-2xl font-bold text-dark-text">{tierHubStats.length}</p>
            </div>
            <div className="bg-dark-bg p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Total Daily Ridership</p>
              <p className="text-2xl font-bold text-tier1">
                {formatNumber(
                  tierHubStats.reduce((sum, hub) => sum + hub.estimated_daily_ridership, 0)
                )}
              </p>
            </div>
            <div className="bg-dark-bg p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Total Population Served</p>
              <p className="text-2xl font-bold text-tier3">
                {formatNumber(
                  tierHubStats.reduce((sum, hub) => sum + hub.total_population_served, 0)
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Chart 2: Population vs Distance Scatter Plot */}
        <div className="bg-dark-surface p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-semibold text-dark-text mb-4">
            Population Served vs Average Feeder Distance
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Each point represents a target hub. Larger dots indicate higher total population
            served.
          </p>

          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                type="number"
                dataKey="avg_feeder_distance"
                name="Avg Feeder Distance"
                unit=" km"
                stroke="#9CA3AF"
                label={{
                  value: 'Average Feeder Distance (km)',
                  position: 'insideBottom',
                  offset: -10,
                  style: { fill: '#9CA3AF' },
                }}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                type="number"
                dataKey="total_population_served"
                name="Population Served"
                stroke="#9CA3AF"
                tickFormatter={formatNumber}
                label={{
                  value: 'Total Population Served',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#9CA3AF' },
                }}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#E5E7EB',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'total_population_served') {
                    return [formatNumber(value), 'Population Served'];
                  }
                  return [value.toFixed(2) + ' km', 'Avg Distance'];
                }}
                labelFormatter={(value, payload) => {
                  if (payload && payload.length > 0) {
                    return `Hub: ${payload[0].payload.target_hub}`;
                  }
                  return '';
                }}
              />
              <Scatter
                data={tierHubStats}
                fill="#3B82F6"
                fillOpacity={0.7}
                stroke="#FFFFFF"
                strokeWidth={1}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="bg-dark-surface p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-semibold text-dark-text mb-4">Detailed Hub Statistics</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Target Hub</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">
                    Feeder Routes
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">
                    Population Served
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">
                    Avg Distance (km)
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">
                    Daily Ridership
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedByRidership.map((hub, index) => (
                  <tr
                    key={hub.target_hub}
                    className={`border-b border-gray-800 ${
                      index % 2 === 0 ? 'bg-dark-bg/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-dark-text font-medium">{hub.target_hub}</td>
                    <td className="py-3 px-4 text-right text-dark-text">
                      {hub.total_feeder_routes}
                    </td>
                    <td className="py-3 px-4 text-right text-dark-text">
                      {formatNumber(hub.total_population_served)}
                    </td>
                    <td className="py-3 px-4 text-right text-dark-text">
                      {hub.avg_feeder_distance.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-tier1 font-semibold">
                      {formatNumber(hub.estimated_daily_ridership)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
