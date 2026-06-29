// ============================================
// LOADSHEDDING SLOT
// A single block of loadshedding time
// e.g. 14:30 - 16:00 on a specific day
// ============================================
export interface LoadsheddingSlot {
  startTime: string;    // "14:30"
  endTime: string;      // "16:00"
  date: string;         // "2024-01-15"
  isActive: boolean;    // is loadshedding happening RIGHT NOW in this slot?
}

// ============================================
// DAY SCHEDULE
// All the loadshedding slots for one day
// ============================================
export interface DaySchedule {
  date: string;         // "2024-01-15"
  dayName: string;      // "Monday"
    slots: LoadsheddingSlot[];
}

// ============================================
// SAVED LOCATION
// A suburb the user has saved to track
// ============================================
export interface SavedLocation {
  id: string;           // unique id e.g. "woodstock-11"
  name: string;         // "Woodstock"
  areaCode: number;     // 11
  stage: number;        // current loadshedding stage e.g. 2
  schedule: DaySchedule[];  // the 7-day schedule for this area
}

// ============================================
// APP STATE
// The overall state the app keeps track of
// ============================================
export interface AppState {
savedLocations: SavedLocation[];
currentStage: number;
isFirstLaunch: boolean;
}