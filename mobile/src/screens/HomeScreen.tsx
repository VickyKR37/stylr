import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Styla</Text>
      <Text style={styles.subtitle}>Choose a feature to continue.</Text>

      <Pressable style={styles.card} onPress={() => navigation.navigate('StyleAnalysis')}>
        <Text style={styles.cardTitle}>Style analysis</Text>
        <Text style={styles.cardBody}>Please note this Style Analysis is designed only for women. Answer a few questions to get personalised style guidance.</Text>
      </Pressable>

      <Pressable style={[styles.card, styles.cardSpacer]} onPress={() => navigation.navigate('ColourAnalysis')}>
        <Text style={styles.cardTitle}>Colour analysis</Text>
        <Text style={styles.cardBody}>Upload or take a photo to find your season and palette.</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0b1220',
  },
  title: {
    color: '#f8fafc',
    fontSize: 30,
    fontWeight: '700',
    marginTop: 6,
  },
  subtitle: {
    color: '#cbd5e1',
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
  },
  cardSpacer: {
    marginTop: 12,
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardBody: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
  },
});

