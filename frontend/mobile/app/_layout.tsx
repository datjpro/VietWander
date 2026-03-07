import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AuthProvider, useAuth } from '../src/providers/AuthProvider';
import { colors } from '../src/theme/tokens';

function RootNavigator() {
  const { initializing, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const firstSegment = segments[0];
  const inAuthScreen = firstSegment === 'login' || firstSegment === 'register';
  const inProtectedScreen = firstSegment === '(tabs)' || firstSegment === 'province' || firstSegment === 'checkin-camera';
  const isReady = Boolean(navigationState?.key) && !initializing;
  const shouldRedirectToLogin = isReady && !user && !inAuthScreen && inProtectedScreen;
  const shouldRedirectToTabs = isReady && Boolean(user) && inAuthScreen;

  useEffect(() => {
    if (shouldRedirectToLogin) {
      router.replace('/login');
      return;
    }

    if (shouldRedirectToTabs) {
      router.replace('/(tabs)');
    }
  }, [router, shouldRedirectToLogin, shouldRedirectToTabs]);

  if (!isReady || shouldRedirectToLogin || shouldRedirectToTabs) {
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator color={colors.primaryDark} size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="checkin-camera" />
      <Stack.Screen name="province/[provinceId]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loaderScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
