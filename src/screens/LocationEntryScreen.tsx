import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  onLocationSaved: () => void;
}

export default function LocationEntryScreen({ onLocationSaved }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Location Entry Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#272626', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#F9D2A7', fontSize: 18 },
});