import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Activity, Flame, Eye, Zap, RefreshCw, Layers } from 'lucide-react';

export interface HeatmapDataPoint {
  id: string;
  name: string;
  x: number; // In 800x480 coordinate space
  y: number;
  trafficDensity: number; // 0 to 1
  incidentCount: number; // e.g. 10 to 70
  avgSpeedKmH: number;
  levelOfService: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  corridorType: string;
}

export const INITIAL_HEATMAP_POINTS: HeatmapDataPoint[] = [
  {
    id: 'HP-01',
    name: 'Silk Board Junction (Hosur Rd / ORR)',
    x: 320,
    y: 360,
    trafficDensity: 0.96,
    incidentCount: 68,
    avgSpeedKmH: 11,
    levelOfService: 'F',
    corridorType: 'Inter-State Transit Bottleneck'
  },
  {
    id: 'HP-02',
    name: 'Kadubeesanahalli Tech Corridor (ORR)',
    x: 620,
    y: 200,
    trafficDensity: 0.88,
    incidentCount: 54,
    avgSpeedKmH: 18,
    levelOfService: 'E',
    corridorType: 'IT Corridor Express Arterial'
  },
  {
    id: 'HP-03',
    name: 'Indiranagar 100ft Road Corridor',
    x: 240,
    y: 120,
    trafficDensity: 0.76,
    incidentCount: 39,
    avgSpeedKmH: 22,
    levelOfService: 'D',
    corridorType: 'Urban Commercial Corridor'
  },
  {
    id: 'HP-04',
    name: 'Sony World Junction (Koramangala 80ft)',
    x: 440,
    y: 310,
    trafficDensity: 0.84,
    incidentCount: 46,
    avgSpeedKmH: 16,
    levelOfService: 'E',
    corridorType: 'Cross-Arterial Intersection'
  },
  {
    id: 'HP-05',
    name: 'Marathahalli Underpass Descent',
    x: 680,
    y: 150,
    trafficDensity: 0.91,
    incidentCount: 41,
    avgSpeedKmH: 14,
    levelOfService: 'F',
    corridorType: 'Grade Separator Bottleneck'
  },
  {
    id: 'HP-06',
    name: 'Richmond Circle School Zone',
    x: 380,
    y: 230,
    trafficDensity: 0.79,
    incidentCount: 33,
    avgSpeedKmH: 20,
    levelOfService: 'D',
    corridorType: 'Vulnerable Pedestrian School Zone'
  },
  {
    id: 'HP-07',
    name: 'Bellandur Flyover Ramp (ORR)',
    x: 540,
    y: 260,
    trafficDensity: 0.86,
    incidentCount: 48,
    avgSpeedKmH: 17,
    levelOfService: 'E',
    corridorType: 'Rapid Transit Corridor'
  },
  {
    id: 'HP-08',
    name: 'Domlur Intermediate Ring Road',
    x: 480,
    y: 170,
    trafficDensity: 0.72,
    incidentCount: 29,
    avgSpeedKmH: 26,
    levelOfService: 'C',
    corridorType: 'Connecting Arterial Ring'
  },
  {
    id: 'HP-09',
    name: 'Electronic City Tollway Approach',
    x: 190,
    y: 410,
    trafficDensity: 0.68,
    incidentCount: 24,
    avgSpeedKmH: 34,
    levelOfService: 'C',
    corridorType: 'Elevated Expressway Feed'
  },
  {
    id: 'HP-10',
    name: 'Whitefield ITPL Main Road',
    x: 740,
    y: 120,
    trafficDensity: 0.82,
    incidentCount: 37,
    avgSpeedKmH: 19,
    levelOfService: 'E',
    corridorType: 'Industrial & Software Cluster'
  }
];

interface D3GisHeatmapLayerProps {
  mode: 'traffic' | 'incidents' | 'combined';
  bandwidth?: number; // kernel density radius (default 32)
  opacity?: number; // 0 to 1 (default 0.75)
  isLiveStream?: boolean;
  onSelectHotspot?: (hotspot: HeatmapDataPoint) => void;
}

export const D3GisHeatmapLayer: React.FC<D3GisHeatmapLayerProps> = ({
  mode,
  bandwidth = 32,
  opacity = 0.75,
  isLiveStream = true,
  onSelectHotspot
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<HeatmapDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [liveData, setLiveData] = useState<HeatmapDataPoint[]>(INITIAL_HEATMAP_POINTS);

  // Real-time dynamic updates: simulate live edge stream fluctuations
  useEffect(() => {
    if (!isLiveStream) return;

    const interval = setInterval(() => {
      setLiveData((prev) =>
        prev.map((point) => {
          // Micro-fluctuation between -0.03 and +0.03 for traffic density
          const delta = (Math.random() - 0.5) * 0.04;
          const newDensity = Math.min(0.99, Math.max(0.4, point.trafficDensity + delta));
          const speedDelta = Math.round((Math.random() - 0.5) * 2);
          const newSpeed = Math.min(60, Math.max(8, point.avgSpeedKmH + speedDelta));

          return {
            ...point,
            trafficDensity: Number(newDensity.toFixed(2)),
            avgSpeedKmH: newSpeed
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveStream]);

  // D3 Contour Density Rendering
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 480;

    // Clear previous dynamic layers inside svg
    svg.selectAll('.d3-heatmap-element').remove();

    // Group for contours
    const g = svg.select<SVGGElement>('.d3-contours-group');

    // Weight function based on selected mode
    const getWeight = (d: HeatmapDataPoint) => {
      if (mode === 'traffic') {
        return d.trafficDensity * 10;
      }
      if (mode === 'incidents') {
        return (d.incidentCount / 70) * 10;
      }
      // combined
      return (d.trafficDensity * 0.5 + (d.incidentCount / 70) * 0.5) * 10;
    };

    // Construct D3 Contour Density Generator
    const densityGenerator = d3
      .contourDensity<HeatmapDataPoint>()
      .x((d) => d.x)
      .y((d) => d.y)
      .weight((d) => getWeight(d))
      .size([width, height])
      .bandwidth(bandwidth)
      .thresholds(16);

    const contours = densityGenerator(liveData);
    const geoPath = d3.geoPath();

    // Color Interpolator matching Clean Minimalism / Traffic safety archetype:
    // Low: Transparent cyan -> Green -> Yellow -> Orange -> Deep Crimson
    const maxVal = d3.max(contours, (c) => c.value) || 0.05;

    // Custom multi-stop color scale
    const colorScale = d3
      .scaleSequential((t: number) => {
        // Use d3.interpolateInferno or d3.interpolateTurbo for high perceptual clarity
        return d3.interpolateTurbo(t * 0.85 + 0.1);
      })
      .domain([0, maxVal]);

    // Render smooth contour filled polygons
    g.selectAll('path.contour-polygon')
      .data(contours)
      .enter()
      .append('path')
      .attr('class', 'd3-heatmap-element contour-polygon')
      .attr('d', geoPath)
      .attr('fill', (d) => colorScale(d.value))
      .attr('opacity', (d) => {
        // Non-linear opacity scaling: outer low-density fringes are translucent, centers are solid
        const normalized = Math.min(1, d.value / maxVal);
        return normalized * opacity * 0.85;
      })
      .attr('stroke', (d) => colorScale(d.value))
      .attr('stroke-width', 0.5)
      .attr('stroke-opacity', 0.4)
      .style('pointer-events', 'none')
      .style('transition', 'fill 1s ease, opacity 1s ease');

    // Group for hotspot focal pulse indicators
    const markersG = svg.select<SVGGElement>('.d3-markers-group');

    const markers = markersG
      .selectAll<SVGGElement, HeatmapDataPoint>('g.hotspot-focal')
      .data(liveData, (d: any) => d.id)
      .enter()
      .append('g')
      .attr('class', 'd3-heatmap-element hotspot-focal cursor-pointer')
      .attr('transform', (d: HeatmapDataPoint) => `translate(${d.x}, ${d.y})`)
      .on('mouseenter', (event: any, d: HeatmapDataPoint) => {
        setHoveredHotspot(d);
        setTooltipPos({ x: d.x, y: d.y });
      })
      .on('mouseleave', () => {
        setHoveredHotspot(null);
        setTooltipPos(null);
      })
      .on('click', (event: any, d: HeatmapDataPoint) => {
        if (onSelectHotspot) onSelectHotspot(d);
      });

    // Outer pulsating ripple ring
    markers
      .append('circle')
      .attr('r', (d: HeatmapDataPoint) => 12 + d.trafficDensity * 16)
      .attr('fill', (d: HeatmapDataPoint) => (d.trafficDensity > 0.85 ? '#ef4444' : '#f59e0b'))
      .attr('opacity', 0.25)
      .attr('class', 'animate-pulse');

    // Inner sharp core node
    markers
      .append('circle')
      .attr('r', 4)
      .attr('fill', '#ffffff')
      .attr('stroke', (d: HeatmapDataPoint) => (d.trafficDensity > 0.85 ? '#dc2626' : '#d97706'))
      .attr('stroke-width', 2);

  }, [liveData, mode, bandwidth, opacity]);

  return (
    <>
      <svg
        ref={svgRef}
        viewBox="0 0 800 480"
        className="absolute inset-0 w-full h-full pointer-events-auto z-15"
        style={{ mixBlendMode: 'screen' }}
      >
        <defs>
          <filter id="heatmap-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Contour Paths Group with blur filter */}
        <g className="d3-contours-group" filter="url(#heatmap-blur)" />

        {/* Hotspot Markers Group */}
        <g className="d3-markers-group" />
      </svg>

      {/* Floating D3 Hotspot Hover Tooltip */}
      {hoveredHotspot && tooltipPos && (
        <div
          style={{
            left: `${(tooltipPos.x / 800) * 100}%`,
            top: `${(tooltipPos.y / 480) * 100}%`
          }}
          className="absolute -translate-x-1/2 -translate-y-full mb-3 z-40 bg-slate-900/95 text-white p-3 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md min-w-[240px] pointer-events-none transition-all"
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-500" />
              HOTSPOT INSPECTION
            </span>
            <span
              className={`px-1.5 py-0.2 text-[9px] font-black rounded font-mono ${
                hoveredHotspot.levelOfService === 'F'
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                  : hoveredHotspot.levelOfService === 'E'
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                  : 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
              }`}
            >
              LOS: {hoveredHotspot.levelOfService}
            </span>
          </div>

          <div className="font-bold text-xs text-white leading-tight">
            {hoveredHotspot.name}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {hoveredHotspot.corridorType}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-center font-mono">
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Density</span>
              <span className="text-xs font-black text-rose-400">
                {Math.round(hoveredHotspot.trafficDensity * 100)}%
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Speed</span>
              <span className="text-xs font-bold text-slate-200">
                {hoveredHotspot.avgSpeedKmH} km/h
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Incidents</span>
              <span className="text-xs font-bold text-amber-300">
                {hoveredHotspot.incidentCount}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
