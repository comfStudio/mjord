import { Redirect, usePathname } from "expo-router";
import { ReactElement } from "react";
import { Text, View } from "react-native";

import { useAuthUser, useProfile, userRequireOnboarding } from "@/services/user";
import constant, { ROUTES } from "@app/constants";

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

  // TODO: onboard data should be in profiles.extra
  if (data && userRequireOnboarding(data) && !path.startsWith(ROUTES.LOGIN_ONBOARDING)) {
    constant.log.d("User require onboarding");
    return <Redirect href={ROUTES.LOGIN_ONBOARDING} />;
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
