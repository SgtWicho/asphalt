import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import OnboardingScreen from '../screens/OnboardingScreen';
import GrabarScreen from '../screens/GrabarScreen';
import Placeholder from '../screens/Placeholder';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Grabar" component={GrabarScreen} />
      <Stack.Screen name="Planificador" children={() => <Placeholder name="Planificador" />} />
      <Stack.Screen name="Navegacion" children={() => <Placeholder name="Navegación" />} />
      <Stack.Screen name="Publicar" children={() => <Placeholder name="Publicar" />} />
      <Stack.Screen name="Detalle" children={() => <Placeholder name="Detalle" />} />
      <Stack.Screen name="POI" children={() => <Placeholder name="POI" />} />
    </Stack.Navigator>
  );
}
