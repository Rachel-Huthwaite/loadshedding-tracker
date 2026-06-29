import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

// ============================================
// PROPS
// ============================================
interface Props {
  onLocationSaved: () => void;
}

export default function LocationEntryScreen({ onLocationSaved }: Props) {
  const [locationText, setLocationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ============================================
  // SAVE MANUAL LOCATION
  // User typed in a suburb name
  // ============================================
  const handleManualLocation = async () => {
    if (!locationText.trim()) {
      setError('Eish, you need to enter something bru.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Save the location to AsyncStorage
      // This is how we remember it between app opens
      await AsyncStorage.setItem('savedLocation', locationText.trim());
      await AsyncStorage.setItem('hasLaunched', 'true');
      onLocationSaved();
    } catch (e) {
      setError('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // USE CURRENT LOCATION
  // Ask phone for GPS coordinates
  // ============================================
  const handleCurrentLocation = async () => {
    setIsLoading(true);
    setError('');

    try {
      // First ask the user for permission to use GPS
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('No permission to access location. Enter it manually bru.');
        setIsLoading(false);
        return;
      }

      // Get the actual coordinates
      const location = await Location.getCurrentPositionAsync({});

      // Convert coordinates to a suburb name
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Build a readable location string from the address
      const locationName =
        address.district ||
        address.subregion ||
        address.city ||
        'Current Location';

      // Save it
      await AsyncStorage.setItem('savedLocation', locationName);
      await AsyncStorage.setItem('hasLaunched', 'true');
      onLocationSaved();
    } catch (e) {
      setError('Could not get your location. Enter it manually.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView pushes content up when
    // the keyboard appears so nothing gets hidden
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>

        {/* TOP HEADING */}
        <Text style={styles.heading}>New laaitie{'\n'}in the dark?</Text>

        {/* SUBHEADING */}
        <Text style={styles.subheading}>Where you from, stranger?</Text>
        <Text style={styles.subtext}>(We won't tell Eskom)</Text>

        {/* TEXT INPUT */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Please enter your location"
            placeholderTextColor="rgba(255, 255, 255, 0.13)"
            value={locationText}
            onChangeText={setLocationText}
            onSubmitEditing={handleManualLocation}
            returnKeyType="go"
          />
        </View>

        {/* ERROR MESSAGE */}
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {/* LOADING OR CONFIRM BUTTON */}
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color="#F9D2A7"
            style={styles.loader}
          />
        ) : (
          locationText.length > 0 && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleManualLocation}
            >
              <Text style={styles.confirmButtonText}>Let's go</Text>
            </TouchableOpacity>
          )
        )}

        {/* USE CURRENT LOCATION */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handleCurrentLocation}
          disabled={isLoading}
        >
          <Text style={styles.currentLocationText}>USE CURRENT LOCATION</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#272626',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 120,
  },
  heading: {
    color: '#F9D2A7',
    fontSize: 48,
    fontFamily: 'Lexend-Bold',
    lineHeight: 56,
    marginBottom: 32,
  },
  subheading: {
    color: '#F9D2A7',
    fontSize: 22,
    fontFamily: 'Lexend-Bold',
    marginBottom: 6,
  },
  subtext: {
    color: '#F9D2A7',
    fontSize: 14,
    fontFamily: 'Lexend-Thin',
    marginBottom: 40,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 16,
  },
  input: {
    color: 'rgba(255, 255, 255, 0.13)',
    fontSize: 15,
    fontFamily: 'Lexend-ExtraLight',
  },
  errorText: {
    color: '#D62828',
    fontSize: 12,
    fontFamily: 'Lexend-Light',
    marginBottom: 16,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 16,
  },
  confirmButton: {
    backgroundColor: '#F2762E',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmButtonText: {
    color: '#0F1A1C',
    fontSize: 16,
    fontFamily: 'Lexend-Bold',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 60,
    left: 32,
    right: 32,
    alignItems: 'center',
  },
  currentLocationText: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontSize: 16,
    fontFamily: 'Lexend-Light',
    textDecorationLine: 'underline',
  },
});