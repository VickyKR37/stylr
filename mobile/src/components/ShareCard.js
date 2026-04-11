// ShareCard.js
// Place this file in: /components/ShareCard.js
//
// Before using, install dependencies:
//   npx expo install react-native-view-shot
//   npx expo install expo-font
//   npx expo install @expo-google-fonts/cormorant-garamond
//   npx expo install @expo-google-fonts/dm-sans

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import {
  useFonts,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_500Medium,
} from '@expo-google-fonts/cormorant-garamond';
import {
  DMSans_300Light,
  DMSans_400Regular,
  DMSans_500Medium,
} from '@expo-google-fonts/dm-sans';

const COLOUR_BAR = [
  '#C49A74',
  '#8B5E4A',
  '#A8C4B0',
  '#D4B896',
  '#7D6B5A',
  '#E8D4BC',
  '#B8956A',
  '#6B8C7A',
];

export default function ShareCard() {
  const cardRef = useRef(null);

  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_500Medium,
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
  });

  const handleShare = async () => {
    try {
      const uri = await cardRef.current.capture();
      await Share.share(
        Platform.OS === 'android'
          ? { message: 'Check out Styla — colour and style analysis app', url: uri }
          : { url: uri }
      );
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.screen}>

      {/* ViewShot wraps only the card — the share button is excluded from the image */}
      <ViewShot ref={cardRef} options={{ format: 'png', quality: 1 }}>
        <View style={styles.card}>

          {/* Colour bar */}
          <View style={styles.colourBar}>
            {COLOUR_BAR.map((colour, i) => (
              <View key={i} style={[styles.barSegment, { backgroundColor: colour }]} />
            ))}
          </View>

          <View style={styles.body}>

            {/* Stars */}
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Text key={i} style={styles.star}>★</Text>
              ))}
            </View>

            {/* Headline */}
            <Text style={styles.headline}>
              "I finally know my colours — and how to dress my shape."
            </Text>

            {/* Body copy */}
            <Text style={styles.subCopy}>
              Got my personalised colour season and body shape analysis — the kind that normally costs £400+ with a stylist. Done in minutes, on my phone.
            </Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* App row */}
            <View style={styles.appRow}>
              <View style={styles.appIcon}>
                <Text style={styles.appIconLetter}>S</Text>
              </View>
              <View>
                <Text style={styles.appName}>Styla</Text>
                <Text style={styles.appTagline}>Colour & Style Analysis App</Text>
              </View>
            </View>

            {/* CTA */}
            <View style={styles.ctaButton}>
              <Text style={styles.ctaText}>Download on Google Play →</Text>
            </View>

          </View>
        </View>
      </ViewShot>

      {/* Share trigger — outside ViewShot so it doesn't appear in the image */}
      <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.85}>
        <Text style={styles.shareButtonText}>Share your result</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    paddingVertical: 24,
  },

  // Card
  card: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E4DF',
  },

  // Colour bar
  colourBar: {
    flexDirection: 'row',
    height: 4,
  },
  barSegment: {
    flex: 1,
  },

  // Card body
  body: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 22,
  },

  // Stars
  starsRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 8,
  },
  star: {
    color: '#C49A74',
    fontSize: 11,
  },

  // Headline
  headline: {
    fontFamily: 'CormorantGaramond_500Medium',
    fontSize: 22,
    lineHeight: 29,
    color: '#1C1410',
    marginBottom: 10,
  },

  // Body copy
  subCopy: {
    fontFamily: 'DMSans_300Light',
    fontSize: 12,
    lineHeight: 20,
    color: '#8A7B6E',
    marginBottom: 18,
  },

  // Divider
  divider: {
    height: 0.5,
    backgroundColor: '#EEEBE6',
    marginBottom: 14,
  },

  // App row
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  appIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2A1F14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconLetter: {
    fontFamily: 'CormorantGaramond_400Regular_Italic',
    fontSize: 16,
    color: '#FAF7F2',
  },
  appName: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: '#2A1F14',
  },
  appTagline: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 10,
    color: '#9A8878',
  },

  // CTA button (outlined)
  ctaButton: {
    borderWidth: 1,
    borderColor: '#2A1F14',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    color: '#2A1F14',
    letterSpacing: 0.5,
  },

  // Share button (below the card, not captured in screenshot)
  shareButton: {
    marginTop: 20,
    backgroundColor: '#2A1F14',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 44,
  },
  shareButtonText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: '#FAF7F2',
    letterSpacing: 0.3,
  },
});