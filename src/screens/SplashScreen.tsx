import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

// ============================================
// SA PROVERBS
// Rotating quotes shown during splash
// ============================================
const PROVERBS = [
  "When the lights go off, the braai must go on.",
  "A man who charges his power bank is a man who plans ahead; a man who doesn't is a man eating cold pap.",
  "Eskom giveth, and Eskom taketh away — usually at 6pm, right before dinner.",
  "He who candles in the bathroom shall never run out of romance.",
  "The early bird checks the schedule; the late bird showers in the dark.",
  "Loadshedding waits for no man, no Wi-Fi call, and definitely no oven timer.",
  "A generator is worth a thousand neighbours.",
  "Even the robots (traffic lights) must rest sometimes.",
  "Stage 6 today, stage 1 tomorrow — such is the wheel of life.",
  "Trust not the inverter that has not been tested before 5pm.",
  "When darkness falls, the family gathers — mostly to ask who left the fridge open.",
  "A phone at 100% is a phone that fears nothing.",
  "He who laughs last during loadshedding probably has solar.",
  "The candle does not choose when it is needed, only that it is needed.",
  "Patience is a virtue; so is keeping your laptop plugged in at all times.",
  "Where there is smoke, there is a braai; where there is darkness, there is also probably a braai.",
  "A man's wealth is measured not in gold, but in UPS battery life.",
];

// ============================================
// PROPS
// onFinish tells App.tsx to move to next screen
// ============================================
interface Props {
  onFinish: () => void;
}

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: Props) {
  // Pick a random proverb when the screen loads
  const [proverb] = useState(() => {
    const randomIndex = Math.floor(Math.random() * PROVERBS.length);
    return PROVERBS[randomIndex];
  });

  // After 4.5 seconds, move to the next screen
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 4500);

    // Cleanup — cancels the timer if the component
    // disappears before 4.5 seconds is up
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>"{proverb}"</Text>
        <Text style={styles.attribution}>-South African Proverb</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#272626',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  quoteContainer: {
    alignItems: 'center',
  },
quote: {
  color: '#F9D2A7',
  fontSize: 12,
  fontFamily: 'Lexend-Light',  // 👈 add this
  textAlign: 'center',
  lineHeight: 20,
  marginBottom: 12,
},
attribution: {
  color: '#F9D2A7',
  fontSize: 10,
  fontFamily: 'Lexend-Light',  // 👈 add this
  textAlign: 'center',
  opacity: 0.7,
},
});