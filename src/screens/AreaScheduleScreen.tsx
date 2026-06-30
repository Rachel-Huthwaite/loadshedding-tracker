import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { mockLocations } from '../data/mockData';
import { DaySchedule, LoadsheddingSlot } from '../types';

// ============================================
// PROPS
// ============================================
interface Props {
  locationId: string;
  onBack: () => void;
}

// ============================================
// HELPER — duration calculation
// ============================================
const getDuration = (startTime: string, endTime: string): string => {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
  if (diffMins < 0) diffMins += 24 * 60;

  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;

  if (hours === 0) return `${mins}Min`;
  if (mins === 0) return `${hours}H`;
  return `${hours}H${mins}Min`;
};

// ============================================
// SLOT CARD
// Each individual loadshedding time block
// ============================================
interface SlotCardProps {
  slot: LoadsheddingSlot;
}

function SlotCard({ slot }: SlotCardProps) {
  const duration = getDuration(slot.startTime, slot.endTime);

  return (
    <View style={[
      styles.slotCard,
      slot.isActive ? styles.slotCardActive : styles.slotCardUpcoming,
    ]}>
      {/* LEFT — plug icon placeholder + times */}
      <View style={styles.slotLeft}>
        <Text style={[
          styles.plugIcon,
          slot.isActive ? styles.plugIconActive : styles.plugIconUpcoming,
        ]}>
          🔌
        </Text>
        <View>
          <Text style={[
            styles.slotTime,
            slot.isActive && styles.slotTimeActive,
          ]}>
            {slot.startTime}
          </Text>
          <Text style={[
            styles.slotTime,
            slot.isActive && styles.slotTimeActive,
          ]}>
            {slot.endTime}
          </Text>
        </View>
      </View>

      {/* RIGHT — duration */}
      <View style={[
        styles.slotRight,
        slot.isActive ? styles.slotRightActive : styles.slotRightUpcoming,
      ]}>
        <Text style={styles.durationLabel}>Duration:</Text>
        <Text style={styles.durationValue}>{duration}</Text>
      </View>
    </View>
  );
}

// ============================================
// DAY SECTION
// Header + all slots for one day
// ============================================
interface DaySectionProps {
  day: DaySchedule;
}

function DaySection({ day }: DaySectionProps) {
  return (
    <View style={styles.daySection}>
      {/* DAY HEADER BAR */}
      <View style={styles.dayHeader}>
        <Text style={styles.dayHeaderText}>{day.dayName}</Text>
      </View>

      {/* SLOTS FOR THIS DAY */}
      {day.slots.length > 0 ? (
        day.slots.map((slot, index) => (
          <SlotCard key={index} slot={slot} />
        ))
      ) : (
        <View style={styles.noLoadsheddingCard}>
          <Text style={styles.noLoadsheddingText}>
            No loadshedding 🎉
          </Text>
        </View>
      )}
    </View>
  );
}

// ============================================
// AREA SCHEDULE SCREEN
// ============================================
export default function AreaScheduleScreen({ locationId, onBack }: Props) {
  // Find the location from mock data using the id
  const location = mockLocations.find(loc => loc.id === locationId);

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Location not found</Text>
      </View>
    );
  }

  const isCurrentlyActive = location.schedule[0]?.slots.some(
    slot => slot.isActive
  );

  return (
    <View style={styles.container}>

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.stageContainer}>
          <Text style={styles.stageIcon}>⚠️</Text>
          <Text style={styles.stageText}>STAGE {location.stage}</Text>
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

      {/* LOCATION HEADER */}
      <View style={styles.locationHeader}>
        <Text style={[
          styles.plugLarge,
          isCurrentlyActive ? styles.plugLargeActive : styles.plugLargeUpcoming,
        ]}>
          🔌
        </Text>
        <Text style={styles.locationTitle}>
          {location.name} ({location.areaCode})
        </Text>
      </View>

      {/* SCROLLABLE SCHEDULE */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {location.schedule.map((day, index) => (
          <DaySection key={index} day={day} />
        ))}
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
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#F9D2A7',
    fontSize: 24,
    fontFamily: 'Lexend-Light',
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
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  plugLarge: {
    fontSize: 28,
  },
  plugLargeUpcoming: {
    opacity: 1,
  },
  plugLargeActive: {
    opacity: 0.7,
  },
  locationTitle: {
    color: '#F9D2A7',
    fontSize: 20,
    fontFamily: 'Lexend-Bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 8,
  },
  daySection: {
    gap: 6,
  },
  dayHeader: {
    backgroundColor: '#F2762E',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dayHeaderText: {
    color: '#0F1A1C',
    fontSize: 16,
    fontFamily: 'Lexend-Bold',
  },
  slotCard: {
    borderRadius: 8,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 80,
  },
  slotCardUpcoming: {
    backgroundColor: '#1E2D2F',
  },
  slotCardActive: {
    backgroundColor: '#FFE8E8',
  },
  slotLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  plugIcon: {
    fontSize: 24,
  },
  plugIconUpcoming: {
    opacity: 1,
  },
  plugIconActive: {
    opacity: 0.6,
  },
  slotTime: {
    color: '#F9D2A7',
    fontSize: 24,
    fontFamily: 'Lexend-Medium',
  },
  slotTimeActive: {
    color: '#3D1A1A',
  },
  slotRight: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  slotRightUpcoming: {
    backgroundColor: '#F2762E',
  },
  slotRightActive: {
    backgroundColor: '#D62828',
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
  noLoadsheddingCard: {
    backgroundColor: '#1E2D2F',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  noLoadsheddingText: {
    color: '#F9D2A7',
    fontSize: 14,
    fontFamily: 'Lexend-Regular',
  },
  errorText: {
    color: '#F9D2A7',
    fontSize: 16,
    fontFamily: 'Lexend-Regular',
    textAlign: 'center',
    marginTop: 100,
  },
});