import { Redirect } from "expo-router";
import { useRecoilValue } from "recoil";

import { UserState } from "../../state";

export default function LoginScreen() {
  let el = <Redirect href="login/1" />;

  const state = useRecoilValue(UserState.loginState);

  if (state.email) {
    el = <Redirect href="login/2" />;
  }

  return el;
}
