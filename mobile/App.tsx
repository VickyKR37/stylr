import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen } from './screens/auth/LoginScreen';
import { SignupScreen } from './screens/auth/SignupScreen';
import { ColourAnalysisScreen } from './src/screens/ColourAnalysisScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { StyleAnalysisScreen } from './src/screens/StyleAnalysisScreen';

export type RootStackParamList = {
  Home: undefined;
  ColourAnalysis: undefined;
  StyleAnalysis: undefined;
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
        <RootNavigation />
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingShell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F5',
  },
});
