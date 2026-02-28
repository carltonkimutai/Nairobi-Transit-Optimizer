import { useState, useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import type { LayerProps } from 'react-map-gl/maplibre';
import type { NairobiTransitData } from '../types';

interface SpatialNetworkPageProps {
  data: NairobiTransitData;
}

export const SpatialNetworkPage = ({ data }: SpatialNetworkPageProps) => {
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

  // Filter data based on selected tiers
  const filteredData = useMemo(() => {
    if (selectedTiers.size === 0) {
      return {
        residentialNodes: { type: 'FeatureCollection' as const, features: [] },
        feederRoutes: { type: 'FeatureCollection' as const, features: [] },
      };
    }

    return {
      residentialNodes: {
        type: 'FeatureCollection' as const,
        features: data.residentialNodes.features.filter(
          (feature) => selectedTiers.has(feature.properties.tier)
        ),
      },
      feederRoutes: {
        type: 'FeatureCollection' as const,
        features: data.feederRoutes.features.filter(
          (feature) => selectedTiers.has(feature.properties.tier)
        ),
      },
    };
  }, [data, selectedTiers]);

  // Layer styles
  const residentialNodesLayer: LayerProps = {
    id: 'residential-nodes',
    type: 'circle',
    paint: {
      'circle-radius': 2,
      'circle-color': [
        'match',
        ['get', 'tier'],
        'Tier_1_WhiteCollar',
        '#3B82F6',
        'Tier_2_Informal',
        '#F59E0B',
        'Tier_3_MiddleIncome',
        '#8B5CF6',
        '#666666',
      ],
      'circle-opacity': 0.3,
    },
  };

  const feederRoutesLayer: LayerProps = {
    id: 'feeder-routes',
    type: 'line',
    paint: {
      'line-color': [
        'match',
        ['get', 'tier'],
        'Tier_1_WhiteCollar',
        '#3B82F6',
        'Tier_2_Informal',
        '#F59E0B',
        'Tier_3_MiddleIncome',
        '#8B5CF6',
        '#666666',
      ],
      'line-width': 2,
      'line-opacity': 0.7,
    },
  };

  const heavyRailLayer: LayerProps = {
    id: 'heavy-rail',
    type: 'line',
    paint: {
      'line-color': '#E5E7EB',
      'line-width': 3,
      'line-opacity': 0.9,
    },
  };

  const hubsLayer: LayerProps = {
    id: 'hubs',
    type: 'circle',
    paint: {
      'circle-radius': 8,
      'circle-color': '#EF4444',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#FFFFFF',
    },
  };

  const neighborhoodHubsLayer: LayerProps = {
    id: 'neighborhood-hubs',
    type: 'circle',
    paint: {
      'circle-radius': 5,
      'circle-color': '#10B981',
      'circle-stroke-width': 1,
      'circle-stroke-color': '#FFFFFF',
    },
  };

  // Nairobi County boundary (approximate)
  const nairobiBoundary = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [36.6500, -1.1500],
        [37.1000, -1.1500],
        [37.1000, -1.4500],
        [36.6500, -1.4500],
        [36.6500, -1.1500],
      ]],
    },
  };

  const boundaryLayer: LayerProps = {
    id: 'nairobi-boundary',
    type: 'line',
    paint: {
      'line-color': '#EF4444',
      'line-width': 2,
      'line-opacity': 0.8,
      'line-dasharray': [4, 2],
    },
  };

  return (
    <div className="h-[calc(100vh-140px)] relative">
      {/* Map */}
      <Map
        initialViewState={{
          longitude: 36.82,
          latitude: -1.29,
          zoom: 11,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      >
        {/* Layer 1: Residential Nodes */}
        <Source id="residential-nodes" type="geojson" data={filteredData.residentialNodes}>
          <Layer {...residentialNodesLayer} />
        </Source>

        {/* Layer 2: Feeder Routes */}
        <Source id="feeder-routes" type="geojson" data={filteredData.feederRoutes}>
          <Layer {...feederRoutesLayer} />
        </Source>

        {/* Layer 3: Heavy Rail Backbone */}
        <Source id="heavy-rail" type="geojson" data={data.heavyRailBackbone}>
          <Layer {...heavyRailLayer} />
        </Source>

        {/* Layer 4: Hubs Destinations */}
        <Source id="hubs-destinations" type="geojson" data={data.hubsDestinations}>
          <Layer {...hubsLayer} />
        </Source>

        {/* Layer 4: Neighborhood Hubs */}
        <Source id="neighborhood-hubs" type="geojson" data={data.neighborhoodHubs}>
          <Layer {...neighborhoodHubsLayer} />
        </Source>

        {/* Nairobi County Boundary */}
        <Source id="nairobi-boundary" type="geojson" data={nairobiBoundary}>
          <Layer {...boundaryLayer} />
        </Source>
      </Map>

      {/* Sidebar Controls */}
      <div className="absolute top-4 right-4 bg-dark-surface p-4 rounded-lg shadow-lg border border-gray-800 w-72">
        <h3 className="text-lg font-semibold mb-4 text-dark-text">Select Tiers to Display</h3>

        <div className="space-y-3">
          {/* Tier 1 Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-bg/50 p-2 rounded-lg">
            <input
              type="checkbox"
              checked={selectedTiers.has('Tier_1_WhiteCollar')}
              onChange={() => toggleTier('Tier_1_WhiteCollar')}
              className="w-5 h-5 rounded border-gray-600 text-tier1 focus:ring-tier1"
            />
            <div className="flex items-center gap-2 flex-1">
              <div className="w-3 h-3 rounded-full bg-tier1"></div>
              <span className="text-dark-text font-medium">Tier 1 (White-Collar)</span>
            </div>
          </label>

          {/* Tier 2 Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-bg/50 p-2 rounded-lg">
            <input
              type="checkbox"
              checked={selectedTiers.has('Tier_2_Informal')}
              onChange={() => toggleTier('Tier_2_Informal')}
              className="w-5 h-5 rounded border-gray-600 text-tier2 focus:ring-tier2"
            />
            <div className="flex items-center gap-2 flex-1">
              <div className="w-3 h-3 rounded-full bg-tier2"></div>
              <span className="text-dark-text font-medium">Tier 2 (Informal)</span>
            </div>
          </label>

          {/* Tier 3 Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-bg/50 p-2 rounded-lg">
            <input
              type="checkbox"
              checked={selectedTiers.has('Tier_3_MiddleIncome')}
              onChange={() => toggleTier('Tier_3_MiddleIncome')}
              className="w-5 h-5 rounded border-gray-600 text-tier3 focus:ring-tier3"
            />
            <div className="flex items-center gap-2 flex-1">
              <div className="w-3 h-3 rounded-full bg-tier3"></div>
              <span className="text-dark-text font-medium">Tier 3 (Middle-Income)</span>
            </div>
          </label>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h4 className="text-sm font-semibold mb-3 text-dark-text">Legend</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-tier1"></div>
              <span className="text-gray-400">Tier 1 (White-Collar)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-tier2"></div>
              <span className="text-gray-400">Tier 2 (Informal)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-tier3"></div>
              <span className="text-gray-400">Tier 3 (Middle-Income)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-tier1 opacity-70"></div>
              <span className="text-gray-400">Tier 1 Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-tier2 opacity-70"></div>
              <span className="text-gray-400">Tier 2 Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-tier3 opacity-70"></div>
              <span className="text-gray-400">Tier 3 Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 bg-dark-text"></div>
              <span className="text-gray-400">Heavy Rail Backbone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-penalty border-2 border-white"></div>
              <span className="text-gray-400">Destination Hubs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
              <span className="text-gray-400">Neighborhood Hubs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-penalty opacity-80" style={{ borderTop: '2px dashed' }}></div>
              <span className="text-gray-400">Nairobi Boundary</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
