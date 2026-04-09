import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './context/AuthContext';
import { PaymentAccessProvider } from './context/PaymentAccessContext';
import { LoginScreen } from './screens/auth/LoginScreen';
import { SignupScreen } from './screens/auth/SignupScreen';
import { LegalLinksFooter } from './src/components/LegalLinksFooter';
import { ColourAnalysisScreen } from './src/screens/ColourAnalysisScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';
import { StyleAnalysisScreen } from './src/screens/StyleAnalysisScreen';

export type RootStackParamList = {
  Home: undefined;
  ColourAnalysis: undefined;
  StyleAnalysis: undefined;
  Payment: { target: 'StyleAnalysis' | 'ColourAnalysis' };
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const AppStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AppNavigator() {
  return (
    <AppStack.Navigator initialRouteName="Home">
      <AppStack.Screen name="Home" component={HomeScreen} options={{ title: 'Styla' }} />
      <AppStack.Screen
        name="ColourAnalysis"
        component={ColourAnalysisScreen}
        options={{ title: 'Colour Analysis' }}
      />
      <AppStack.Screen
        name="StyleAnalysis"
        component={StyleAnalysisScreen}
        options={{ title: 'Style Analysis' }}
      />
      <AppStack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment' }} />
    </AppStack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <AuthStack.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign up' }} />
    </AuthStack.Navigator>
  );
}

function RootNavigation() {
  const { loading, session } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingShell}>
        <ActivityIndicator size="large" color="#C4956A" />
      </View>
    );
  }

  return <NavigationContainer>{session ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaymentAccessProvider>
          <View style={styles.appShell}>
            <View style={styles.navigationShell}>
              <RootNavigation />
            </View>
            <LegalLinksFooter />
          </View>
        </PaymentAccessProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
  },
  navigationShell: {
    flex: 1,
  },
  loadingShell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F5',
  },
});
