
// Enum for various tool categories in the VTK application
export enum ToolCategory {
  DASHBOARD = 'DASHBOARD',
  BATTERY = 'BATTERY',
  SENSORS = 'SENSORS',
  HARDWARE = 'HARDWARE',
  DIAGNOSTIC = 'DIAGNOSTIC',
  // Fix: Added missing categories used in Sidebar and App components
  THERMAL = 'THERMAL',
  NETWORK = 'NETWORK'
}

// Interface for Android source files in the explorer
export interface AndroidFile {
  name: string;
  language: 'kotlin' | 'xml' | 'gradle';
  path: string;
  content: string;
}

// Fix: Added missing BatteryInfo interface used in BatteryTool view
export interface BatteryInfo {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}
