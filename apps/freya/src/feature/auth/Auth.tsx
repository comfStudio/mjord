import { Redirect, useFocusEffect } from "expo-router";

import { useAuthListener, useAuthUser } from "@/services/user";
import { ROUTES } from "@app/constants";

export function AuthListener({ redirect }: { redirect?: string }) {
  const refresh = useAuthListener();

  useFocusEffect(() => {
    refresh(redirect);
  });

  return null;
}

export function Auth({ children }: { children: React.ReactNode }) {
  const user = useAuthUser();

  return <>{user ? children : <Redirect href={ROUTES.LOGIN} />}</>;
}
