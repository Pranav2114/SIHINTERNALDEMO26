import { 
  RoadDefect, FleetBus, HitAndRunIncident, CitizenReport, IndianVehicleCount, SimulationScene,
  CityInfrastructureRecommendation, HotspotSensitivityZone, PenaltyStat, EmergencyDispatchLog
} from '../types';

export const SIMULATION_SCENES: SimulationScene[] = [
  {
    id: 'road_defect',
    label: 'Road Defects',
    badge: 'Core Model 1',
    title: 'Road Defect Detection (Potholes, Damage, Leakage, Garbage)',
    description: 'Sub-features: Potholes via Manual upload, Dashcam video, or Gyroscope sensor | Damaged Road | Underground Water Leakage | Illegal Garbage Dumping. Automatically validates contractor warranty (DLP) vs municipal repair.',
    lawSection: 'IRC:SP:77 / IRC:82 Road Maintenance Standard',
    fineInr: 0,
    impactMetric: '78% Faster Repair Work Orders & Zero-Cost Warranty Claims',
    boundingLabel: 'POTHOLE [DASHCAM: 96.8% | DEPTH: 9.4cm]',
    color: '#ef4444',
    actionText: 'Inspect Defect Telemetry'
  },
  {
    id: 'bus_lane',
    label: 'Traffic & Emergency',
    badge: 'Core Model 2',
    title: 'Traffic Monitoring: Wrong Side, No Helmet & Ambulance Green Corridor',
    description: 'Continuous multi-lane vehicle detection: wrong-way counterflow alerts, no-helmet rider detection, and real-time ambulance & police siren tracking that auto-clears downstream signals into a Green Corridor.',
    lawSection: 'Motor Vehicles Act Sec 115 / 129 / 177 / 194E',
    fineInr: 2000,
    impactMetric: 'Ambulance travel time reduced by 41% across corridors',
    boundingLabel: 'AMBULANCE DETECTED [GREEN CORRIDOR SIGNAL CLEARED]',
    color: '#3b82f6',
    actionText: 'Track Emergency Corridor'
  },
  {
    id: 'pedestrian_hazard',
    label: 'Pedestrian Safety',
    badge: 'Core Model 3',
    title: 'Pedestrian Safety Model & Infrastructure Pole Suggestions',
    description: 'Tracks vulnerable pedestrians (elderly, wheelchair users, school children), identifies missing zebra crossings, and generates municipal suggestions to install smart traffic poles ("Turn Ahead", "School Zone").',
    lawSection: 'IRC:103 / IRC:35 Pedestrian Facilities & Signages',
    fineInr: 0,
    impactMetric: 'Pre-collision warnings & Automated Traffic Pole suggestions',
    boundingLabel: 'VULNERABLE PEDESTRIAN [ZEBRA CROSSING SUGGESTED]',
    color: '#eab308',
    actionText: 'Analyze Trajectory Vectors'
  },
  {
    id: 'hit_and_run',
    label: 'Hit & Run / Rash',
    badge: 'Core Model 4',
    title: 'Hit & Run / Rash Driving & Auto-Dispatch (108/112)',
    description: 'High-speed vehicle tracking, instant ALPR license plate extraction, collision event logging, and auto-dispatching 108 Emergency Ambulance & 112 Police Control Room with encrypted evidence.',
    lawSection: 'BNS Sec 106(2) / MVA Sec 134',
    fineInr: 10000,
    impactMetric: 'Auto 108 Ambulance + 112 Police Dispatch in 14.2s',
    boundingLabel: 'HIT & RUN ALERT [KA-01-AB-1234 | 108 DISPATCHED]',
    color: '#dc2626',
    actionText: 'Inspect Intercept Alert'
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
    roadName: 'Outer Ring Road, Kadubeesanahalli Junction, Ward 150',
    detectedBy: 'BMTC Bus #KA-01-F-4092 (Forward Dashcam AI)',
    timestamp: '10 mins ago',
    dimensions: { lengthCm: 68, widthCm: 52, depthCm: 9.8 },
    rootCause: 'water_seepage',
    estimatedCostInr: 4850,
    repairMethod: 'Cold Mix Bituminous Emulsion Patch (IRC:116)',
    status: 'work_order_issued',
    verificationSource: 'edge_ai',
    potholeDetectionMode: 'dashcam_feed',
    datasetRef: 'RDD2022 (D00: Longitudinal, D40: Pothole)',
    recurrenceCount: 42,
    contractorWarranty: {
      isUnderWarranty: true,
      contractorName: 'L&T Transportation Infrastructure Ltd.',
      contractorPhone: '+91-80-2558-4410',
      contractId: 'NHAI/BLR/ORR-2023-41',
      awardDate: '2023-11-10',
      warrantyExpiryDate: '2026-11-09',
      daysRemaining: 182,
      defectLiabilityClause: 'Clause 10.4: Free rectification of surface defects within 36 months of handover',
      guaranteeAmountInr: 45000000
    },
    resourceEstimation: {
      workersNeeded: 5,
      estimatedDays: 1.5,
      laborRatePerDayInr: 750,
      laborCostInr: 5625,
      materialCostInr: 2800,
      equipmentCostInr: 2200,
      totalCostInr: 10625,
      materialsList: ['VG-30 Bitumen Emulsion', '20mm crushed stone aggregate', 'Tack coat'],
      equipmentList: ['Vibratory Plate Compactor', 'Infrared Asphalt Heater', 'Safety Cones'],
      suggestedDetour: 'Divert light vehicles via Panathur Main Road; keep inner bus lane active',
      detourCongestionReduction: '48% reduction in peak bottleneck delay'
    }
  },
  {
    id: 'DEF-8022',
    type: 'water_leakage',
    title: 'BWSSB Pipeline Leakage & Asphalt Subsidence',
    severity: 'high',
    confidence: 0.94,
    latitude: 12.9352,
    longitude: 77.6245,
    roadName: 'Sony World Junction, Koramangala 80ft Road, Ward 151',
    detectedBy: 'BMTC Bus #KA-01-F-8812 (Jetson Xavier Edge Cam)',
    timestamp: '24 mins ago',
    dimensions: { lengthCm: 420, widthCm: 210, depthCm: 14.5 },
    rootCause: 'pipe_burst',
    estimatedCostInr: 32500,
    repairMethod: 'Pipe sleeve weld by BWSSB + Dense Bituminous Macadam (DBM) base re-lay',
    status: 'detected',
    verificationSource: 'edge_ai',
    datasetRef: 'Zenodo Road Damage & Bhuvan ISRO',
    recurrenceCount: 35,
    contractorWarranty: {
      isUnderWarranty: false,
      contractorName: 'Municipal PWD Direct Maintenance (Warranty Expired Jan 2024)',
      contractorPhone: '+91-80-2222-1188',
      contractId: 'BBMP/SOUTH/2021/KOR-99',
      awardDate: '2021-01-15',
      warrantyExpiryDate: '2024-01-14',
      daysRemaining: 0,
      defectLiabilityClause: 'Defect Liability Period (DLP) expired. Municipal funding sanctioned.',
      guaranteeAmountInr: 0
    },
    resourceEstimation: {
      workersNeeded: 7,
      estimatedDays: 3,
      laborRatePerDayInr: 750,
      laborCostInr: 15750,
      materialCostInr: 12500,
      equipmentCostInr: 8500,
      totalCostInr: 36750,
      materialsList: ['Wet Mix Macadam (WMM)', 'Bituminous Concrete 50mm', 'Geotextile fabric'],
      equipmentList: ['Tandem Smooth Wheel Roller', 'Mini Excavator (JCB 3DX)', 'Water Pump 5HP'],
      suggestedDetour: 'Divert through 4th Block Koramangala 17th Main and Intermediate Ring Road',
      detourCongestionReduction: '62% traffic bypass achieved'
    }
  },
  {
    id: 'DEF-8023',
    type: 'damaged_road',
    title: 'Extensive Alligator Fatigue & Structural Rutting',
    severity: 'medium',
    confidence: 0.91,
    latitude: 12.9784,
    longitude: 77.6408,
    roadName: '100 Feet Road, Indiranagar, Ward 80',
    detectedBy: 'Citizen Upload #4409 (Manual Dashcam Verified)',
    timestamp: '1 hour ago',
    dimensions: { lengthCm: 180, widthCm: 140, depthCm: 3.2 },
    rootCause: 'heavy_axle_overload',
    estimatedCostInr: 18400,
    repairMethod: 'Mastic Asphalt Seal Coating & Geotextile Reinforcement',
    status: 'verified',
    verificationSource: 'citizen_upload',
    potholeDetectionMode: 'manual_upload',
    datasetRef: 'CRACK500 (2,000 deep crack training set)',
    recurrenceCount: 28,
    contractorWarranty: {
      isUnderWarranty: true,
      contractorName: 'NCC Urban Infrastructure Ltd.',
      contractorPhone: '+91-80-2227-7789',
      contractId: 'BBMP/ENG/2024/CR-904',
      awardDate: '2024-02-01',
      warrantyExpiryDate: '2027-01-31',
      daysRemaining: 480,
      defectLiabilityClause: 'IRC:82 Maintenance Clause: Contractor must resurface cracked segments within 7 days of notice',
      guaranteeAmountInr: 28000000
    },
    resourceEstimation: {
      workersNeeded: 6,
      estimatedDays: 2,
      laborRatePerDayInr: 750,
      laborCostInr: 9000,
      materialCostInr: 9800,
      equipmentCostInr: 4500,
      totalCostInr: 23300,
      materialsList: ['Mastic Asphalt Cake', 'Polymer Modified Bitumen (PMB-40)', 'Bitumen tack coat'],
      equipmentList: ['Mastic Asphalt Cooker', 'Mechanical Broom', 'Safety Barricades'],
      suggestedDetour: 'Divert commercial trucks via Old Madras Road; allow two-wheelers in right lane',
      detourCongestionReduction: '52% delay avoided during night shift'
    }
  },
  {
    id: 'DEF-8024',
    type: 'pothole',
    title: 'High-Impact Pothole with Gyro Z-Shock (>15 m/s²)',
    severity: 'high',
    confidence: 0.97,
    latitude: 12.9279,
    longitude: 77.6271,
    roadName: 'Sarjapur Main Road, near Bellandur Gate, Ward 150',
    detectedBy: 'Crowdsourced Two-Wheeler Gyro Sensor #GW-44 (16.4 m/s² shock)',
    timestamp: '2 hours ago',
    dimensions: { lengthCm: 92, widthCm: 74, depthCm: 11.2 },
    rootCause: 'subbase_failure',
    estimatedCostInr: 6200,
    repairMethod: 'Polymer modified cold patch compaction & concrete frame collar',
    status: 'work_order_issued',
    verificationSource: 'gyro_fusion',
    potholeDetectionMode: 'gyroscope_sensor',
    datasetRef: 'IISc BMD-45 Smart Infrastructure',
    recurrenceCount: 39,
    contractorWarranty: {
      isUnderWarranty: false,
      contractorName: 'Municipal Zone East Maintenance Squad',
      contractorPhone: '+91-80-2550-9922',
      contractId: 'BBMP/EAST/2022/MAINT-04',
      awardDate: '2022-04-10',
      warrantyExpiryDate: '2023-04-09',
      daysRemaining: 0,
      defectLiabilityClause: 'Warranty expired. Municipal asphalt batching plant to supply material.',
      guaranteeAmountInr: 0
    },
    resourceEstimation: {
      workersNeeded: 4,
      estimatedDays: 1,
      laborRatePerDayInr: 750,
      laborCostInr: 3000,
      materialCostInr: 3400,
      equipmentCostInr: 1800,
      totalCostInr: 8200,
      materialsList: ['Cold mix high-performance asphalt', 'Stone dust filler', 'Rapid setting emulsion RS-1'],
      equipmentList: ['Hand-operated roller', 'Gas torch heater', 'Warning flashers'],
      suggestedDetour: 'Single-lane throttling with flagmen; detour light traffic via Kasavanahalli Road',
      detourCongestionReduction: '38% queue dissipation'
    }
  },
  {
    id: 'DEF-8025',
    type: 'waste_garbage',
    title: 'Illegal Construction Debris & Garbage Encroachment',
    severity: 'medium',
    confidence: 0.95,
    latitude: 12.9172,
    longitude: 77.6228,
    roadName: 'Hosur Road, near Silk Board Flyover Ramp, Ward 173',
    detectedBy: 'BMTC Bus #KA-01-F-1190 (Curbside Segmentation Cam)',
    timestamp: '3 hours ago',
    dimensions: { lengthCm: 550, widthCm: 180, depthCm: 65 },
    rootCause: 'illegal_dumping',
    estimatedCostInr: 7500,
    repairMethod: 'Hydraulic Bobcat clearing & anti-littering CCTV surveillance pole installation',
    status: 'detected',
    verificationSource: 'edge_ai',
    datasetRef: 'MoHUA Swachh Bharat Urban Street Benchmark',
    recurrenceCount: 51,
    contractorWarranty: {
      isUnderWarranty: false,
      contractorName: 'Solid Waste Management Division (BBMP SWM Ward 173)',
      contractorPhone: '+91-80-2266-0000',
      contractId: 'BBMP/SWM/2024/ZONE-S',
      awardDate: '2024-01-01',
      warrantyExpiryDate: '2025-12-31',
      daysRemaining: 110,
      defectLiabilityClause: 'Daily SWM concessionaire SLA: Immediate 4-hour clearance upon AI trigger',
      guaranteeAmountInr: 10000000
    },
    resourceEstimation: {
      workersNeeded: 4,
      estimatedDays: 0.5,
      laborRatePerDayInr: 750,
      laborCostInr: 1500,
      materialCostInr: 1000,
      equipmentCostInr: 4000,
      totalCostInr: 6500,
      materialsList: ['High-density waste bags', 'Lime disinfectant powder', 'Reflective bollards'],
      equipmentList: ['Bobcat Compact Loader', '10-Tonne Tipper Truck', 'High-pressure wash tanker'],
      suggestedDetour: 'No full road closure needed; work conducted during low-traffic afternoon window (1-3 PM)',
      detourCongestionReduction: 'Lane width restored to 100% capacity'
    }
  },
  {
    id: 'DEF-8026',
    type: 'pothole',
    title: 'School Zone Pothole (Citizen Manual Photo Upload)',
    severity: 'medium',
    confidence: 0.93,
    latitude: 12.9611,
    longitude: 77.5999,
    roadName: 'Richmond Road, Sacred Heart School Zone, Ward 111',
    detectedBy: 'Citizen Report #CIT-1049 (GPS Photo Manual Upload)',
    timestamp: '4 hours ago',
    dimensions: { lengthCm: 50, widthCm: 45, depthCm: 6.5 },
    rootCause: 'poor_drainage',
    estimatedCostInr: 3800,
    repairMethod: 'Pre-mixed cold bituminous patch + rapid curing primer',
    status: 'verified',
    verificationSource: 'citizen_upload',
    potholeDetectionMode: 'manual_upload',
    datasetRef: 'IISc UVH-26 Urban Road Benchmark',
    recurrenceCount: 19,
    contractorWarranty: {
      isUnderWarranty: true,
      contractorName: 'KNR Constructions Urban Div.',
      contractorPhone: '+91-80-2663-8890',
      contractId: 'BBMP/PWD/2023/RICH-44',
      awardDate: '2023-08-15',
      warrantyExpiryDate: '2026-08-14',
      daysRemaining: 155,
      defectLiabilityClause: 'Clause 8.1: 3-year guarantee on all carriageway repairs near educational zones',
      guaranteeAmountInr: 18000000
    },
    resourceEstimation: {
      workersNeeded: 3,
      estimatedDays: 1,
      laborRatePerDayInr: 750,
      laborCostInr: 2250,
      materialCostInr: 2100,
      equipmentCostInr: 1200,
      totalCostInr: 5550,
      materialsList: ['Ready-to-use pothole repair mix', 'Polymer emulsion', 'Tack coat'],
      equipmentList: ['Hand tamper', 'Warning cones', 'Safety lighting'],
      suggestedDetour: 'Divert school buses via Residency Road during active morning hours',
      detourCongestionReduction: 'Safe crossing corridor maintained'
    }
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

export const CITY_HOTSPOTS: HotspotSensitivityZone[] = [
  {
    id: 'HOT-01',
    zoneName: 'Central Silk Board Junction (Hosur Road / ORR)',
    wardNumber: 173,
    recurrenceCount: 68,
    priorityRank: 1, // 1st priority based on recurrence
    primaryIssue: 'Chronic Potholes, Illegal Garbage Encroachment & Double Parking Bottlenecks',
    rootCauseNote: 'Heavy inter-state bus idling, lack of stormwater bypass, high axle loads',
    recommendedIntervention: 'Install High-Mast ALPR Pole, Dedicated Bus Staging Bay & Reinforced Mastic Pavement',
    isUnderWarranty: true,
    contractorName: 'L&T Infra (Metro / Flyover Corridor)',
    contractorPhone: '+91-80-2558-4410',
    estimatedCostInr: 125000,
    reportedIncidentsLast90Days: 142
  },
  {
    id: 'HOT-02',
    zoneName: 'Kadubeesanahalli Junction (Outer Ring Road Tech Corridor)',
    wardNumber: 150,
    recurrenceCount: 54,
    priorityRank: 2,
    primaryIssue: 'Severe Recurrent Potholes & Wrong-Side Two-Wheeler Incursions',
    rootCauseNote: 'Subbase moisture saturation from tech park stormwater overflow',
    recommendedIntervention: 'Under Warranty: Issue DLP Notice to L&T; install directional median barriers',
    isUnderWarranty: true,
    contractorName: 'L&T Transportation Infrastructure Ltd.',
    contractorPhone: '+91-80-2558-4410',
    estimatedCostInr: 85000,
    reportedIncidentsLast90Days: 119
  },
  {
    id: 'HOT-03',
    zoneName: 'Sony World Junction (Koramangala 80ft Road)',
    wardNumber: 151,
    recurrenceCount: 46,
    priorityRank: 3,
    primaryIssue: 'Water Main Leakage, Road Subsidence & Missing Zebra Crossings',
    rootCauseNote: 'Aged BWSSB cast-iron water pipeline burst causing base washing',
    recommendedIntervention: 'Joint Municipal + BWSSB trenchless pipe sleeve & Pelican Pedestrian Crossing',
    isUnderWarranty: false,
    estimatedCostInr: 210000,
    reportedIncidentsLast90Days: 98
  },
  {
    id: 'HOT-04',
    zoneName: 'Marathahalli Bridge Underpass (Old Airport Road)',
    wardNumber: 85,
    recurrenceCount: 41,
    priorityRank: 4,
    primaryIssue: 'Hit & Run Rash Driving, Speeding & Cycle Track Obstruction',
    rootCauseNote: 'Blind descent from flyover with no speed calming or warning poles',
    recommendedIntervention: 'Install Smart Traffic Pole with "Turn Ahead" Warning & Speed Calming Table (IRC:99)',
    isUnderWarranty: false,
    estimatedCostInr: 78000,
    reportedIncidentsLast90Days: 84
  },
  {
    id: 'HOT-05',
    zoneName: 'Richmond Circle (Sacred Heart & Baldwin School Zone)',
    wardNumber: 111,
    recurrenceCount: 33,
    priorityRank: 5,
    primaryIssue: 'High Vulnerable Pedestrian Conflict (School Children) & Faded Zebra Crossing',
    rootCauseNote: 'Unregulated morning student drop-offs & vehicle turning speeds > 45 km/h',
    recommendedIntervention: 'Install School Zone Smart Pole, 20 km/h Speed Table & High-Glow Thermoplastic Zebra Crosswalk',
    isUnderWarranty: true,
    contractorName: 'KNR Constructions Urban Div.',
    contractorPhone: '+91-80-2663-8890',
    estimatedCostInr: 64000,
    reportedIncidentsLast90Days: 61
  }
];

export const INFRASTRUCTURE_RECOMMENDATIONS: CityInfrastructureRecommendation[] = [
  {
    id: 'INFRA-01',
    location: 'Marathahalli Flyover Descent Curve, Ward 85',
    wardName: 'Marathahalli',
    type: 'smart_traffic_pole',
    signboardOrPoleDetail: 'Smart Traffic Pole with Solar LED "Turn Ahead / Sharp Curve Ahead" & Radar Speed Display',
    priority: 'critical',
    estimatedCostInr: 45000,
    justification: 'Over 14 rash driving incidents and 3 hit-and-runs logged in 60 days due to blind curve entry.',
    expectedImpact: '44% reduction in approach speeds; zero blind corner collisions',
    status: 'recommended'
  },
  {
    id: 'INFRA-02',
    location: 'Richmond Circle Sacred Heart School Zone, Ward 111',
    wardName: 'Shanthala Nagar',
    type: 'pedestrian_refuge_zebra',
    signboardOrPoleDetail: 'High-Visibility Thermoplastic Zebra Crossing with Solar LED Pedestrian Flashing Studs',
    priority: 'critical',
    estimatedCostInr: 32000,
    justification: 'Over 2,400 school children cross daily without a marked crosswalk or pedestrian refuge island.',
    expectedImpact: 'Safe crossing window established; vehicle yields increase from 18% to 89%',
    status: 'recommended'
  },
  {
    id: 'INFRA-03',
    location: 'Sony World Junction Koramangala, Ward 151',
    wardName: 'Koramangala',
    type: 'pelican_signal',
    signboardOrPoleDetail: 'Push-Button Pelican Pedestrian Signal Pole with Audio Buzzer for Visually Impaired',
    priority: 'high',
    estimatedCostInr: 85000,
    justification: 'High elderly pedestrian volume visiting St. John\'s Hospital with crossing wait times > 4 minutes.',
    expectedImpact: 'Dedicated 25-second pedestrian green phase synchronized with arterial traffic',
    status: 'approved_by_admin'
  },
  {
    id: 'INFRA-04',
    location: 'Outer Ring Road Bellandur Flyover Ramp, Ward 150',
    wardName: 'Bellandur',
    type: 'median_barrier',
    signboardOrPoleDetail: 'Continuous Anti-Crash Median Barrier with Anti-Glare Blinders (IRC:119)',
    priority: 'high',
    estimatedCostInr: 140000,
    justification: '12 wrong-side driving two-wheeler incursions per day crossing median gap illegally.',
    expectedImpact: '100% elimination of unauthorized median crossovers and head-on collision hazard',
    status: 'recommended'
  },
  {
    id: 'INFRA-05',
    location: 'Silk Board Junction Emergency Exit Corridor, Ward 173',
    wardName: 'Madivala',
    type: 'cctv_alpr_pole',
    signboardOrPoleDetail: 'Dual-Lens 4K ALPR Enforcement Pole with Emergency Vehicle Green Corridor Transponder',
    priority: 'critical',
    estimatedCostInr: 95000,
    justification: 'Ambulances stranded in gridlock averaging 18 minutes delay passing Silk Board bottleneck.',
    expectedImpact: 'Automated Green Corridor preemption clears signals 300m in advance for sirens',
    status: 'approved_by_admin'
  },
  {
    id: 'INFRA-06',
    location: '100ft Road Indiranagar near 12th Main, Ward 80',
    wardName: 'Indiranagar',
    type: 'speed_calming_table',
    signboardOrPoleDetail: 'Flat-Topped Raised Speed Table (IRC:99) with Chevron Surface Markings',
    priority: 'medium',
    estimatedCostInr: 52000,
    justification: 'Night-time rash driving exceeding 85 km/h on pedestrian shopping corridor.',
    expectedImpact: 'Natural speed dampening to 30 km/h without harsh vehicle bottom scraping',
    status: 'tender_floated'
  }
];

export const PENALTY_STATS: PenaltyStat[] = [
  {
    id: 'PEN-01',
    category: 'Wrong-Side Driving (Dangerous Counterflow)',
    offenseCount: 428,
    fineAmountTotalInr: 856000,
    fineAmountCollectedInr: 642000,
    pendingAmountInr: 214000,
    collectionRatePercent: 75.0,
    lawSection: 'Motor Vehicles Act Sec 184 (Dangerous Driving) - ₹2,000 fine'
  },
  {
    id: 'PEN-02',
    category: 'No Helmet (Two-Wheeler Rider / Pillion)',
    offenseCount: 1120,
    fineAmountTotalInr: 1120000,
    fineAmountCollectedInr: 896000,
    pendingAmountInr: 224000,
    collectionRatePercent: 80.0,
    lawSection: 'Motor Vehicles Act Sec 129 / 194D - ₹1,000 fine + 3-month license suspension'
  },
  {
    id: 'PEN-03',
    category: 'Dedicated Bus Priority Lane Encroachment',
    offenseCount: 546,
    fineAmountTotalInr: 1092000,
    fineAmountCollectedInr: 786000,
    pendingAmountInr: 306000,
    collectionRatePercent: 72.0,
    lawSection: 'Motor Vehicles Act Sec 115 / 177 - ₹2,000 fine'
  },
  {
    id: 'PEN-04',
    category: 'Double Parking & Bottleneck Obstruction',
    offenseCount: 684,
    fineAmountTotalInr: 1026000,
    fineAmountCollectedInr: 615600,
    pendingAmountInr: 410400,
    collectionRatePercent: 60.0,
    lawSection: 'Motor Vehicles Act Sec 122 / 177 (Obstruction to Public Flow) - ₹1,500 fine'
  },
  {
    id: 'PEN-05',
    category: 'Hit-and-Run Rash Driving & Fleeing Scene',
    offenseCount: 38,
    fineAmountTotalInr: 380000,
    fineAmountCollectedInr: 190000,
    pendingAmountInr: 190000,
    collectionRatePercent: 50.0,
    lawSection: 'Bharatiya Nyaya Sanhita Sec 106(2) & MVA Sec 134 - ₹10,000 fine + Criminal FIR'
  },
  {
    id: 'PEN-06',
    category: 'Protected Bike Lane Encroachment',
    offenseCount: 312,
    fineAmountTotalInr: 312000,
    fineAmountCollectedInr: 218400,
    pendingAmountInr: 93600,
    collectionRatePercent: 70.0,
    lawSection: 'Urban Street Guidelines / MVA Sec 177 - ₹1,000 fine'
  }
];

export const EMERGENCY_DISPATCH_LOGS: EmergencyDispatchLog[] = [
  {
    id: 'DISP-901',
    incidentType: 'ambulance_green_corridor',
    timestamp: '2 mins ago',
    location: 'Outer Ring Road (Kadubeesanahalli to Sakra World Hospital)',
    vehiclePlate: 'KA-01-G-9901 (ICU Life Support Ambulance)',
    dispatchTarget: 'Traffic Signal Preempt (Green Corridor)',
    status: 'on_scene',
    etaMinutes: 3
  },
  {
    id: 'DISP-902',
    incidentType: 'hit_and_run',
    timestamp: '18 mins ago',
    location: 'Marathahalli Underpass Junction',
    vehiclePlate: 'DL-01-AB-1234',
    dispatchTarget: 'Police 112',
    status: 'dispatched',
    etaMinutes: 6
  },
  {
    id: 'DISP-903',
    incidentType: 'pedestrian_collision',
    timestamp: '42 mins ago',
    location: 'Richmond Circle near Sacred Heart School',
    vehiclePlate: 'KA-05-MQ-9011',
    dispatchTarget: 'Ambulance 108',
    status: 'on_scene',
    etaMinutes: 2
  }
];

