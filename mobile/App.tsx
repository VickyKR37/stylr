import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ColourAnalysisScreen } from './src/screens/ColourAnalysisScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { StyleAnalysisScreen } from './src/screens/StyleAnalysisScreen';

export type RootStackParamList = {
  Home: undefined;
  ColourAnalysis: undefined;
  StyleAnalysis: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Styla' }} />
          <Stack.Screen
            name="ColourAnalysis"
            component={ColourAnalysisScreen}
            options={{ title: 'Colour Analysis' }}
          />
          <Stack.Screen
            name="StyleAnalysis"
            component={StyleAnalysisScreen}
            options={{ title: 'Style Analysis' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
