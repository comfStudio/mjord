import { Slot } from "expo-router";

import GroupDetailDrawer from "../../feature/group/GroupDetailDrawer";

export default function HomeLayout() {
  return (
    <>
      <Slot />
      <GroupDetailDrawer />
    </>
  );
}
