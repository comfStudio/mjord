import { Redirect, usePathname } from "expo-router";
import { ReactElement } from "react";
import { Text, View } from "react-native";

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

  if (!data.name && !path.startsWith("/user/onboard")) {
    return <Redirect href="/user/onboard" />;
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
