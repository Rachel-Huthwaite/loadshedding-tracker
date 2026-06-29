import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Splash Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#272626', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#F9D2A7', fontSize: 18 },
});