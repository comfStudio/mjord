import { Slot, Tabs } from 'expo-router';

export default function HomeLayout() {
  return (
    <>
      <Slot />
      <Tabs />
    </>
  );
}
