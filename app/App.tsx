import { useCallback } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Saira_400Regular,
  Saira_500Medium,
  Saira_600SemiBold,
  Saira_700Bold,
} from '@expo-google-fonts/saira';
import {
  SairaCondensed_500Medium,
  SairaCondensed_600SemiBold,
  SairaCondensed_700Bold,
  SairaCondensed_800ExtraBold,
} from '@expo-google-fonts/saira-condensed';
import {
  SairaSemiCondensed_600SemiBold,
  SairaSemiCondensed_700Bold,
} from '@expo-google-fonts/saira-semi-condensed';
import RootNavigator from './src/navigation/RootNavigator';
import AuthScreen from './src/screens/AuthScreen';
import { AuthProvider, useAuth } from './src/auth/AuthProvider';
import { colors } from './src/theme/colors';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { session, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      {session ? <RootNavigator /> : <AuthScreen />}
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Saira_400Regular,
    Saira_500Medium,
    Saira_600SemiBold,
    Saira_700Bold,
    SairaCondensed_500Medium,
    SairaCondensed_600SemiBold,
    SairaCondensed_700Bold,
    SairaCondensed_800ExtraBold,
    SairaSemiCondensed_600SemiBold,
    SairaSemiCondensed_700Bold,
  });

  const onLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }} onLayout={onLayout}>
      <StatusBar style="light" />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </View>
  );
}
