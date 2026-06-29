import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LocationEntryScreen from './src/screens/LocationEntryScreen';
import HomeScreen from './src/screens/HomeScreen';
import AreaScheduleScreen from './src/screens/AreaScheduleScreen';
import InsightsScreen from './src/screens/InsightsScreen';

// ============================================
// SCREEN NAMES
// Every screen in the app lives here
// ============================================
type ScreenName =
  | 'Splash'
  | 'LocationEntry'
  | 'Home'
  | 'AreaSchedule'
  | 'Insights';

type TabName = 'Home' | 'Insights' | 'Boredom' | 'Convenience' | 'News';

// ============================================
// CUSTOM TAB BAR
// ============================================
function CustomTabBar({
  activeTab,
  onTabPress,
}: {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}) {
  const tabs: { name: TabName; label: string }[] = [
    { name: 'Home', label: 'Home' },
    { name: 'Insights', label: 'Insights' },
    { name: 'Boredom', label: 'Boredom' },
    { name: 'Convenience', label: 'Convenience' },
    { name: 'News', label: 'News' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tabItem}
          onPress={() => onTabPress(tab.name)}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.name && styles.tabLabelActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ============================================
// APP — controls which screen is showing
// ============================================
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Splash');
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');

  // Navigate to any screen
  const navigate = (screen: ScreenName, params?: { locationId?: string }) => {
    if (params?.locationId) setSelectedLocationId(params.locationId);
    setCurrentScreen(screen);
  };

  // Show tab bar only on main screens
  const showTabBar = ['Home', 'Insights', 'Boredom', 'Convenience', 'News']
    .includes(currentScreen) || activeTab !== 'Home';

  const renderScreen = () => {
    // If we're in the main tab area
    if (
      currentScreen === 'Home' ||
      currentScreen === 'Insights' ||
      activeTab !== 'Home'
    ) {
      switch (activeTab) {
        case 'Insights':
          return <InsightsScreen />;
        default:
          return <HomeScreen />;
      }
    }

    // Full screen flows
    switch (currentScreen) {
      case 'Splash':
        return <SplashScreen onFinish={() => navigate('LocationEntry')} />;
      case 'LocationEntry':
        return <LocationEntryScreen onLocationSaved={() => navigate('Home')} />;
      case 'AreaSchedule':
        return <AreaScheduleScreen locationId={selectedLocationId} onBack={() => navigate('Home')} />;
      default:
        return <HomeScreen />;
    }
  };

  const isInTabArea = currentScreen === 'Home' || currentScreen === 'Insights';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      {isInTabArea && (
        <CustomTabBar
          activeTab={activeTab}
          onTabPress={(tab) => {
            setActiveTab(tab);
            setCurrentScreen('Home');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1A1C',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0F1A1C',
    borderTopWidth: 1,
    borderTopColor: '#1E2D2F',
    paddingBottom: 30,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    color: '#4A6670',
  },
  tabLabelActive: {
    color: '#F2762E',
  },
});