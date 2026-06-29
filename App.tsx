import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LocationEntryScreen from './src/screens/LocationEntryScreen';
import HomeScreen from './src/screens/HomeScreen';
import AreaScheduleScreen from './src/screens/AreaScheduleScreen';
import InsightsScreen from './src/screens/InsightsScreen';

// ============================================
// SCREEN & TAB TYPES
// ============================================
type ScreenName =
  | 'Splash'
  | 'LocationEntry'
  | 'Home'
  | 'AreaSchedule'
  | 'Insights';

type TabName = 'Home' | 'Insights' | 'Boredom' | 'Convenience' | 'News';

// ============================================
// FONTS
// Loaded once here, available everywhere
// ============================================
const loadFonts = () =>
  Font.loadAsync({
    'Lexend-Thin': require('./assets/fonts/Lexend-Thin.ttf'),
    'Lexend-ExtraLight': require('./assets/fonts/Lexend-ExtraLight.ttf'),
    'Lexend-Light': require('./assets/fonts/Lexend-Light.ttf'),
    'Lexend-Regular': require('./assets/fonts/Lexend-Regular.ttf'),
    'Lexend-Medium': require('./assets/fonts/Lexend-Medium.ttf'),
    'Lexend-SemiBold': require('./assets/fonts/Lexend-SemiBold.ttf'),
    'Lexend-Bold': require('./assets/fonts/Lexend-Bold.ttf'),
    'Lexend-ExtraBold': require('./assets/fonts/Lexend-ExtraBold.ttf'),
    'Lexend-Black': require('./assets/fonts/Lexend-Black.ttf'),
  });

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
// APP
// ============================================
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Splash');
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');

// Load fonts and check if user has launched before
useEffect(() => {
    const initApp = async () => {
      try {
        await loadFonts();
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === 'true') {
          // Location already saved — splash will show,
          // then navigate to Home (skipping LocationEntry)
          setCurrentScreen('Splash');
        }
      } catch (e) {
        console.log('Init error:', e);
      } finally {
        setFontsLoaded(true);
      }
    };
    initApp();
  }, []);

  // Show nothing while fonts are loading
  // This prevents a flash of unstyled text
  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  const navigate = (screen: ScreenName, params?: { locationId?: string }) => {
    if (params?.locationId) setSelectedLocationId(params.locationId);
    setCurrentScreen(screen);
  };

  const isInTabArea = currentScreen === 'Home' || currentScreen === 'Insights';

  const renderScreen = () => {
    if (isInTabArea) {
      switch (activeTab) {
        case 'Insights': return <InsightsScreen />;
        default: return <HomeScreen />;
      }
    }

switch (currentScreen) {
      case 'Splash':
        return (
          <SplashScreen
            onFinish={async () => {
              const hasLaunched = await AsyncStorage.getItem('hasLaunched');
              if (hasLaunched === 'true') {
                navigate('Home');
              } else {
                navigate('LocationEntry');
              }
            }}
          />
        );
      case 'LocationEntry':
        return <LocationEntryScreen onLocationSaved={() => navigate('Home')} />;
      case 'AreaSchedule':
        return (
          <AreaScheduleScreen
            locationId={selectedLocationId}
            onBack={() => navigate('Home')}
          />
        );
      default:
        return <HomeScreen />;
    }
  };

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