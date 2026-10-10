import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { AuthProvider } from '../hooks/useAuth';

export default function RootLayout() {
  useEffect(() => {
    // SDK 57: setBackgroundColorAsync/setButtonStyleAsync were removed.
    // setStyle controls the navigation bar button contrast ('dark' = dark icons).
    NavigationBar.setStyle('dark');
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}