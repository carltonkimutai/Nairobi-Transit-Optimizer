# 🌍 Nairobi Transit Optimizer: Socio-Economic Routing & Spatial Equity

## 📑 Project Roadmap
*Structure of this ReadMe file:*
* **Interactive Visualizations & Video:** ( https://vercel.com/carltonkimutais-projects/nairobi-transit-optimizer ) Access to the final web application and a video walkthrough of the transit network.
* **The Problem & Strategic Solution:** An overview of the "Spatial Mismatch" in Nairobi and the human-in-the-loop pipeline designed to solve it.
* **Deep Analysis & Methodology:** A comprehensive technical breakdown of the three-stage spatial analytics and routing pipeline.
* **System Integration & Data Flow:** A mapped architecture showing how data moves from raw APIs to web-ready dashboards.
* **Running the Project:** Technical requirements and installation steps to replicate the environment.

## ✨ Technologies
* **Geospatial & Remote Sensing:** GeoPandas, OSMnx, Rasterio, Shapely
* **Network Science & Graph Theory:** NetworkX (MST, Dijkstra)
* **Data Engineering & Math:** Pandas, NumPy, Coordinate Reference Systems (EPSG:4326 / EPSG:32737)
* **Visualization:** Contextily, Matplotlib, Web Mercator (GeoJSON)

---

## 🎞️ Interactive Visualizations & Video Walkthrough

**Live Dashboard:** 👉 [Insert Link to Hosted React/PowerBI Dashboard Here]

Below is a video demonstration showing the final visualization tool in action, detailing the heavy rail backbone and the tier-routed BRT network:

*(Attached Video: transit_network_demo.mp4)*

---

## 🚀 The Problem & Strategic Solution

**The Problem: Spatial Inequality in Urban Transit**
Nairobi, Kenya exhibits a severe **Spatial Mismatch**—a phenomenon where residential patterns and employment centers are geographically misaligned, disproportionately burdening lower-income populations. Blue-collar workers (Tier 2/3) face commute distances significantly longer than white-collar workers (Tier 1), creating a **Commute Penalty Multiplier** of approximately **2.17x**. This inequality stems from economic segregation where high-income residential zones cluster near corporate hubs, industrial displacement that forces informal settlement residents into lengthy cross-city commutes, and infrastructure asymmetry where existing transit networks favor CBD corridors over industrial-access routes.

**The Solution: Socio-Economic Transit Optimization**
This project implements a **Human-in-the-Loop (HITL) Spatial Analytics Pipeline** that mathematically models multi-modal transit routing based on socio-economic tiers. The architecture combines WorldPop raster demographic extraction with OSM boundary geocoding, Minimum Spanning Tree (MST) graph theory for heavy rail backbone optimization, Dijkstra shortest-path algorithms on physical street networks for BRT feeder routing, and spatial equity metrics quantifying commute disparity.

---

## 📍 Deep Analysis & Methodology

### 📓 NOTEBOOK 01: SOCIO-ECONOMIC SPATIAL EXTRACTION
Establishes the foundational Origins-Destinations (OD) matrix by extracting and classifying Nairobi's workforce distribution and employment centers using geospatial data fusion.

**Technical Architecture**
The data pipeline relies on the OpenStreetMap (OSM) Nominatim API for dynamic geocoding of 21 employment hubs alongside the WorldPop 2020 UN-adjusted constrained raster for high-resolution population density. To maintain exact metric accuracy for physical distance calculations, all input data is immediately reprojected from EPSG:4326 (WGS84) to EPSG:32737 (UTM Zone 37S).

The notebook implements explicit Human-in-the-Loop (HITL) zoning to prevent the geographic misclassification common when applying unsupervised AI to non-Western urban contexts. Three socio-economic tiers are manually curated: Tier 1 (White-Collar: Karen, Gigiri), Tier 2 (Informal/Blue-Collar: Kibera, Mathare), and Tier 3 (Middle-Income: Buruburu, South B).

The spatial processing pipeline executes boundary extraction via `ox.geocode_to_gdf()`, raster masking with `rasterio` to isolate dense residential pixels (>30 persons/cell), and a point-in-polygon spatial join (`gpd.sjoin()`). This final join stamps 23,475 distinct workforce nodes with tier classifications, neighborhood labels, and population weights.

### 📓 NOTEBOOK 02: HYBRID TRANSIT ROUTING SIMULATION
Calculates optimal multi-modal transit networks combining graph-theoretic rail backbone construction with street-network-constrained BRT routing that respects socio-economic access rules.

**Technical Architecture**
**Heavy Rail Backbone:** Train infrastructure is highly capital-intensive and requires optimal routing. The model implements Kruskal's/Prim's Minimum Spanning Tree (MST) algorithm via `nx.minimum_spanning_tree()` on a complete graph of the 21 job hubs. 



This yields 20 optimal track segments, mathematically eliminating redundant loops while minimizing total infrastructure length. This ensures high-speed rail connectivity across all economic centers at the absolute lowest spatial cost.

**Smart Commute Engine:** To calculate the feeder routes, the algorithm first aggregates the 23,475 workforce dots into 52 neighborhood centroids. This aggregation critically reduces computational complexity for routing on Nairobi's massive 50,000+ node physical street network while preserving population-weighted origin accuracy. The engine then enforces strict tier-based routing logic: Tier 1 → Corporate hubs only; Tier 2 → Industrial/Soko hubs only; Tier 3 → dual access to both. Using Dijkstra's Algorithm via `nx.shortest_path()` on OSMnx drive networks, the system calculates 70 highly accurate physical street routes rather than relying on abstract straight-line approximations.



### 📓 NOTEBOOK 03: FEASIBILITY METRICS & WEB EXPORT
Quantifies spatial equity disparities, calculates ridership projections, and prepares web-optimized exports for interactive dashboard deployment.

**Technical Architecture**
The notebook handles heavy Coordinate Reference System (CRS) complexity by temporarily reprojecting the network routes back to UTM Zone 37S to compute exact kilometer lengths (`geometry.length / 1000`). 

Here, the core **Spatial Equity Score** is derived mathematically. By comparing the average Tier 3 commute (6.66 km) against the Tier 1 commute (3.07 km), the model yields the **2.17× Commute Penalty Multiplier**—providing empirical, quantifiable evidence of transit inequality. Hub connectivity analysis then aggregates the feeder routes per station, estimating daily ridership by applying a 15% transit adoption factor to the served populations.

Finally, the architecture enforces strict web mapping standards by reprojecting all spatial geometries to WGS84 (EPSG:4326). Post-sanity checks validate geometric integrity (handling nulls and multi-polygons) before rendering the CARTO Dark Matter visualizations and exporting the clean, dashboard-ready GeoJSON assets.

---

## 🗺️ System Integration & Data Flow

```text
┌─────────────────────────────────────────────────────────────────┐
│  RAW DATA SOURCES                                               │
│  ├── WorldPop Raster (ken_ppp_2020_constrained.tif)             │
│  ├── OpenStreetMap (OSMnx + Nominatim API)                      │
│  └── HITL Zoning Configuration (Manual tier definitions)        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  NOTEBOOK 01: Socio-Economic Spatial Extraction                 │
│  ├── Output: classified_destinations.csv (21 hubs)              │
│  └── Output: classified_origins.csv (23,475 nodes)              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  NOTEBOOK 02: Hybrid Transit Routing Simulation                 │
│  ├── Input: Notebook 01 CSVs                                    │
│  ├── Process: MST (rail) + Dijkstra (BRT)                       │
│  ├── Output: nairobi_heavy_rail.geojson (20 segments)           │
│  ├── Output: nairobi_brt_routes.geojson (70 routes)             │
│  └── Output: Master visualization map                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  NOTEBOOK 03: Feasibility Metrics & Web Export                  │
│  ├── Input: Notebooks 01 & 02 outputs                           │
│  ├── Process: Equity scoring, ridership modeling, CRS harmonization│
│  └── Output: Web-ready GeoJSON + Executive dashboards           │
└─────────────────────────────────────────────────────────────────┘
