import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack initialRouteName="screens/home" />
      <StatusBar style="auto" />
    </>
  );
}
