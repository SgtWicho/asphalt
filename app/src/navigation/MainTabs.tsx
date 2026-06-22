import { View, Pressable, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from './types';
import { colors } from '../theme/colors';
import { HomeIcon, MapIcon, RouteIcon, PlayIcon } from '../components/Icons';
import FeedScreen from '../screens/FeedScreen';
import Placeholder from '../screens/Placeholder';

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
        children={() => <Placeholder name="Explorar" />}
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
        children={() => <Placeholder name="Rutas" />}
        options={{ tabBarIcon: ({ color }) => <RouteIcon color={color} /> }}
      />
      <Tab.Screen
        name="Perfil"
        children={() => <Placeholder name="Perfil" />}
        options={{ tabBarIcon: ({ color }) => <HomeIcon color={color} /> }}
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
