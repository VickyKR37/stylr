import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../App';
import { usePaymentAccess } from '../../context/PaymentAccessContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;
type Plan = 'style' | 'colour' | 'both';

const PRICES: Record<Plan, string> = {
  style: '£19.99',
  colour: '£6.99',
  both: '£24.99',
};

export function PaymentScreen({ navigation, route }: Props) {
  const { completePayment } = usePaymentAccess();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(
    route.params.target === 'StyleAnalysis' ? 'style' : 'colour',
  );
  const [submitting, setSubmitting] = useState(false);

  const destinationTitle = useMemo(
    () => (route.params.target === 'StyleAnalysis' ? 'Style Analysis' : 'Colour Analysis'),
    [route.params.target],
  );

  async function handlePay() {
    setSubmitting(true);
    try {
      await completePayment(selectedPlan);
      navigation.replace(route.params.target);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment required</Text>
      <Text style={styles.subtitle}>Choose a payment option to access {destinationTitle}.</Text>

      <Pressable
        style={[styles.optionCard, selectedPlan === 'style' ? styles.optionCardSelected : null]}
        onPress={() => setSelectedPlan('style')}
      >
        <Text style={styles.optionTitle}>Style Analysis</Text>
        <Text style={styles.optionPrice}>{PRICES.style}</Text>
      </Pressable>

      <Pressable
        style={[styles.optionCard, selectedPlan === 'colour' ? styles.optionCardSelected : null]}
        onPress={() => setSelectedPlan('colour')}
      >
        <Text style={styles.optionTitle}>Colour Analysis</Text>
        <Text style={styles.optionPrice}>{PRICES.colour}</Text>
      </Pressable>

      <Pressable
        style={[styles.optionCard, selectedPlan === 'both' ? styles.optionCardSelected : null]}
        onPress={() => setSelectedPlan('both')}
      >
        <Text style={styles.optionTitle}>Both analyses</Text>
        <Text style={styles.optionPrice}>{PRICES.both}</Text>
      </Pressable>

      <Pressable
        style={[styles.payButton, submitting ? styles.payButtonDisabled : null]}
        onPress={handlePay}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#FAF8F5" />
        ) : (
          <Text style={styles.payButtonText}>Pay {PRICES[selectedPlan]}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    padding: 20,
  },
  title: {
    color: '#2C2C2A',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 10,
  },
  subtitle: {
    color: '#4B5563',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 18,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#D3D1C7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  optionCardSelected: {
    borderColor: '#C4956A',
    backgroundColor: '#F8F2EB',
  },
  optionTitle: {
    color: '#2C2C2A',
    fontWeight: '700',
    fontSize: 16,
  },
  optionPrice: {
    color: '#6B7280',
    marginTop: 4,
    fontSize: 14,
  },
  payButton: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#C4956A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#FAF8F5',
    fontSize: 16,
    fontWeight: '800',
  },
});
