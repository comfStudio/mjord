import { Redirect, useFocusEffect } from "expo-router";

import { ROUTES } from "../../constants";
import { useAuthListener, useAuthUser } from "../../services/user";

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
