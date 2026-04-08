import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

type FeatureKey = 'style' | 'colour';
type PaymentPlan = 'style' | 'colour' | 'both';

type PaymentAccessValue = {
  hasStyleAccess: boolean;
  hasColourAccess: boolean;
  loading: boolean;
  hasAccessFor: (feature: FeatureKey) => boolean;
  completePayment: (plan: PaymentPlan) => Promise<void>;
};

const STORAGE_KEY = 'styla_payment_access_v1';

const PaymentAccessContext = createContext<PaymentAccessValue | undefined>(undefined);

export function PaymentAccessProvider({ children }: PropsWithChildren) {
  const [hasStyleAccess, setHasStyleAccess] = useState(false);
  const [hasColourAccess, setHasColourAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function restore() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        const parsed = JSON.parse(stored) as { hasStyleAccess?: boolean; hasColourAccess?: boolean };
        if (!mounted) return;
        setHasStyleAccess(Boolean(parsed.hasStyleAccess));
        setHasColourAccess(Boolean(parsed.hasColourAccess));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    restore();
    return () => {
      mounted = false;
    };
  }, []);

  async function persist(nextStyle: boolean, nextColour: boolean) {
    setHasStyleAccess(nextStyle);
    setHasColourAccess(nextColour);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ hasStyleAccess: nextStyle, hasColourAccess: nextColour }),
    );
  }

  async function completePayment(plan: PaymentPlan) {
    const nextStyle = hasStyleAccess || plan === 'style' || plan === 'both';
    const nextColour = hasColourAccess || plan === 'colour' || plan === 'both';
    await persist(nextStyle, nextColour);
  }

  function hasAccessFor(feature: FeatureKey) {
    return feature === 'style' ? hasStyleAccess : hasColourAccess;
  }

  const value = useMemo<PaymentAccessValue>(
    () => ({
      hasStyleAccess,
      hasColourAccess,
      loading,
      hasAccessFor,
      completePayment,
    }),
    [hasColourAccess, hasStyleAccess, loading],
  );

  return <PaymentAccessContext.Provider value={value}>{children}</PaymentAccessContext.Provider>;
}

export function usePaymentAccess() {
  const context = useContext(PaymentAccessContext);
  if (!context) {
    throw new Error('usePaymentAccess must be used within a PaymentAccessProvider');
  }
  return context;
}
