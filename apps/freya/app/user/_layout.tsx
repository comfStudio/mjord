import { Slot } from "expo-router";

import { Auth } from "../../feature/auth/Auth";
import { Onboard } from "../../feature/auth/Onboard";

export default function UserLayout() {
  return (
    <Onboard>
      <Auth>
        <Slot />
      </Auth>
    </Onboard>
  );
}
