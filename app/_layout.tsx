import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#F4B000',
          },
          headerTintColor: '#000',
          headerShadowVisible: false,

          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="registro"
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="olvido-contraseña"
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="dashboard"
          options={{ headerShown: false }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
