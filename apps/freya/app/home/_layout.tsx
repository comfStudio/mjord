import { Slot } from "expo-router";

import GroupDetailDrawer from "../../feature/GroupDetailDrawer";

export default function HomeLayout() {
  return (
    <>
      <Slot />
      <GroupDetailDrawer />
    </>
  );
}
