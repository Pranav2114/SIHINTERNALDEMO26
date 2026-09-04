import { RoadDefect, FleetBus, HitAndRunIncident, CitizenReport, IndianVehicleCount, SimulationScene } from '../types';

export const SIMULATION_SCENES: SimulationScene[] = [
  {
    id: 'road_defect',
    label: 'Road Defects',
    badge: 'RDD2022 AI',
    title: 'Automated Road Defect & Pothole Detection',
    description: 'Bus-mounted edge cameras continuously segment 8+ defect types—including severe potholes, alligator cracks, and displaced manholes—with depth estimation and CPWD repair costing.',
    lawSection: 'IRC:SP:77 / IRC:82 Road Maintenance Standard',
    fineInr: 0,
    impactMetric: '78% Faster Municipal Repair Work Orders',
    boundingLabel: 'POTHOLE [SEV: HIGH | DEPTH: 8.4cm]',
    color: '#ef4444',
    actionText: 'Inspect Defect Telemetry'
  },
  {
    id: 'bus_lane',
    label: 'Bus Lanes',
    badge: 'Enforcement AI',
    title: 'Dedicated Bus Lane Encroachment',
    description: 'Private vehicles illegally driving or idling in priority BRTS / Bus Priority Lanes delay thousands of public commuters. Auto-flagged with time-in-lane validation.',
    lawSection: 'Motor Vehicles Act Sec 177 / 115',
    fineInr: 2000,
    impactMetric: 'Saved 14.8 mins avg route delay per trip',
    boundingLabel: 'BUS LANE VIOLATION [KA-05-MQ-9011]',
    color: '#f97316',
    actionText: 'Review Violation Video'
  },
  {
    id: 'bus_stop',
    label: 'Bus Stops',
    badge: 'Accessibility AI',
    title: 'Bus Stop Encroachment & Wheelchair Accessibility',
    description: 'Illegal parking or halting at designated bus stops prevents buses from docking curbside, stranding wheelchair users and pushing passengers into live traffic.',
    lawSection: 'Rights of Persons with Disabilities Act & MVA',
    fineInr: 1500,
    impactMetric: '100% Curbside Ramp Docking Restored',
    boundingLabel: 'BUS STOP VIOLATION [DL-3C-AL-4482]',
    color: '#06b6d4',
    actionText: 'Examine Curbside Clearance'
  },
  {
    id: 'bike_lane',
    label: 'Bike Lanes',
    badge: 'Micro-Mobility AI',
    title: 'Protected Cycle Track Obstruction',
    description: 'Two-wheelers and delivery vans encroaching on cycle tracks force cyclists into high-speed mixed traffic lanes, driving up severe cyclist collision rates.',
    lawSection: 'Urban Street Design Guidelines / IRC:11',
    fineInr: 1000,
    impactMetric: '63% Reduction in Cyclist Conflict Incidents',
    boundingLabel: 'BIKE LANE VIOLATION [KA-01-EE-7729]',
    color: '#10b981',
    actionText: 'View Cycle Track Feed'
  },
  {
    id: 'double_parking',
    label: 'Double Parking',
    badge: 'Flow AI',
    title: 'Double Parking & Bottleneck Enforcement',
    description: 'Just one double-parked commercial vehicle can throttle a 3-lane arterial corridor down to a crawl. Automated vision creates geo-fenced citations within 90 seconds.',
    lawSection: 'MVA Sec 122 / 177 Hazard Obstruction',
    fineInr: 1500,
    impactMetric: '31% Corridor Congestion Drop on Peak Hours',
    boundingLabel: 'DOUBLE PARKING [MH-02-CD-5510]',
    color: '#3b82f6',
    actionText: 'View Corridor Flow'
  },
  {
    id: 'pedestrian_hazard',
    label: 'Pedestrian Safety',
    badge: 'Vision-Pose AI',
    title: 'Pedestrian Conflict & Time-To-Collision (TTC < 2s)',
    description: 'Trajectory prediction analyzes pedestrian movement (especially school children near zebra crossings) and sounds instant acoustic/visual collision warning.',
    lawSection: 'IRC:103 Pedestrian Facilities in Urban Areas',
    fineInr: 0,
    impactMetric: 'Pre-collision warning issued 1.8s in advance',
    boundingLabel: 'PEDESTRIAN CONFLICT [TTC: 1.3s | RISK: CRITICAL]',
    color: '#eab308',
    actionText: 'Analyze Trajectory Vectors'
  },
  {
    id: 'hit_and_run',
    label: 'Hit-and-Run',
    badge: 'ALPR + Re-ID',
    title: 'Rash Driving, Hit-and-Run & Multi-Camera Re-ID',
    description: 'Instant ALPR extraction paired with cross-camera appearance matching (OSNet). Broadcasts tamper-proof blockchain evidence package directly to Traffic Police Command.',
    lawSection: 'BNS Sec 106(2) / MVA Sec 134',
    fineInr: 10000,
    impactMetric: 'Suspect vehicle tracked across 4 CCTV junctions',
    boundingLabel: 'HIT & RUN ALERT [DL-01-AB-1234]',
    color: '#dc2626',
    actionText: 'Track Intercept Corridor'
  },
  {
    id: 'sensor_fusion',
    label: 'Sensor Fusion',
    badge: 'Multi-Modal',
    title: 'Camera + Gyroscope + Dashcam Multi-Modal Fusion',
    description: 'Fuses high-res bus cameras with crowdsourced two-wheeler smartphone accelerometers and Swiggy/Uber dashcams. Eliminates false positives even in heavy monsoon rains.',
    lawSection: 'Smart Cities Mission Sensor Standard',
    fineInr: 0,
    impactMetric: '98.7% Fused Classification Certainty',
    boundingLabel: 'FUSED TELEMETRY [CAMERA 94% + GYRO 97%]',
    color: '#8b5cf6',
    actionText: 'Inspect Sensor Weights'
  }
];

export const INITIAL_DEFECTS: RoadDefect[] = [
  {
    id: 'DEF-8021',
    type: 'pothole',
    title: 'Severe Edge Pothole (Outer Ring Road)',
    severity: 'high',
    confidence: 0.96,
    latitude: 12.9716,
    longitude: 77.5946,
    roadName: 'Outer Ring Road, Kadubeesanahalli Junction, Bengaluru',
    detectedBy: 'BMTC Bus #KA-01-F-4092 (Jetson Xavier Edge Cam)',
    timestamp: '10 mins ago',
    dimensions: { lengthCm: 68, widthCm: 52, depthCm: 9.8 },
    rootCause: 'water_seepage',
    estimatedCostInr: 4850,
    repairMethod: 'Cold Mix Bituminous Emulsion Patch (IRC:116)',
    status: 'work_order_issued',
    verificationSource: 'edge_ai',
    datasetRef: 'RDD2022 (D00: Longitudinal, D40: Pothole)'
  },
  {
    id: 'DEF-8022',
    type: 'waterlogging',
    title: 'Monsoon Waterlogging & Sub-grade Erosion',
    severity: 'high',
    confidence: 0.94,
    latitude: 12.9352,
    longitude: 77.6245,
    roadName: 'Sony World Junction, Koramangala 80ft Road',
    detectedBy: 'BMTC Bus #KA-01-F-8812 (Jetson Xavier Edge Cam)',
    timestamp: '24 mins ago',
    dimensions: { lengthCm: 420, widthCm: 210, depthCm: 14.5 },
    rootCause: 'poor_drainage',
    estimatedCostInr: 18500,
    repairMethod: 'Stormwater culvert de-silt & Dense Bituminous Macadam',
    status: 'detected',
    verificationSource: 'edge_ai',
    datasetRef: 'Zenodo Road Damage & Bhuvan ISRO'
  },
  {
    id: 'DEF-8023',
    type: 'alligator_crack',
    title: 'Extensive Alligator Fatigue Cracking',
    severity: 'medium',
    confidence: 0.91,
    latitude: 12.9784,
    longitude: 77.6408,
    roadName: '100 Feet Road, Indiranagar',
    detectedBy: 'Citizen Upload #4409 (Verified via Swiggy Dashcam #109)',
    timestamp: '1 hour ago',
    dimensions: { lengthCm: 180, widthCm: 140, depthCm: 3.2 },
    rootCause: 'heavy_axle_overload',
    estimatedCostInr: 7200,
    repairMethod: 'Mastic Asphalt Seal Coating & Geotextile Membrane',
    status: 'verified',
    verificationSource: 'gyro_fusion',
    datasetRef: 'CRACK500 (2,000 deep crack training set)'
  },
  {
    id: 'DEF-8024',
    type: 'manhole_defect',
    title: 'Sunken Sewer Manhole Cover (5.6cm drop)',
    severity: 'high',
    confidence: 0.97,
    latitude: 12.9279,
    longitude: 77.6271,
    roadName: 'Sarjapur Main Road, near Bellandur Gate',
    detectedBy: 'Two-Wheeler Gyro Sensor #GW-44 (14.2 m/s² shock)',
    timestamp: '2 hours ago',
    dimensions: { lengthCm: 60, widthCm: 60, depthCm: 5.6 },
    rootCause: 'subbase_failure',
    estimatedCostInr: 3900,
    repairMethod: 'Frame height reset with high-early-strength epoxy concrete',
    status: 'work_order_issued',
    verificationSource: 'gyro_fusion',
    datasetRef: 'IISc BMD-45 Smart Infrastructure'
  },
  {
    id: 'DEF-8025',
    type: 'missing_divider',
    title: 'Damaged Concrete Median Divider',
    severity: 'medium',
    confidence: 0.88,
    latitude: 12.9912,
    longitude: 77.5812,
    roadName: 'Bellary Road, Ganganagar flyover descent',
    detectedBy: 'BMTC Bus #KA-01-F-1190 (Stereo Vision)',
    timestamp: '3 hours ago',
    dimensions: { lengthCm: 250, widthCm: 45, depthCm: 80 },
    rootCause: 'construction_defect',
    estimatedCostInr: 12400,
    repairMethod: 'Precast M40 Concrete Barrier Replacement with retroreflective tape',
    status: 'detected',
    verificationSource: 'edge_ai',
    datasetRef: 'NHAI Road Inventory Safety Manual'
  },
  {
    id: 'DEF-8026',
    type: 'missing_zebra_crossing',
    title: 'Faded School Zone Pedestrian Crossing',
    severity: 'medium',
    confidence: 0.93,
    latitude: 12.9611,
    longitude: 77.5999,
    roadName: 'Richmond Road, near Sacred Heart Girls School',
    detectedBy: 'BMTC Bus #KA-01-F-3301 (Vision AI)',
    timestamp: '4 hours ago',
    dimensions: { lengthCm: 800, widthCm: 300, depthCm: 0 },
    rootCause: 'construction_defect',
    estimatedCostInr: 5800,
    repairMethod: 'Thermoplastic paint coating with glass beads (IRC:35)',
    status: 'repaired',
    verificationSource: 'edge_ai',
    datasetRef: 'IISc UVH-26 Urban Road Benchmark'
  }
];

export const FLEET_BUSES: FleetBus[] = [
  {
    id: 'BUS-101',
    routeNumber: '500-D',
    plateNumber: 'KA-01-F-4092',
    driverName: 'Ramesh Kumar',
    currentSpeedKmH: 38,
    latitude: 12.9716,
    longitude: 77.5946,
    edgeDevice: 'NVIDIA Jetson AGX Xavier (32GB)',
    edgeFps: 42,
    temperatureC: 54,
    status: 'active',
    defectsDetectedToday: 18,
    laneViolationsLogged: 7
  },
  {
    id: 'BUS-102',
    routeNumber: '335-E',
    plateNumber: 'KA-01-F-8812',
    driverName: 'Suresh Patil',
    currentSpeedKmH: 26,
    latitude: 12.9352,
    longitude: 77.6245,
    edgeDevice: 'NVIDIA Jetson Orin Nano (8GB)',
    edgeFps: 34,
    temperatureC: 49,
    status: 'active',
    defectsDetectedToday: 24,
    laneViolationsLogged: 12
  },
  {
    id: 'BUS-103',
    routeNumber: 'G-2',
    plateNumber: 'KA-01-F-2219',
    driverName: 'Anil Gowda',
    currentSpeedKmH: 42,
    latitude: 12.9784,
    longitude: 77.6408,
    edgeDevice: 'NVIDIA Jetson Xavier NX',
    edgeFps: 38,
    temperatureC: 51,
    status: 'active',
    defectsDetectedToday: 11,
    laneViolationsLogged: 4
  },
  {
    id: 'BUS-104',
    routeNumber: 'KIA-8',
    plateNumber: 'KA-01-F-9023',
    driverName: 'Manjunath B',
    currentSpeedKmH: 58,
    latitude: 13.0112,
    longitude: 77.5714,
    edgeDevice: 'NVIDIA Jetson AGX Xavier',
    edgeFps: 44,
    temperatureC: 56,
    status: 'active',
    defectsDetectedToday: 9,
    laneViolationsLogged: 3
  }
];

export const INDIAN_VEHICLE_CLASSES: IndianVehicleCount[] = [
  { category: 'Two-Wheeler (Motorcycle/Scooter)', count: 4820, sharePercent: 44.2, color: '#06b6d4' },
  { category: 'Auto-Rickshaw (3-Wheeler LPG/CNG)', count: 2180, sharePercent: 20.0, color: '#eab308' },
  { category: 'Passenger Car (Hatchback/Sedan/SUV)', count: 2420, sharePercent: 22.2, color: '#3b82f6' },
  { category: 'Transit Bus (BMTC/DTC/State)', count: 520, sharePercent: 4.8, color: '#10b981' },
  { category: 'Light Commercial Vehicle (Tata Ace/Pickup)', count: 640, sharePercent: 5.9, color: '#f97316' },
  { category: 'Heavy Multi-Axle Truck', count: 180, sharePercent: 1.6, color: '#ef4444' },
  { category: 'Electric Rickshaw / Loader', count: 140, sharePercent: 1.3, color: '#8b5cf6' }
];

export const HIT_AND_RUN_DATA: HitAndRunIncident[] = [
  {
    id: 'HNR-2024-091',
    plateNumber: 'DL-01-AB-1234',
    plateConfidence: 0.94,
    vehicleModel: 'White Swift Dzire (Sedan)',
    vehicleColor: 'Pearl Arctic White',
    timestamp: 'Today at 07:42 AM',
    location: 'Marathahalli Underpass Intersection, Bengaluru',
    speedAtImpactKmH: 64,
    trackingCameras: ['BMTC-500D-Cam1', 'CCTV-Junction-14', 'UberDashcam-UB88', 'TrafficHQ-PTZ-03'],
    evidenceHash: '0x9a8f4b1e7c2d5830e32fba612984abdf3985a12a5cb9f32e92a83f1245cd7e11',
    reIdMatchScore: 0.982,
    status: 'intercept_alert_sent'
  },
  {
    id: 'HNR-2024-089',
    plateNumber: 'KA-04-MB-7821',
    plateConfidence: 0.89,
    vehicleModel: 'Black Mahindra Thar (Modified Bumper)',
    vehicleColor: 'Napoli Black',
    timestamp: 'Yesterday at 11:15 PM',
    location: 'Sarjapur Wipro Gate Circle',
    speedAtImpactKmH: 78,
    trackingCameras: ['ZomatoRider-Z82', 'CCTV-Circle-02', 'CCTV-Flyover-08'],
    evidenceHash: '0x5c72e90f23b169da418cd916298aa3ff8910b84c31daef671239c4d8123ef61a',
    reIdMatchScore: 0.954,
    status: 'flagged'
  }
];

export const CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'CIT-1049',
    reporterName: 'Pooja Sharma',
    credibilityScore: 94,
    defectType: 'pothole',
    location: 'Near Silk Board Flyover Ramp, Bengaluru',
    latitude: 12.9174,
    longitude: 77.6238,
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    timestamp: '35 mins ago',
    status: 'verified_by_fleet',
    karmaPointsAwarded: 150
  },
  {
    id: 'CIT-1050',
    reporterName: 'Arjun Nambiar',
    credibilityScore: 88,
    defectType: 'waterlogging',
    location: 'Domlur Intermediate Ring Road',
    latitude: 12.9609,
    longitude: 77.6387,
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    timestamp: '2 hours ago',
    status: 'pending_ai_verify',
    karmaPointsAwarded: 100
  },
  {
    id: 'CIT-1051',
    reporterName: 'Kavita Reddy',
    credibilityScore: 98,
    defectType: 'manhole_defect',
    location: 'HAL Old Airport Road, Murugeshpalya',
    latitude: 12.9567,
    longitude: 77.6521,
    photoUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&auto=format&fit=crop&q=80',
    timestamp: '5 hours ago',
    status: 'resolved',
    karmaPointsAwarded: 250
  }
];

export const RESEARCH_DATASETS = [
  {
    code: 'RDD2022',
    name: 'Road Damage Dataset 2022 (India Subset)',
    size: '47,420 images',
    classes: ['D00 Longitudinal Cracking', 'D10 Transverse Cracking', 'D20 Alligator Cracking', 'D40 Potholes'],
    provider: 'Crowdsensing Consortium & IEEE BigData',
    benchmarkAccuracy: '94.2% mAP@0.5'
  },
  {
    code: 'IISc UVH-26',
    name: 'Urban Vehicle Heterogeneity 26 (IISc Bengaluru)',
    size: '1.8M bounding boxes, 26,646 images',
    classes: ['14 Indian Vehicle Classes', 'Auto-Rickshaw', '2-Wheeler', 'LCV', 'Tractor', 'Bus'],
    provider: 'Indian Institute of Science (IISc), Bengaluru',
    benchmarkAccuracy: '92.6% mAP@0.5'
  },
  {
    code: 'BMD-45',
    name: 'Bengaluru Mobility Dataset 45 (IISc)',
    size: '3,679 CCTV Cameras Stream Feeds',
    classes: ['Bottleneck classification', 'Queue length', 'Spillback detection'],
    provider: 'IISc Center for Infrastructure, Sustainable Transport and Urban Planning',
    benchmarkAccuracy: '89.7% F1-Score'
  },
  {
    code: 'CPWD-SoR',
    name: 'Central Public Works Department Schedule of Rates',
    size: '2023-2024 Gazette Standard Rates',
    classes: ['Bituminous Concrete Item 5.12', 'Mastic Asphalt Item 5.16', 'Cold Mix Patching Item 5.24'],
    provider: 'Ministry of Housing and Urban Affairs (MoHUA)',
    benchmarkAccuracy: 'Official Statutory Benchmark'
  },
  {
    code: 'VeRi-776 & PKU',
    name: 'Vehicle Re-Identification & ALPR Benchmark',
    size: '49,357 images across 776 vehicles / 20 cameras',
    classes: ['Appearance Feature Embeddings', 'Camera Transition Matrix', 'Occlusion Vectors'],
    provider: 'PKU & AI City Challenge CityFlow',
    benchmarkAccuracy: '88.4% Rank-1 mAP'
  }
];
