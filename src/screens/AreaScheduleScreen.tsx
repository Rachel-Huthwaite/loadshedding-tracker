import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  locationId: string;
  onBack: () => void;
}

export default function AreaScheduleScreen({ locationId, onBack }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Area Schedule: {locationId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#272626', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#F9D2A7', fontSize: 18 },
});