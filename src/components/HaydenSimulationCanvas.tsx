import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RefreshCw, Eye, EyeOff, Camera, Video, ShieldCheck, Cpu, MapPin, Gauge } from 'lucide-react';
import { SimulationScene, ViolationType } from '../types';

interface HaydenSimulationCanvasProps {
  currentScene: SimulationScene;
  onSelectScene: (sceneId: ViolationType) => void;
  privacyBlur: boolean;
  onTogglePrivacyBlur: () => void;
}

export const HaydenSimulationCanvas: React.FC<HaydenSimulationCanvasProps> = ({
  currentScene,
  onSelectScene,
  privacyBlur,
  onTogglePrivacyBlur
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [cameraView, setCameraView] = useState<'driver' | 'isometric' | 'drone'>('driver');
  const [weatherMode, setWeatherMode] = useState<'day' | 'monsoon' | 'night'>('day');
  const [activeTelemetry, setActiveTelemetry] = useState({
    fps: 41,
    latencyMs: 23,
    speedKmH: 38,
    detectionConfidence: 96.4,
    edgeTemp: 52
  });

  // Animation frame state
  const animOffsetRef = useRef(0);
  const scanSweepRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = containerRef.current?.clientWidth || 900);
    let height = (canvas.height = containerRef.current?.clientHeight || 520);

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      width = canvas.width = containerRef.current.clientWidth;
      height = canvas.height = containerRef.current.clientHeight;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    let lastTime = performance.now();

    const render = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        animOffsetRef.current = (animOffsetRef.current + delta * 240) % 1000;
        scanSweepRef.current = (scanSweepRef.current + delta * 0.4) % 1;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. SKY / HORIZON BACKGROUND
      const horizonY = cameraView === 'isometric' ? height * 0.32 : cameraView === 'drone' ? height * 0.28 : height * 0.42;

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      if (weatherMode === 'night') {
        skyGrad.addColorStop(0, '#040711');
        skyGrad.addColorStop(1, '#0b1426');
      } else if (weatherMode === 'monsoon') {
        skyGrad.addColorStop(0, '#111827');
        skyGrad.addColorStop(1, '#1f2937');
      } else {
        skyGrad.addColorStop(0, '#091326');
        skyGrad.addColorStop(1, '#112240');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // Distant City Skyline Silhouette
      ctx.fillStyle = weatherMode === 'night' ? '#070d18' : '#0c182d';
      const buildingCount = 18;
      const bWidth = width / buildingCount;
      for (let i = 0; i < buildingCount; i++) {
        const bHeight = 35 + ((i * 37) % 55);
        ctx.fillRect(i * bWidth, horizonY - bHeight, bWidth - 4, bHeight);
        // Window lights at night
        if (weatherMode === 'night' && i % 2 === 0) {
          ctx.fillStyle = '#fbbf2433';
          ctx.fillRect(i * bWidth + 6, horizonY - bHeight + 8, 4, 8);
          ctx.fillRect(i * bWidth + 14, horizonY - bHeight + 18, 4, 8);
          ctx.fillStyle = '#070d18';
        }
      }

      // Vanishing Point coordinates
      const vpX = width * 0.5;
      const vpY = horizonY;

      // 2. GROUND & ROAD PERSPECTIVE
      // Road boundaries at bottom
      const roadBottomLeft = width * 0.08;
      const roadBottomRight = width * 0.92;
      const roadTopLeft = vpX - width * 0.09;
      const roadTopRight = vpX + width * 0.09;

      // Sidewalks & Road Verges
      // Left sidewalk
      ctx.fillStyle = '#172033';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(roadBottomLeft, height);
      ctx.lineTo(roadTopLeft, vpY);
      ctx.lineTo(0, vpY);
      ctx.closePath();
      ctx.fill();

      // Right sidewalk
      ctx.fillStyle = '#172033';
      ctx.beginPath();
      ctx.moveTo(roadBottomRight, height);
      ctx.lineTo(width, height);
      ctx.lineTo(width, vpY);
      ctx.lineTo(roadTopRight, vpY);
      ctx.closePath();
      ctx.fill();

      // Curb edge lines
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(roadBottomLeft, height);
      ctx.lineTo(roadTopLeft, vpY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(roadBottomRight, height);
      ctx.lineTo(roadTopRight, vpY);
      ctx.stroke();

      // Road Asphalt Surface
      const roadGrad = ctx.createLinearGradient(0, vpY, 0, height);
      if (weatherMode === 'monsoon') {
        roadGrad.addColorStop(0, '#0a101d');
        roadGrad.addColorStop(1, '#0e172a');
      } else {
        roadGrad.addColorStop(0, '#101826');
        roadGrad.addColorStop(1, '#182438');
      }
      ctx.fillStyle = roadGrad;
      ctx.beginPath();
      ctx.moveTo(roadBottomLeft, height);
      ctx.lineTo(roadBottomRight, height);
      ctx.lineTo(roadTopRight, vpY);
      ctx.lineTo(roadTopLeft, vpY);
      ctx.closePath();
      ctx.fill();

      // 3. DEDICATED LANES (RED ONLY BUS LANE or GREEN BIKE LANE)
      // Calculate 4 lane segments:
      // Lane 1 (Leftmost): Dedicated Red Bus Lane (or Bike Lane depending on scene)
      // Lane 2: Middle General Traffic
      // Lane 3: Right General Traffic
      // Lane 4: Right Curbside Parking / Drop-off
      const getLaneX = (ratio: number, y: number) => {
        const t = (y - vpY) / (height - vpY);
        const left = roadTopLeft + (roadBottomLeft - roadTopLeft) * t;
        const right = roadTopRight + (roadBottomRight - roadTopRight) * t;
        return left + (right - left) * ratio;
      };

      // Draw Red Bus Lane (Left Lane: 0.0 to 0.32)
      ctx.fillStyle = currentScene.id === 'bike_lane' 
        ? 'rgba(16, 185, 129, 0.28)' 
        : 'rgba(239, 68, 68, 0.25)';
      ctx.beginPath();
      ctx.moveTo(getLaneX(0, height), height);
      ctx.lineTo(getLaneX(0.32, height), height);
      ctx.lineTo(getLaneX(0.32, vpY), vpY);
      ctx.lineTo(getLaneX(0, vpY), vpY);
      ctx.closePath();
      ctx.fill();

      // Red/Green solid boundary stripe
      ctx.strokeStyle = currentScene.id === 'bike_lane' ? '#10b981' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(getLaneX(0.32, height), height);
      ctx.lineTo(getLaneX(0.32, vpY), vpY);
      ctx.stroke();

      // Painted Stencil Text on Road Surface: "ONLY BUS" or "CYCLE TRACK"
      const stencilY = height * 0.76 - ((animOffsetRef.current * 0.3) % (height * 0.35));
      if (stencilY > vpY + 40 && stencilY < height - 20) {
        ctx.save();
        const textX = getLaneX(0.16, stencilY);
        ctx.translate(textX, stencilY);
        ctx.scale(1.2, 0.35); // perspective distortion for road pavement
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = 'bold 22px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        if (currentScene.id === 'bike_lane') {
          ctx.fillText('🚴 CYCLE ONLY', 0, 0);
        } else {
          ctx.fillText('BUS ONLY', 0, -10);
          ctx.fillText('PRIORITY', 0, 15);
        }
        ctx.restore();
      }

      // Middle Lane dashed white divider (0.64 ratio)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      const dashSpeed = animOffsetRef.current;
      for (let y = vpY + 10; y < height; y += 36) {
        const t = (y - vpY) / (height - vpY);
        const yPos = vpY + ((y - vpY + dashSpeed * t) % (height - vpY));
        const dashLen = 14 * t + 4;
        const xPos = getLaneX(0.64, yPos);
        ctx.beginPath();
        ctx.moveTo(xPos, yPos);
        ctx.lineTo(getLaneX(0.64, Math.min(height, yPos + dashLen)), Math.min(height, yPos + dashLen));
        ctx.stroke();
      }

      // Center Double Yellow Lines (0.32 to 0.33)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(getLaneX(0.34, height), height);
      ctx.lineTo(getLaneX(0.34, vpY), vpY);
      ctx.stroke();

      // Zebra Crossing / Crosswalk at middle distance
      const crosswalkY = height * 0.62;
      const crosswalkDepth = 28;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let xStep = 0.05; xStep <= 0.95; xStep += 0.08) {
        ctx.beginPath();
        ctx.moveTo(getLaneX(xStep, crosswalkY), crosswalkY);
        ctx.lineTo(getLaneX(xStep + 0.04, crosswalkY), crosswalkY);
        ctx.lineTo(getLaneX(xStep + 0.04, crosswalkY + crosswalkDepth), crosswalkY + crosswalkDepth);
        ctx.lineTo(getLaneX(xStep, crosswalkY + crosswalkDepth), crosswalkY + crosswalkDepth);
        ctx.closePath();
        ctx.fill();
      }

      // 4. ROAD DEFECTS ON PAVEMENT (Potholes, Cracks, Manholes)
      const renderPothole = (laneRatio: number, yPos: number, depthLabel: string) => {
        const x = getLaneX(laneRatio, yPos);
        // Outer fracture crater
        ctx.fillStyle = '#07090e';
        ctx.beginPath();
        ctx.ellipse(x, yPos, 42, 16, -0.1, 0, Math.PI * 2);
        ctx.fill();
        // Inner depth cavity
        ctx.fillStyle = '#020408';
        ctx.beginPath();
        ctx.ellipse(x - 3, yPos + 2, 28, 10, -0.1, 0, Math.PI * 2);
        ctx.fill();
        // Jagged crack lines
        ctx.strokeStyle = '#222d42';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - 40, yPos);
        ctx.lineTo(x - 55, yPos - 6);
        ctx.lineTo(x - 70, yPos - 3);
        ctx.moveTo(x + 35, yPos + 3);
        ctx.lineTo(x + 60, yPos + 8);
        ctx.stroke();

        // 3D Bounding Wireframe (Hayden AI Style)
        renderHaydenBoundingBox(
          ctx,
          x - 55,
          yPos - 22,
          110,
          36,
          '#ef4444',
          `DEFECT: POTHOLE [${depthLabel}]`,
          true
        );
      };

      if (currentScene.id === 'road_defect') {
        renderPothole(0.5, height * 0.74, 'CONF: 96.8% | DEPTH: 9.4cm');
        // Another crack in the left lane
        const crackX = getLaneX(0.18, height * 0.54);
        ctx.strokeStyle = '#ef444488';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(crackX, height * 0.54);
        ctx.lineTo(crackX + 25, height * 0.55);
        ctx.lineTo(crackX + 45, height * 0.53);
        ctx.stroke();
      }

      // 5. VEHICLES & SCENARIO ACTORS
      // Draw Bus Stop Shelter (Right side curb)
      if (currentScene.id === 'bus_stop' || currentScene.id === 'bus_lane') {
        const shelterY = height * 0.58;
        const shelterX = getLaneX(0.92, shelterY) + 12;
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(shelterX, shelterY - 50, 60, 50);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(shelterX + 4, shelterY - 46, 52, 22);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('BMTC STOP', shelterX + 6, shelterY - 32);
      }

      // Helper function to draw Hayden AI 3D Bounding Box with glowing corner brackets
      function renderHaydenBoundingBox(
        c: CanvasRenderingContext2D,
        bx: number,
        by: number,
        bw: number,
        bh: number,
        colorHex: string,
        label: string,
        isWarning = false
      ) {
        c.save();
        // Box background tint
        c.fillStyle = isWarning ? 'rgba(239, 68, 68, 0.12)' : 'rgba(56, 189, 248, 0.12)';
        c.fillRect(bx, by, bw, bh);

        // Wireframe border
        c.strokeStyle = colorHex;
        c.lineWidth = 1.5;
        c.strokeRect(bx, by, bw, bh);

        // 3D Corner brackets
        const cornerLen = Math.min(14, bw * 0.25);
        c.lineWidth = 3;
        c.beginPath();
        // Top Left
        c.moveTo(bx, by + cornerLen);
        c.lineTo(bx, by);
        c.lineTo(bx + cornerLen, by);
        // Top Right
        c.moveTo(bx + bw - cornerLen, by);
        c.lineTo(bx + bw, by);
        c.lineTo(bx + bw, by + cornerLen);
        // Bottom Left
        c.moveTo(bx, by + bh - cornerLen);
        c.lineTo(bx, by + bh);
        c.lineTo(bx + cornerLen, by + bh);
        // Bottom Right
        c.moveTo(bx + bw - cornerLen, by + bh);
        c.lineTo(bx + bw, by + bh);
        c.lineTo(bx + bw, by + bh - cornerLen);
        c.stroke();

        // 3D Perspective Top/Depth Extrusion (Isometric look)
        const depth = 16;
        c.strokeStyle = `${colorHex}66`;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(bx, by);
        c.lineTo(bx + depth * 0.6, by - depth);
        c.lineTo(bx + bw + depth * 0.6, by - depth);
        c.lineTo(bx + bw, by);
        c.lineTo(bx + bw + depth * 0.6, by - depth);
        c.lineTo(bx + bw + depth * 0.6, by + bh - depth);
        c.lineTo(bx + bw, by + bh);
        c.stroke();

        // Label Badge Tag above box
        c.font = 'bold 11px "JetBrains Mono", monospace';
        const labelWidth = c.measureText(label).width + 16;
        c.fillStyle = colorHex;
        c.fillRect(bx, by - 22, labelWidth, 20);

        c.fillStyle = '#000000';
        c.fillText(label, bx + 8, by - 8);

        c.restore();
      }

      // Draw Actors according to Scene
      if (currentScene.id === 'bus_lane') {
        // Violating White Sedan parked/moving in Red Bus Lane
        const carY = height * 0.68;
        const carX = getLaneX(0.16, carY);
        drawCar(ctx, carX - 35, carY - 45, 75, 45, '#e2e8f0', privacyBlur);
        renderHaydenBoundingBox(
          ctx,
          carX - 45,
          carY - 55,
          95,
          60,
          '#ef4444',
          'BUS LANE VIOLATION: KA-05-MQ-9011',
          true
        );
      } else if (currentScene.id === 'bus_stop') {
        // Car parked directly blocking the curbside bus stop
        const carY = height * 0.64;
        const carX = getLaneX(0.82, carY);
        drawCar(ctx, carX - 35, carY - 45, 75, 45, '#38bdf8', privacyBlur);
        renderHaydenBoundingBox(
          ctx,
          carX - 45,
          carY - 55,
          95,
          60,
          '#06b6d4',
          'BUS STOP VIOLATION: DL-3C-AL-4482',
          true
        );
      } else if (currentScene.id === 'bike_lane') {
        // Delivery bike / scooter encroaching in Green Cycle track
        const bikeY = height * 0.7;
        const bikeX = getLaneX(0.16, bikeY);
        drawTwoWheeler(ctx, bikeX, bikeY, '#fbbf24');
        renderHaydenBoundingBox(
          ctx,
          bikeX - 25,
          bikeY - 55,
          50,
          65,
          '#10b981',
          'BIKE LANE VIOLATION: KA-01-EE-7729',
          true
        );
      } else if (currentScene.id === 'double_parking') {
        // Two cars side-by-side causing bottleneck
        const car1Y = height * 0.68;
        const car1X = getLaneX(0.82, car1Y);
        drawCar(ctx, car1X - 35, car1Y - 45, 70, 45, '#64748b', privacyBlur);

        const car2Y = height * 0.68;
        const car2X = getLaneX(0.58, car2Y);
        drawCar(ctx, car2X - 35, car2Y - 45, 75, 45, '#f87171', privacyBlur);

        renderHaydenBoundingBox(
          ctx,
          car2X - 45,
          car2Y - 55,
          95,
          60,
          '#3b82f6',
          'DOUBLE PARKING: MH-02-CD-5510',
          true
        );
      } else if (currentScene.id === 'pedestrian_hazard') {
        // Pedestrian crossing on zebra with red alert trajectory vector
        const pedX = getLaneX(0.48, crosswalkY + 12);
        const pedY = crosswalkY + 12;
        drawPedestrian(ctx, pedX, pedY);

        // Trajectory vector arrow
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(pedX, pedY);
        ctx.lineTo(pedX + 60, pedY);
        ctx.stroke();
        ctx.setLineDash([]);

        renderHaydenBoundingBox(
          ctx,
          pedX - 18,
          pedY - 50,
          36,
          55,
          '#eab308',
          'TTC: 1.3s [CRITICAL CONFLICT]',
          true
        );
      } else if (currentScene.id === 'hit_and_run') {
        // Speeding SUV with license plate extraction
        const carY = height * 0.66;
        const carX = getLaneX(0.52, carY);
        drawCar(ctx, carX - 40, carY - 48, 85, 48, '#ffffff', privacyBlur);
        renderHaydenBoundingBox(
          ctx,
          carX - 50,
          carY - 60,
          105,
          66,
          '#dc2626',
          'HIT & RUN ALERT: DL-01-AB-1234',
          true
        );
      } else if (currentScene.id === 'sensor_fusion') {
        // Distinctive Indian Auto Rickshaw in center lane
        const autoY = height * 0.66;
        const autoX = getLaneX(0.52, autoY);
        drawAutoRickshaw(ctx, autoX, autoY);
        renderHaydenBoundingBox(
          ctx,
          autoX - 32,
          autoY - 54,
          64,
          60,
          '#8b5cf6',
          'FUSED: AUTO-RICKSHAW [CONF: 98.7%]',
          false
        );
      } else {
        // Default: general moving auto-rickshaw
        const autoY = height * 0.66;
        const autoX = getLaneX(0.8, autoY);
        drawAutoRickshaw(ctx, autoX, autoY);
      }

      // 6. DRAW OUR TRANSIT BUS (POV Driver Hood or Bus Roof Cam)
      // Bus Dashboard / Windshield frame at bottom
      if (cameraView === 'driver') {
        const hoodY = height * 0.88;
        // Bus front hood
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(width * 0.2, height);
        ctx.lineTo(width * 0.28, hoodY);
        ctx.lineTo(width * 0.72, hoodY);
        ctx.lineTo(width * 0.8, height);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width * 0.28, hoodY);
        ctx.lineTo(width * 0.72, hoodY);
        ctx.stroke();

        // Edge AI Dual Camera Housing on dashboard
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(width * 0.46, hoodY - 8, 80, 10);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(width * 0.485, hoodY - 3, 3.5, 0, Math.PI * 2);
        ctx.arc(width * 0.535, hoodY - 3, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. LASER SCANNING SWEEP (Hayden AI Vision HUD Effect)
      const sweepY = vpY + (height - vpY) * scanSweepRef.current;
      const sweepLeft = getLaneX(0.05, sweepY);
      const sweepRight = getLaneX(0.95, sweepY);

      const sweepGrad = ctx.createLinearGradient(sweepLeft, sweepY, sweepRight, sweepY);
      sweepGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      sweepGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.7)');
      sweepGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.strokeStyle = sweepGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sweepLeft, sweepY);
      ctx.lineTo(sweepRight, sweepY);
      ctx.stroke();

      // Subtle holographic grid lines under the sweep
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      for (let g = 0.1; g <= 0.9; g += 0.1) {
        ctx.beginPath();
        ctx.moveTo(getLaneX(g, sweepY - 15), sweepY - 15);
        ctx.lineTo(getLaneX(g, sweepY + 15), sweepY + 15);
        ctx.stroke();
      }

      // Monsoon rain droplets
      if (weatherMode === 'monsoon') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let r = 0; r < 40; r++) {
          const rx = (r * 37 + animOffsetRef.current * 3) % width;
          const ry = (r * 53 + animOffsetRef.current * 7) % height;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 4, ry + 16);
          ctx.stroke();
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
    };
  }, [currentScene, isPlaying, cameraView, weatherMode, privacyBlur]);

  // Helper Actor Draw functions
  function drawCar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    bodyColor: string,
    blurPrivacy: boolean
  ) {
    ctx.save();
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h, w * 0.55, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.roundRect(x, y + h * 0.35, w, h * 0.6, 6);
    ctx.fill();

    // Cabin / Roof
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(x + w * 0.15, y, w * 0.7, h * 0.45, 4);
    ctx.fill();

    // Rear windshield
    ctx.fillStyle = '#38bdf844';
    ctx.fillRect(x + w * 0.22, y + 4, w * 0.56, h * 0.3);

    // Tail lights
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 4, y + h * 0.5, 10, 6);
    ctx.fillRect(x + w - 14, y + h * 0.5, 10, 6);

    // Number Plate (With Privacy Blur Toggle - DPDP Act compliance)
    const plateX = x + w * 0.3;
    const plateY = y + h * 0.65;
    const plateW = w * 0.4;
    const plateH = 10;

    if (blurPrivacy) {
      ctx.fillStyle = 'rgba(100, 116, 139, 0.9)';
      ctx.fillRect(plateX, plateY, plateW, plateH);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('[BLURRED]', plateX + 2, plateY + 8);
    } else {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(plateX, plateY, plateW, plateH);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 7px "JetBrains Mono", monospace';
      ctx.fillText('KA-05-MQ', plateX + 2, plateY + 8);
    }
    ctx.restore();
  }

  function drawAutoRickshaw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    // Distinctive Indian Auto Rickshaw: Green lower body, Yellow roof
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(x, y, 26, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Yellow Canopy Roof
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.roundRect(x - 22, y - 48, 44, 20, [8, 8, 2, 2]);
    ctx.fill();

    // Green Lower Metal Body
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.roundRect(x - 24, y - 28, 48, 24, [2, 2, 6, 6]);
    ctx.fill();

    // Windshield frame
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 18, y - 38, 36, 12);

    // Tail light strip
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x - 18, y - 10, 8, 4);
    ctx.fillRect(x + 10, y - 10, 8, 4);
    ctx.restore();
  }

  function drawTwoWheeler(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
    ctx.save();
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(x, y, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Scooter Body
    ctx.fillStyle = color;
    ctx.fillRect(x - 6, y - 30, 12, 22);

    // Delivery Box (Zomato/Swiggy Red/Orange box)
    ctx.fillStyle = '#f97316';
    ctx.fillRect(x - 10, y - 44, 20, 14);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 6px sans-serif';
    ctx.fillText('DELIV', x - 8, y - 34);

    // Rider helmet
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(x, y - 52, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPedestrian(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(x, y, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 3, y - 15);
    ctx.lineTo(x - 4, y);
    ctx.moveTo(x + 3, y - 15);
    ctx.lineTo(x + 5, y);
    ctx.stroke();

    // Torso / Jacket (School uniform blue)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x - 6, y - 36, 12, 22);

    // Head
    ctx.fillStyle = '#fcd34d';
    ctx.beginPath();
    ctx.arc(x, y - 42, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-[#0F172A] shadow-md">
      {/* Top HUD Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            LIVE JETSON EDGE AI
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Xavier AGX • {activeTelemetry.fps} FPS</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-300">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeTelemetry.speedKmH} km/h • {activeTelemetry.latencyMs}ms Latency</span>
          </div>
        </div>

        {/* View Controls & Privacy Blur Toggle */}
        <div className="flex items-center gap-2">
          {/* Camera Angles */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setCameraView('driver')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                cameraView === 'driver' ? 'bg-blue-600 text-white shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Bus Dashcam
            </button>
            <button
              onClick={() => setCameraView('isometric')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                cameraView === 'isometric' ? 'bg-blue-600 text-white shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Corridor 3D
            </button>
            <button
              onClick={() => setCameraView('drone')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                cameraView === 'drone' ? 'bg-blue-600 text-white shadow-sm font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Drone Chase
            </button>
          </div>

          {/* Weather / Light Condition */}
          <div className="hidden lg:flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setWeatherMode('day')}
              className={`px-2 py-1 rounded font-medium ${weatherMode === 'day' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
              title="Daylight Vision"
            >
              Day
            </button>
            <button
              onClick={() => setWeatherMode('monsoon')}
              className={`px-2 py-1 rounded font-medium ${weatherMode === 'monsoon' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              title="Monsoon Waterlogging Mode"
            >
              Rain
            </button>
            <button
              onClick={() => setWeatherMode('night')}
              className={`px-2 py-1 rounded font-medium ${weatherMode === 'night' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              title="Night Infrared Mode"
            >
              Night
            </button>
          </div>

          {/* DPDP Act Privacy Blur Toggle */}
          <button
            onClick={onTogglePrivacyBlur}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              privacyBlur
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
            }`}
            title="Feature 10: Privacy-Preserving Edge AI (DPDP Act 2023)"
          >
            {privacyBlur ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">DPDP Blur:</span>
            <span>{privacyBlur ? 'ACTIVE' : 'RAW'}</span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div ref={containerRef} className="w-full h-[460px] sm:h-[520px] relative">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Floating Hayden AI Style Card (Clean Minimalism Light Glass Card) */}
        <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-8 z-20 max-w-sm sm:max-w-md p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl text-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {currentScene.badge}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {currentScene.lawSection}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
            {currentScene.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
            {currentScene.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{currentScene.impactMetric}</span>
            </div>
            {currentScene.fineInr > 0 && (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Statutory Penalty: ₹{currentScene.fineInr.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* GPS Coordinate Watermark (Bottom Right) */}
        <div className="absolute bottom-16 sm:bottom-20 right-4 sm:right-8 z-10 hidden md:flex flex-col items-end gap-1 font-mono text-xs text-slate-400 bg-black/50 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1 text-blue-400 font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>12.9716° N, 77.5946° E</span>
          </div>
          <span>BMTC Transit Corridor • Outer Ring Road</span>
          <span className="text-emerald-400 font-semibold">Edge Hash: 0x9a8f...7e11</span>
        </div>
      </div>

      {/* Hayden AI Style Bottom Carousel / Tab Switcher */}
      <div className="px-4 py-3 bg-[#0F172A] border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2 pr-1 shrink-0 flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5 text-blue-400" />
          SOLUTIONS:
        </span>
        {[
          { id: 'road_defect', label: 'ROAD DEFECTS' },
          { id: 'bus_lane', label: 'BUS LANES' },
          { id: 'bus_stop', label: 'BUS STOPS' },
          { id: 'bike_lane', label: 'BIKE LANES' },
          { id: 'double_parking', label: 'DOUBLE PARKING' },
          { id: 'pedestrian_hazard', label: 'PEDESTRIAN TTC' },
          { id: 'hit_and_run', label: 'HIT & RUN' },
          { id: 'sensor_fusion', label: 'SENSOR FUSION' },
        ].map((item) => {
          const isActive = currentScene.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScene(item.id as ViolationType)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
