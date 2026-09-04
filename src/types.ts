/**
 * MargDrishti AI - Smart India Hackathon Prototype
 * Types aligned with the 14-Module Feature Specification Document
 */

export type DefectType = 
  | 'pothole'
  | 'damaged_road'
  | 'water_leakage'
  | 'waste_garbage'
  | 'alligator_crack'
  | 'transverse_crack'
  | 'missing_divider'
  | 'missing_zebra_crossing'
  | 'damaged_signboard'
  | 'waterlogging'
  | 'manhole_defect';

export type SeverityLevel = 'low' | 'medium' | 'high';

export interface ContractorWarrantyInfo {
  isUnderWarranty: boolean;
  contractorName: string;
  contractorPhone: string;
  contractId: string;
  awardDate: string;
  warrantyExpiryDate: string;
  daysRemaining: number;
  defectLiabilityClause: string;
  guaranteeAmountInr: number;
}

export interface ResourceEstimation {
  workersNeeded: number;
  estimatedDays: number;
  laborRatePerDayInr: number;
  laborCostInr: number;
  materialCostInr: number;
  equipmentCostInr: number;
  totalCostInr: number;
  materialsList: string[];
  equipmentList: string[];
  suggestedDetour: string;
  detourCongestionReduction: string;
}

export interface RoadDefect {
  id: string;
  type: DefectType;
  title: string;
  severity: SeverityLevel;
  confidence: number;
  latitude: number;
  longitude: number;
  roadName: string;
  detectedBy: string; // e.g., "Bus KA-01-F-4092 (Front Cam)" or "Citizen Report #104"
  timestamp: string;
  dimensions: {
    lengthCm: number;
    widthCm: number;
    depthCm: number;
  };
  rootCause: 'water_seepage' | 'heavy_axle_overload' | 'subbase_failure' | 'poor_drainage' | 'construction_defect' | 'illegal_dumping' | 'pipe_burst';
  estimatedCostInr: number; // CPWD Schedule of Rates
  repairMethod: string;
  status: 'detected' | 'verified' | 'work_order_issued' | 'repaired';
  verificationSource: 'edge_ai' | 'citizen_upload' | 'gyro_fusion';
  potholeDetectionMode?: 'manual_upload' | 'dashcam_feed' | 'gyroscope_sensor';
  datasetRef: string; // e.g. RDD2022, CRACK500
  recurrenceCount: number; // Occurrences at this junction/stretch
  contractorWarranty: ContractorWarrantyInfo;
  resourceEstimation: ResourceEstimation;
}

export type ViolationType =
  | 'road_defect'
  | 'bus_lane'
  | 'bus_stop'
  | 'bike_lane'
  | 'double_parking'
  | 'pedestrian_hazard'
  | 'hit_and_run'
  | 'sensor_fusion';

export interface SimulationScene {
  id: ViolationType;
  label: string;
  badge: string;
  title: string;
  description: string;
  lawSection: string;
  fineInr: number;
  impactMetric: string;
  boundingLabel: string;
  color: string;
  actionText: string;
}

export interface GyroSensorReading {
  timestamp: number;
  accelX: number;
  accelY: number;
  accelZ: number;
  anomalyScore: number;
  isBump: boolean;
}

export interface FleetBus {
  id: string;
  routeNumber: string;
  plateNumber: string;
  driverName: string;
  currentSpeedKmH: number;
  latitude: number;
  longitude: number;
  edgeDevice: string; // "NVIDIA Jetson AGX Xavier"
  edgeFps: number;
  temperatureC: number;
  status: 'active' | 'idle' | 'depot';
  defectsDetectedToday: number;
  laneViolationsLogged: number;
}

export interface IndianVehicleCount {
  category: string;
  count: number;
  sharePercent: number;
  color: string;
}

export interface HitAndRunIncident {
  id: string;
  plateNumber: string;
  plateConfidence: number;
  vehicleModel: string;
  vehicleColor: string;
  timestamp: string;
  location: string;
  speedAtImpactKmH: number;
  trackingCameras: string[];
  evidenceHash: string; // SHA-256 blockchain proof
  reIdMatchScore: number;
  status: 'flagged' | 'intercept_alert_sent' | 'investigating';
}

export interface CitizenReport {
  id: string;
  reporterName: string;
  credibilityScore: number; // 0 to 100
  defectType: DefectType;
  location: string;
  latitude: number;
  longitude: number;
  photoUrl: string;
  timestamp: string;
  status: 'pending_ai_verify' | 'verified_by_fleet' | 'resolved';
  karmaPointsAwarded: number;
}

export interface SensorFusionNode {
  sensorType: 'bus_camera' | 'gyro_accelerometer' | 'fleet_dashcam' | 'traffic_cctv';
  nodeName: string;
  weight: number;
  latencyMs: number;
  status: 'nominal' | 'degraded' | 'offline';
  confidenceContribution: number;
}

export interface CityInfrastructureRecommendation {
  id: string;
  location: string;
  wardName: string;
  type: 'smart_traffic_pole' | 'pedestrian_refuge_zebra' | 'pelican_signal' | 'speed_calming_table' | 'median_barrier' | 'cctv_alpr_pole';
  signboardOrPoleDetail: string;
  priority: 'critical' | 'high' | 'medium';
  estimatedCostInr: number;
  justification: string;
  expectedImpact: string;
  status: 'recommended' | 'approved_by_admin' | 'tender_floated';
}

export interface HotspotSensitivityZone {
  id: string;
  zoneName: string;
  wardNumber: number;
  recurrenceCount: number;
  priorityRank: number; // 1 = highest sensitivity
  primaryIssue: string;
  rootCauseNote: string;
  recommendedIntervention: string;
  isUnderWarranty: boolean;
  contractorName?: string;
  contractorPhone?: string;
  estimatedCostInr: number;
  reportedIncidentsLast90Days: number;
}

export interface PenaltyStat {
  id: string;
  category: string;
  offenseCount: number;
  fineAmountTotalInr: number;
  fineAmountCollectedInr: number;
  pendingAmountInr: number;
  collectionRatePercent: number;
  lawSection: string;
}

export interface EmergencyDispatchLog {
  id: string;
  incidentType: 'hit_and_run' | 'ambulance_green_corridor' | 'pedestrian_collision' | 'rash_driving';
  timestamp: string;
  location: string;
  vehiclePlate?: string;
  dispatchTarget: 'Ambulance 108' | 'Police 112' | 'Traffic Signal Preempt (Green Corridor)';
  status: 'dispatched' | 'acknowledged' | 'on_scene';
  etaMinutes: number;
}
