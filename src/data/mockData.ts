import { SavedLocation } from '../types';

// ============================================
// MOCK DATA
// This mimics exactly what the ESP API returns
// When we wire up the real API later, the rest
// of the app won't need to change at all —
// just this file gets swapped out
//
// To simulate ACTIVE loadshedding, we set a
// slot's isActive to true. This lets us test
// both the orange (upcoming) and red (active)
// card states from your design
// ============================================

// Helper to get a date string for a specific
// number of days from today
// e.g. getDayDate(0) = today, getDayDate(1) = tomorrow
const getDayDate = (daysFromToday: number): string => {
const date = new Date();
date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split('T')[0]; // "2024-01-15"
};

// Helper to get the day name from a date offset
// e.g. getDayName(0) = "Monday"
const getDayName = (daysFromToday: number): string => {
const date = new Date();
date.setDate(date.getDate() + daysFromToday);
return date.toLocaleDateString('en-ZA', { weekday: 'long' });
};

// ============================================
// WOODSTOCK - currently IN active loadshedding
// This will show the RED active card state
// ============================================
export const mockWoodstock: SavedLocation = {
id: 'woodstock-11',
name: 'Woodstock',
areaCode: 11,
stage: 2,
schedule: [
    {
    date: getDayDate(0),
    dayName: getDayName(0),
    slots: [
        {
        startTime: '14:30',
        endTime: '16:00',
        date: getDayDate(0),
          isActive: true, // 👈 simulating active loadshedding right now
        },
        {
        startTime: '22:00',
        endTime: '00:30',
        date: getDayDate(0),
        isActive: false,
        },
    ],
    },
    {
    date: getDayDate(1),
    dayName: getDayName(1),
    slots: [
        {
        startTime: '06:00',
        endTime: '08:30',
        date: getDayDate(1),
        isActive: false,
        },
        {
        startTime: '18:00',
        endTime: '20:30',
        date: getDayDate(1),
        isActive: false,
        },
    ],
    },
    {
    date: getDayDate(2),
    dayName: getDayName(2),
    slots: [
        {
        startTime: '10:00',
        endTime: '12:30',
        date: getDayDate(2),
        isActive: false,
        },
    ],
    },
    {
    date: getDayDate(3),
    dayName: getDayName(3),
    slots: [
        {
        startTime: '14:30',
        endTime: '16:00',
        date: getDayDate(3),
        isActive: false,
        },
    ],
    },
    {
    date: getDayDate(4),
    dayName: getDayName(4),
    slots: [
        {
        startTime: '08:00',
        endTime: '10:30',
        date: getDayDate(4),
        isActive: false,
        },
    ],
    },
    {
    date: getDayDate(5),
    dayName: getDayName(5),
      slots: [],  // no loadshedding this day
    },
    {
    date: getDayDate(6),
    dayName: getDayName(6),
    slots: [
        {
        startTime: '16:00',
        endTime: '18:30',
        date: getDayDate(6),
        isActive: false,
        },
    ],
    },
],
};

// ============================================
// MILNERTON - upcoming loadshedding, not active
// This will show the ORANGE upcoming card state
// ============================================
export const mockMilnerton: SavedLocation = {
id: 'milnerton-7',
name: 'Milnerton',
areaCode: 7,
stage: 2,
schedule: [
    {
    date: getDayDate(0),
    dayName: getDayName(0),
    slots: [
        {
        startTime: '16:00',
        endTime: '18:30',
        date: getDayDate(0),
          isActive: false, // 👈 upcoming, not active
        },
    ],
    },
    {
    date: getDayDate(1),
    dayName: getDayName(1),
    slots: [
        {
        startTime: '12:00',
        endTime: '14:30',
        date: getDayDate(1),
        isActive: false,
        },
        {
        startTime: '20:00',
        endTime: '22:30',
        date: getDayDate(1),
        isActive: false,
        },
    ],
    },
    {
    date: getDayDate(2),
    dayName: getDayName(2),
    slots: [
        {
        startTime: '08:00',
        endTime: '10:00',
        date: getDayDate(2),
        isActive: false,
        },
    ],
    },
    {
    date: getDayDate(3),
    dayName: getDayName(3),
      slots: [],  // no loadshedding this day
    },
    {
    date: getDayDate(4),
    dayName: getDayName(4),
    slots: [
        {
        startTime: '16:00',
        endTime: '18:30',
        date: getDayDate(4),
        isActive: false,
        },
    ],
    },
    {
    date: getDayDate(5),
    dayName: getDayName(5),
    slots: [
        {
        startTime: '10:00',
        endTime: '12:30',
        date: getDayDate(5),
        isActive: false,
        },
    ],
    },
    {
    date: getDayDate(6),
    dayName: getDayName(6),
    slots: [
        {
        startTime: '20:00',
        endTime: '22:30',
        date: getDayDate(6),
        isActive: false,
        },
    ],
    },
],
};

// ============================================
// ALL MOCK LOCATIONS
// This is what the app loads on startup
// ============================================
export const mockLocations: SavedLocation[] = [
mockMilnerton,
mockWoodstock,
];

// ============================================
// CURRENT STAGE
// In real app this comes from the ESP API
// ============================================
export const mockCurrentStage: number = 2;