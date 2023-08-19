import { Redirect, usePathname } from "expo-router";
import { ReactElement } from "react";
import { Text, View } from "react-native";

import { ROUTES } from "../../constants";
import { useAuthUser, useProfile } from "../../services/user";

function OnboardUser({ children }: { children: React.ReactNode }) {
  const { data, isFetching } = useProfile();
  const path = usePathname();

  if (isFetching) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!data.name && !path.startsWith(ROUTES.USER_ONBOARDING)) {
    return <Redirect href={ROUTES.USER_ONBOARDING} />;
  }

  return children as ReactElement;
}

export function Onboard({ children }: { children: React.ReactNode }) {
  const user = useAuthUser();

  if (!user) {
    return children as ReactElement;
  }

  return <OnboardUser>{children}</OnboardUser>;
}
