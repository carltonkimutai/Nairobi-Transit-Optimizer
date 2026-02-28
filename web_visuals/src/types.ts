// Executive Metrics
export interface ExecutiveMetrics {
  total_network_km: number;
  avg_tier1_commute_km: number;
  avg_tier3_commute_km: number;
  commute_penalty_multiplier: number;
  total_daily_ridership_est: number;
}

// Hub Connectivity Stats
export interface HubConnectivityStats {
  target_hub: string;
  total_feeder_routes: number;
  total_population_served: number;
  avg_feeder_distance: number;
  estimated_daily_ridership: number;
}

// GeoJSON Feature Types
export interface HubDestination {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    hub_id: string;
    name: string;
    type: string;
  };
}

export interface NeighborhoodHub {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    neighborhood: string;
    tier: string;
    population: number;
  };
}

export interface ResidentialNode {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    neighborhood: string;
    tier: string;
    population: number;
  };
}

export interface HeavyRailBackbone {
  type: 'Feature';
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  properties: {
    track_length_km: number;
  };
}

export interface FeederRoute {
  type: 'Feature';
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  properties: {
    neighborhood: string;
    tier: string;
    target_hub: string;
    route_distance_km: number;
  };
}

// GeoJSON Collection Types
export type HubDestinationCollection = {
  type: 'FeatureCollection';
  features: HubDestination[];
};

export type NeighborhoodHubCollection = {
  type: 'FeatureCollection';
  features: NeighborhoodHub[];
};

export type ResidentialNodeCollection = {
  type: 'FeatureCollection';
  features: ResidentialNode[];
};

export type HeavyRailBackboneCollection = {
  type: 'FeatureCollection';
  features: HeavyRailBackbone[];
};

export type FeederRouteCollection = {
  type: 'FeatureCollection';
  features: FeederRoute[];
};

// Combined Data Type
export interface NairobiTransitData {
  executiveMetrics: ExecutiveMetrics;
  hubConnectivityStats: HubConnectivityStats[];
  hubsDestinations: HubDestinationCollection;
  neighborhoodHubs: NeighborhoodHubCollection;
  residentialNodes: ResidentialNodeCollection;
  heavyRailBackbone: HeavyRailBackboneCollection;
  feederRoutes: FeederRouteCollection;
}
