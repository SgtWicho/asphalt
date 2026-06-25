import { View, Pressable, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from './types';
import { colors } from '../theme/colors';
import { HomeIcon, MapIcon, RouteIcon, PlayIcon, UserIcon } from '../components/Icons';
import FeedScreen from '../screens/FeedScreen';
import ExplorarScreen from '../screens/ExplorarScreen';
import PerfilScreen from '../screens/PerfilScreen';
import SavedRoutesScreen from '../screens/SavedRoutesScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

function RecordTabIcon() {
  return (
    <View style={styles.recordBtn}>
      <PlayIcon size={20} />
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.borderSoft, height: 80, paddingTop: 8 },
        tabBarActiveTintColor: colors.amber,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} options={{ tabBarIcon: ({ color }) => <HomeIcon color={color} /> }} />
      <Tab.Screen
        name="Explorar"
        component={ExplorarScreen}
        options={{ tabBarIcon: ({ color }) => <MapIcon color={color} /> }}
      />
      <Tab.Screen
        name="GrabarTab"
        children={() => <View />}
        options={{
          tabBarButton: ({ onPress, accessibilityState }) => (
            <Pressable onPress={onPress} accessibilityState={accessibilityState} style={styles.tabBtnWrap}>
              <RecordTabIcon />
            </Pressable>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.navigate('Grabar');
          },
        })}
      />
      <Tab.Screen
        name="Rutas"
        component={SavedRoutesScreen}
        options={{ tabBarIcon: ({ color }) => <RouteIcon color={color} /> }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ tabBarIcon: ({ color }) => <UserIcon color={color} /> }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBtnWrap: { alignItems: 'center', justifyContent: 'center' },
  recordBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    borderWidth: 4,
    borderColor: colors.surface,
  },
});
