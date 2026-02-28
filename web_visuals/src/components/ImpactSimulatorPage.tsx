import { useState, useMemo } from 'react';
import { Users, Clock, TrendingUp } from 'lucide-react';
import type { ExecutiveMetrics } from '../types';

interface ImpactSimulatorPageProps {
  metrics: ExecutiveMetrics;
}

export const ImpactSimulatorPage = ({ metrics }: ImpactSimulatorPageProps) => {
  const [adoptionRate, setAdoptionRate] = useState(15); // Default 15%
  const [matatuSpeed, setMatatuSpeed] = useState(15); // Default 15 km/h
  const [trainSpeed, setTrainSpeed] = useState(40); // Default 40 km/h, adjustable up to 300
  const [selectedTiers, setSelectedTiers] = useState<Set<string>>(
    new Set(['Tier_3_MiddleIncome'])
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

  const TRIPS_PER_DAY = 2;
  const WORKING_DAYS_PER_WEEK = 6;

  // Simulator 1: Adoption Rate Calculation
  const totalDailyPassengers = useMemo(() => {
    return (metrics.total_daily_ridership_est * adoptionRate) / 100;
  }, [metrics.total_daily_ridership_est, adoptionRate]);

  // Simulator 2: Time Machine Calculations
  const timeCalculations = useMemo(() => {
    // Calculate weighted average distance based on selected tiers
    let baseDistance = 0;
    if (selectedTiers.has('Tier_1_WhiteCollar')) baseDistance += metrics.avg_tier1_commute_km;
    if (selectedTiers.has('Tier_2_Informal')) baseDistance += 4.87; // Average between T1 and T3
    if (selectedTiers.has('Tier_3_MiddleIncome')) baseDistance += metrics.avg_tier3_commute_km;

    if (selectedTiers.size > 0) {
      baseDistance = baseDistance / selectedTiers.size;
    } else {
      baseDistance = metrics.avg_tier3_commute_km; // Fallback
    }

    // Calculate times in hours
    const matatuTimeHours = baseDistance / matatuSpeed;
    const trainTimeHours = baseDistance / trainSpeed;

    // Calculate time saved per trip in hours
    const timeSavedPerTripHours = matatuTimeHours - trainTimeHours;

    // Calculate hours saved per worker per week
    const hoursSavedPerWeek = timeSavedPerTripHours * TRIPS_PER_DAY * WORKING_DAYS_PER_WEEK;

    // Convert to minutes for better readability
    const matatuTimeMinutes = matatuTimeHours * 60;
    const trainTimeMinutes = trainTimeHours * 60;
    const timeSavedPerTripMinutes = timeSavedPerTripHours * 60;

    return {
      baseDistance,
      matatuTimeHours,
      trainTimeHours,
      matatuTimeMinutes,
      trainTimeMinutes,
      timeSavedPerTripHours,
      timeSavedPerTripMinutes,
      hoursSavedPerWeek,
    };
  }, [metrics.avg_tier1_commute_km, metrics.avg_tier3_commute_km, matatuSpeed, trainSpeed, selectedTiers]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Title and Tier Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-dark-text mb-2">The Impact Simulator</h2>
            <p className="text-gray-400">
              Calculate the human and economic value of transit transformation
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

        {/* Simulator 1: Transit Adoption Rate */}
        <div className="bg-dark-surface p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-tier1" />
            <div>
              <h3 className="text-xl font-semibold text-dark-text">
                Simulator 1: Transit Adoption Rate
              </h3>
              <p className="text-sm text-gray-400">
                How many passengers will use the new transit system?
              </p>
            </div>
          </div>

          {/* Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-300">Adoption Rate</label>
              <span className="text-2xl font-bold text-tier1">{adoptionRate}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={adoptionRate}
              onChange={(e) => setAdoptionRate(Number(e.target.value))}
              className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${adoptionRate}%, #1E1E1E ${adoptionRate}%, #1E1E1E 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-bg p-5 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Base Network Capacity</p>
              <p className="text-3xl font-bold text-dark-text">
                {formatNumber(metrics.total_daily_ridership_est)}
              </p>
              <p className="text-xs text-gray-500 mt-1">passengers per day (100%)</p>
            </div>
            <div className="bg-gradient-to-br from-tier1/20 to-tier1/5 p-5 rounded-lg border border-tier1/30">
              <p className="text-sm text-gray-400 mb-2">Total Daily Passengers</p>
              <p className="text-3xl font-bold text-tier1">{formatNumber(totalDailyPassengers)}</p>
              <p className="text-xs text-gray-500 mt-1">at {adoptionRate}% adoption rate</p>
            </div>
          </div>
        </div>

        {/* Simulator 2: The Time Machine */}
        <div className="bg-dark-surface p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-8 h-8 text-tier3" />
            <div>
              <h3 className="text-xl font-semibold text-dark-text">
                Simulator 2: The Time Machine
              </h3>
              <p className="text-sm text-gray-400">
                Compare current matatu commute times vs. proposed train speed
              </p>
            </div>
          </div>

          {/* Matatu Speed Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-300">Current Matatu Speed</label>
              <span className="text-2xl font-bold text-tier3">{matatuSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={matatuSpeed}
              onChange={(e) => setMatatuSpeed(Number(e.target.value))}
              className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${
                  ((matatuSpeed - 5) / 25) * 100
                }%, #1E1E1E ${((matatuSpeed - 5) / 25) * 100}%, #1E1E1E 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 km/h</span>
              <span>30 km/h</span>
            </div>
          </div>

          {/* Train Speed Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-300">Proposed Train Speed</label>
              <span className="text-2xl font-bold text-green-500">{trainSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              value={trainSpeed}
              onChange={(e) => setTrainSpeed(Number(e.target.value))}
              className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10B981 0%, #10B981 ${
                  ((trainSpeed - 20) / 280) * 100
                }%, #1E1E1E ${((trainSpeed - 20) / 280) * 100}%, #1E1E1E 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>20 km/h</span>
              <span className="text-gray-400">Standard: 40 km/h</span>
              <span className="text-gray-400">High-Speed: 160+ km/h</span>
              <span>300 km/h</span>
            </div>
          </div>

          {/* Base Distance Display */}
          <div className="mb-6 p-4 rounded-lg border bg-tier1/10 border-tier1/30">
            <p className="text-sm text-gray-400 mb-1">
              Average Commute Distance ({selectedTiers.size === 0 ? 'No tiers selected' :
                selectedTiers.size === 1 ? Array.from(selectedTiers)[0].replace('Tier_', 'Tier ').replace('_', ' ') :
                `${selectedTiers.size} Tiers Combined`})
            </p>
            <p className="text-2xl font-bold text-tier1">
              {timeCalculations.baseDistance.toFixed(2)} km
            </p>
          </div>

          {/* Time Comparison */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-dark-bg p-5 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Matatu Commute Time</p>
              <p className="text-3xl font-bold text-tier3">
                {timeCalculations.matatuTimeMinutes.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">minutes per trip</p>
            </div>
            <div className="bg-dark-bg p-5 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Train Commute Time</p>
              <p className="text-3xl font-bold text-green-500">
                {timeCalculations.trainTimeMinutes.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">minutes per trip</p>
            </div>
          </div>

          {/* Time Saved */}
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 p-5 rounded-lg border border-green-500/30 mb-4">
            <p className="text-sm text-gray-400 mb-2">Time Saved Per Trip</p>
            <p className="text-3xl font-bold text-green-500">
              {timeCalculations.timeSavedPerTripMinutes.toFixed(1)} minutes
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ({timeCalculations.timeSavedPerTripHours.toFixed(2)} hours)
            </p>
          </div>

          {/* MASSIVE KPI: Hours Saved Per Week */}
          <div className="bg-gradient-to-br from-tier1 to-tier3 p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <TrendingUp className="w-12 h-12 text-white" />
              <div>
                <p className="text-sm text-white/80 uppercase tracking-wider font-semibold">
                  The Massive Impact
                </p>
                <h4 className="text-2xl font-bold text-white">Hours Saved Per Worker, Per Week</h4>
              </div>
            </div>
            <p className="text-6xl font-black text-white mb-2">
              {timeCalculations.hoursSavedPerWeek.toFixed(1)}
            </p>
            <p className="text-white/90 text-lg">
              hours reclaimed every week for {formatNumber(totalDailyPassengers)} workers across selected tiers
            </p>
            <p className="text-white/70 text-sm mt-3">
              Based on {TRIPS_PER_DAY} trips/day × {WORKING_DAYS_PER_WEEK} days/week
            </p>
          </div>

          {/* Additional Context */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-dark-bg p-4 rounded-lg text-center">
              <p className="text-xs text-gray-400 mb-1">Weekly Time Saved</p>
              <p className="text-xl font-bold text-dark-text">
                {(timeCalculations.hoursSavedPerWeek * 60).toFixed(0)} min
              </p>
            </div>
            <div className="bg-dark-bg p-4 rounded-lg text-center">
              <p className="text-xs text-gray-400 mb-1">Monthly Time Saved</p>
              <p className="text-xl font-bold text-dark-text">
                {(timeCalculations.hoursSavedPerWeek * 4).toFixed(1)} hrs
              </p>
            </div>
            <div className="bg-dark-bg p-4 rounded-lg text-center">
              <p className="text-xs text-gray-400 mb-1">Yearly Time Saved</p>
              <p className="text-xl font-bold text-tier1">
                {(timeCalculations.hoursSavedPerWeek * 52).toFixed(0)} hrs
              </p>
            </div>
          </div>
        </div>

        {/* Mathematical Formulas Reference */}
        <div className="bg-dark-surface p-6 rounded-lg border border-gray-800">
          <h4 className="text-lg font-semibold text-dark-text mb-4">
            Calculation Methodology
          </h4>
          <div className="space-y-3 text-sm font-mono">
            <div className="bg-dark-bg p-3 rounded">
              <p className="text-gray-400">Total Daily Passengers =</p>
              <p className="text-tier1">
                {formatNumber(metrics.total_daily_ridership_est)} × ({adoptionRate}% / 100) ={' '}
                {formatNumber(totalDailyPassengers)}
              </p>
            </div>
            <div className="bg-dark-bg p-3 rounded">
              <p className="text-gray-400">Matatu Time (hours) =</p>
              <p className="text-tier3">
                {timeCalculations.baseDistance.toFixed(2)} km / {matatuSpeed} km/h ={' '}
                {timeCalculations.matatuTimeHours.toFixed(2)} hrs
              </p>
            </div>
            <div className="bg-dark-bg p-3 rounded">
              <p className="text-gray-400">Train Time (hours) =</p>
              <p className="text-green-500">
                {timeCalculations.baseDistance.toFixed(2)} km / {trainSpeed} km/h ={' '}
                {timeCalculations.trainTimeHours.toFixed(2)} hrs
              </p>
            </div>
            <div className="bg-dark-bg p-3 rounded">
              <p className="text-gray-400">Hours Saved Per Week =</p>
              <p className="text-tier1">
                ({timeCalculations.timeSavedPerTripHours.toFixed(2)} hrs × {TRIPS_PER_DAY}) ×{' '}
                {WORKING_DAYS_PER_WEEK} = {timeCalculations.hoursSavedPerWeek.toFixed(2)} hrs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
