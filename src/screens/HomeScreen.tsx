import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { mockLocations, mockCurrentStage } from '../data/mockData';
import { SavedLocation } from '../types';

// ============================================
// HELPER FUNCTIONS
// ============================================

// Works out how many hours and minutes until
// the next loadshedding slot starts
const getCountdown = (startTime: string): string => {
  const now = new Date();
  const [hours, minutes] = startTime.split(':').map(Number);
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return '0H';

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours === 0) return `${diffMins}Min`;
  if (diffMins === 0) return `${diffHours}H`;
  return `${diffHours}H ${diffMins}Min`;
};

// Works out how long a loadshedding slot lasts
const getDuration = (startTime: string, endTime: string): string => {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
  if (diffMins < 0) diffMins += 24 * 60; // handles overnight slots

  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;

  if (hours === 0) return `${mins}Min`;
  if (mins === 0) return `${hours}H`;
  return `${hours}H${mins}Min`;
};

// Finds the next upcoming or active slot for today
const getNextSlot = (location: SavedLocation) => {
  const today = location.schedule[0];
  if (!today || today.slots.length === 0) return null;

  // First check for active slot
  const activeSlot = today.slots.find(slot => slot.isActive);
  if (activeSlot) return activeSlot;

  // Otherwise return first upcoming slot
  return today.slots[0];
};

// ============================================
// LOCATION CARD COMPONENT
// The big cards showing each saved area
// ============================================
interface LocationCardProps {
  location: SavedLocation;
  onPress: () => void;
}

function LocationCard({ location, onPress }: LocationCardProps) {
  const nextSlot = getNextSlot(location);
  const isActive = nextSlot?.isActive ?? false;

  return (
    <TouchableOpacity
      style={[styles.card, isActive ? styles.cardActive : styles.cardUpcoming]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* LEFT SIDE — location info */}
      <View style={styles.cardLeft}>
        <Text style={styles.locationName}>
          {location.name} ({location.areaCode})
        </Text>

        {nextSlot ? (
          <>
            <Text style={styles.nextLabel}>
              {isActive ? 'Currently loadshedding' : 'Next Loadshedding Time:'}
            </Text>
            <Text style={styles.timeDisplay}>
              {nextSlot.startTime} - {nextSlot.endTime}
            </Text>
          </>
        ) : (
          <Text style={styles.nextLabel}>No loadshedding today 🎉</Text>
        )}
      </View>

      {/* RIGHT SIDE — countdown and duration */}
      {nextSlot && (
        <View style={[
          styles.cardRight,
          isActive ? styles.cardRightActive : styles.cardRightUpcoming
        ]}>
          {!isActive && (
            <>
              <Text style={styles.countdownLabel}>Count Down</Text>
              <Text style={styles.countdownValue}>
                {getCountdown(nextSlot.startTime)}
              </Text>
            </>
          )}
          <Text style={styles.durationLabel}>Duration</Text>
          <Text style={styles.durationValue}>
            {getDuration(nextSlot.startTime, nextSlot.endTime)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ============================================
// HOME SCREEN
// ============================================
interface Props {
  onNavigateToSchedule?: (locationId: string) => void;
}

export default function HomeScreen({ onNavigateToSchedule }: Props) {
  return (
    <View style={styles.container}>

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.stageContainer}>
          <Text style={styles.stageIcon}>⚠️</Text>
          <Text style={styles.stageText}>STAGE {mockCurrentStage}</Text>
        </View>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>👤</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlaceholder}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TITLE */}
      <Text style={styles.title}>The Blackout Bulletin</Text>

      {/* LOCATION CARDS */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mockLocations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            onPress={() => onNavigateToSchedule?.(location.id)}
          />
        ))}

        {/* ADD LOCATION BUTTON */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#272626',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageIcon: {
    fontSize: 20,
  },
  stageText: {
    color: '#F2762E',
    fontSize: 16,
    fontFamily: 'Lexend-Bold',
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  iconPlaceholder: {
    fontSize: 20,
  },
  title: {
    color: '#F9D2A7',
    fontSize: 20,
    fontFamily: 'Lexend-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  card: {
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 100,
  },
  cardUpcoming: {
    backgroundColor: '#1E2D2F',
  },
  cardActive: {
    backgroundColor: '#3D1A1A',
  },
  cardLeft: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  locationName: {
    color: '#F9D2A7',
    fontSize: 20,
    fontFamily: 'Lexend-Bold',
    marginBottom: 6,
  },
  nextLabel: {
    color: '#F9D2A7',
    fontSize: 8,
    fontFamily: 'Lexend-ExtraLight',
    marginBottom: 2,
  },
  timeDisplay: {
    color: '#F9D2A7',
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
  },
  cardRight: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    gap: 4,
  },
  cardRightUpcoming: {
    backgroundColor: '#F2762E',
  },
  cardRightActive: {
    backgroundColor: '#D62828',
  },
  countdownLabel: {
    color: '#0F1A1C',
    fontSize: 8,
    fontFamily: 'Lexend-Light',
  },
  countdownValue: {
    color: '#F9D2A7',
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    marginBottom: 8,
  },
  durationLabel: {
    color: '#0F1A1C',
    fontSize: 8,
    fontFamily: 'Lexend-Light',
  },
  durationValue: {
    color: '#F9D2A7',
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 16,
  },
  addButtonText: {
    color: '#F9D2A7',
    fontSize: 32,
    fontFamily: 'Lexend-Light',
  },
});
