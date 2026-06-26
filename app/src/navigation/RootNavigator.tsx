import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import GrabarScreen from '../screens/GrabarScreen';
import PlanificadorScreen from '../screens/PlanificadorScreen';
import NavegacionScreen from '../screens/NavegacionScreen';
import PublicarScreen from '../screens/PublicarScreen';
import DetalleScreen from '../screens/DetalleScreen';
import POIScreen from '../screens/POIScreen';
import EditarPerfilScreen from '../screens/EditarPerfilScreen';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Grabar" component={GrabarScreen} />
      <Stack.Screen name="Planificador" component={PlanificadorScreen} />
      <Stack.Screen name="Navegacion" component={NavegacionScreen} />
      <Stack.Screen name="Publicar" component={PublicarScreen} />
      <Stack.Screen name="Detalle" component={DetalleScreen} />
      <Stack.Screen name="POI" component={POIScreen} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
    </Stack.Navigator>
  );
}
