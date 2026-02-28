# The Nairobi Transit & Socio-Economic Optimizer

An interactive React dashboard that visualizes and analyzes the spatial mismatch in Nairobi's commute patterns, highlighting the **2.17x commute penalty** faced by blue-collar workers (Tier 3) compared to white-collar workers (Tier 1).

## 🎯 Project Mission

This dashboard proves one core idea: **People in Tier 3 (blue-collar) suffer significantly longer commute times and distances than people in Tier 1 (white-collar).**

- **Tier 1 (White-Collar)**: Average commute of 3.07 km to Corporate Hubs
- **Tier 3 (Blue-Collar)**: Average commute of 6.66 km to Industrial & Soko Hubs
- **Commute Penalty**: 2.17x longer commute distance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Navigate to project directory
cd nairobi-transit-optimizer

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

## 📊 Features

### Page 1: The Spatial Network (Interactive Map)
- **MapLibre GL JS** powered interactive map centered on Nairobi
- **4-layer rendering system**:
  - Layer 1: Residential nodes (low-opacity dots)
  - Layer 2: Feeder routes (colored by tier)
  - Layer 3: Heavy rail backbone (thick white line)
  - Layer 4: Destination & neighborhood hubs
- **Tier filtering**: Isolate Tier 1 or Tier 3 flows
- **Dark-themed** basemap with neighborhood labels

### Page 2: Hub Analytics (Data Visualization)
- **Bar Chart**: Daily ridership by target hub (sorted descending)
- **Scatter Plot**: Population served vs. average feeder distance
- **Statistics Table**: Detailed hub connectivity metrics
- All data sourced from `hub_connectivity_stats.csv`

### Page 3: The Impact Simulator (Interactive Calculators)

#### Simulator 1: Transit Adoption Rate
- Slider: 10% - 100% (default 15%)
- Calculates total daily passengers based on adoption rate
- Formula: `Total Passengers = 1,104,990 × (Adoption % / 100)`

#### Simulator 2: The Time Machine
- **Matatu Speed Slider**: 5-30 km/h (default 15 km/h)
- **Train Speed**: Fixed at 40 km/h
- Calculates:
  - Commute time for each mode
  - Time saved per trip
  - **Hours saved per worker, per week** (massive KPI)
- Assumptions: 2 trips/day, 6 working days/week
- Base distance: 6.66 km (Tier 3 average)

## 🗂️ Data Files

All data files are located in `public/web_exports/`:

1. `executive_metrics.csv` - Network-wide statistics
2. `hub_connectivity_stats.csv` - Per-hub metrics
3. `hubs_destinations.geojson` - Destination hub locations
4. `neighborhood_hubs.geojson` - Neighborhood hub points
5. `residential_nodes.geojson` - Residential starting points (6MB)
6. `heavy_rail_backbone.geojson` - Main rail line
7. `feeder_routes.geojson` - Feeder route lines

## 🎨 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (dark theme)
- **Mapping**: MapLibre GL JS + react-map-gl
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Parsing**: PapaParse (CSV)
- **Language**: TypeScript + JSX

## 🎨 Design System

### Colors
- Background: `#121212`
- Surface: `#1E1E1E`
- Text: `#E5E7EB`
- Tier 1 (White-collar): `#3B82F6` (Blue)
- Tier 3 (Blue-collar): `#8B5CF6` (Purple)
- Penalty/Alert: `#EF4444` (Red)

## 📁 Project Structure

```
nairobi-transit-optimizer/
├── public/
│   └── web_exports/          # All 7 data files
├── src/
│   ├── components/
│   │   ├── LoadingSpinner.tsx
│   │   ├── Header.tsx
│   │   ├── SpatialNetworkPage.tsx
│   │   ├── HubAnalyticsPage.tsx
│   │   └── ImpactSimulatorPage.tsx
│   ├── hooks/
│   │   └── useDataLoader.ts
│   ├── types.ts              # TypeScript interfaces
│   ├── App.tsx               # Main application
│   ├── index.css             # Tailwind imports
│   └── main.jsx              # React entry point
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## 🔧 Development

### Build for Production

```bash
npm run build
```

Outputs to `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📐 Mathematical Formulas

### Adoption Calculator
```
Total Daily Passengers = 1,104,990 × (Adoption Rate % / 100)
```

### Time Savings Calculator
```
Base Distance = 6.66 km (Tier 3 avg)
Matatu Time = Base Distance / Matatu Speed
Train Time = Base Distance / 40 km/h
Time Saved Per Trip = Matatu Time - Train Time
Hours Saved Per Week = (Time Saved × 2 trips) × 6 days
```

## 🌍 Data Loading Strategy

- **Concurrent Loading**: All 7 files loaded simultaneously using `Promise.all()`
- **Loading State**: Full-screen spinner ("Initializing Nairobi Transit Matrix...")
- **CSV Parsing**: PapaParse with header detection and dynamic typing
- **GeoJSON**: Direct JSON parsing via `fetch().json()`
- **Error Handling**: Graceful error display with retry option

## 🎯 Key Insights

1. **Spatial Mismatch**: Blue-collar workers commute 2.17x farther than white-collar workers
2. **Network Impact**: ~1.1M potential daily passengers at 100% adoption
3. **Time Reclaimed**: Workers can save 4-6 hours/week with efficient transit
4. **Economic Justice**: Transit infrastructure can reduce inequality

## 📝 License

This project is built for urban planning analysis and socio-economic research.

---
