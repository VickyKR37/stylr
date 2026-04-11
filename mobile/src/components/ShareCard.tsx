import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import {
  Alert,
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import RNShare, { Social } from 'react-native-share';
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

export type ShareCardProps = {
  /** When false, the built-in Share control stays hidden (e.g. scroll-gated). */
  shareButtonVisible?: boolean;
  /** When true, only the captureable card is rendered; call ref.share() from elsewhere. */
  hideShareButton?: boolean;
};

export type ShareCardRef = {
  share: () => Promise<void>;
};

/** react-native-view-shot often returns a temp path; Android Share needs a proper file/content URI in `url`. */
function normalizeCaptureUri(uri: string): string {
  const trimmed = uri.trim();
  if (trimmed.startsWith('file://') || trimmed.startsWith('content://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return `file://${trimmed}`;
  }
  return trimmed;
}

async function shareImageWithExpo(uri: string) {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: 'Share',
    });
  }
}

const FACEBOOK_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID ?? '';

async function shareToFacebookStory(fileUri: string) {
  if (!FACEBOOK_APP_ID) {
    Alert.alert(
      'Facebook Story',
      'Add EXPO_PUBLIC_FACEBOOK_APP_ID to your environment (Facebook app ID) so Stories sharing can open the Facebook app.',
    );
    return;
  }
  try {
    await RNShare.shareSingle({
      appId: FACEBOOK_APP_ID,
      social: Social.FacebookStories,
      backgroundImage: fileUri,
    });
  } catch (e) {
    console.warn('Facebook Story share', e);
    const message = e instanceof Error ? e.message : 'Could not open Facebook Stories.';
    Alert.alert('Facebook', message);
  }
}

/**
 * WhatsApp does not expose a public “Status” intent. This uses the WhatsApp image share target
 * (no chat message) so the image opens in WhatsApp; from there many users can set it as Status.
 */
async function shareToWhatsAppStatus(fileUri: string) {
  try {
    await RNShare.shareSingle({
      social: Social.Whatsapp,
      url: fileUri,
      type: 'image/png',
      filename: 'styla-card.png',
    });
  } catch (e) {
    console.warn('WhatsApp share', e);
    try {
      await shareImageWithExpo(fileUri);
    } catch {
      Alert.alert('WhatsApp', 'Could not open WhatsApp with this image.');
    }
  }
}

function promptStoryDestinations(fileUri: string) {
  Alert.alert('Share', 'Choose where to share your card', [
    { text: 'Facebook Story', onPress: () => void shareToFacebookStory(fileUri) },
    { text: 'WhatsApp Status', onPress: () => void shareToWhatsAppStatus(fileUri) },
    { text: 'Cancel', style: 'cancel' },
  ]);
}

const ShareCard = forwardRef<ShareCardRef, ShareCardProps>(function ShareCard(
  { shareButtonVisible = true, hideShareButton = false },
  ref,
) {
  const cardRef = useRef<ViewShot | null>(null);
  const shareOpen = useRef(new Animated.Value(shareButtonVisible ? 1 : 0)).current;

  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_500Medium,
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
  });

  useEffect(() => {
    if (hideShareButton) return;
    Animated.spring(shareOpen, {
      toValue: shareButtonVisible ? 1 : 0,
      useNativeDriver: false,
      friction: 9,
      tension: 80,
    }).start();
  }, [shareButtonVisible, shareOpen, hideShareButton]);

  const handleShare = useCallback(async () => {
    try {
      const captured = await cardRef.current?.capture?.();
      if (!captured) return;
      const fileUri = normalizeCaptureUri(captured);

      if (Platform.OS === 'web') {
        await shareImageWithExpo(fileUri);
        return;
      }

      promptStoryDestinations(fileUri);
    } catch (error) {
      console.error('Share failed:', error);
    }
  }, []);

  useImperativeHandle(ref, () => ({ share: handleShare }), [handleShare]);

  if (!fontsLoaded) return null;

  const shareMarginTop = shareOpen.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });
  const shareHeight = shareOpen.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 56],
  });

  return (
    <View style={[styles.screen, hideShareButton && styles.screenCardOnly]}>
      <ViewShot ref={cardRef} options={{ format: 'png', quality: 1 }}>
        <View style={styles.card}>
          <View style={styles.colourBar}>
            {COLOUR_BAR.map((colour, i) => (
              <View key={i} style={[styles.barSegment, { backgroundColor: colour }]} />
            ))}
          </View>

          <View style={styles.body}>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Text key={i} style={styles.star}>
                  ★
                </Text>
              ))}
            </View>

            <Text style={styles.headline}>
              "I finally know my colours — and how to dress my shape."
            </Text>

            <Text style={styles.subCopy}>
              Got my personalised colour season and body shape analysis — the kind that normally costs £400+ with a stylist. Done in minutes, on my phone.
            </Text>

            <View style={styles.divider} />

            <View style={styles.appRow}>
              <View style={styles.appIcon}>
                <Text style={styles.appIconLetter}>S</Text>
              </View>
              <View>
                <Text style={styles.appName}>Styla</Text>
                <Text style={styles.appTagline}>Colour & Style Analysis App</Text>
              </View>
            </View>

            <View style={styles.ctaButton}>
              <Text style={styles.ctaText}>Download on Google Play →</Text>
            </View>
          </View>
        </View>
      </ViewShot>

      {!hideShareButton ? (
        <Animated.View
          style={[styles.shareButtonSlot, { marginTop: shareMarginTop, height: shareHeight }]}
          pointerEvents={shareButtonVisible ? 'auto' : 'none'}
        >
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.85}
            disabled={!shareButtonVisible}
          >
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : null}
    </View>
  );
});

export default ShareCard;

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  screenCardOnly: {
    paddingVertical: 12,
  },

  card: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E4DF',
  },

  colourBar: {
    flexDirection: 'row',
    height: 4,
  },
  barSegment: {
    flex: 1,
  },

  body: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 22,
  },

  starsRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 8,
  },
  star: {
    color: '#C49A74',
    fontSize: 11,
  },

  headline: {
    fontFamily: 'CormorantGaramond_500Medium',
    fontSize: 22,
    lineHeight: 29,
    color: '#1C1410',
    marginBottom: 10,
  },

  subCopy: {
    fontFamily: 'DMSans_300Light',
    fontSize: 12,
    lineHeight: 20,
    color: '#8A7B6E',
    marginBottom: 18,
  },

  divider: {
    height: 0.5,
    backgroundColor: '#EEEBE6',
    marginBottom: 14,
  },

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

  shareButtonSlot: {
    overflow: 'hidden',
    alignSelf: 'center',
  },

  shareButton: {
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
