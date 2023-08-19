import { Redirect } from "expo-router";
import { useRecoilValue } from "recoil";

import { ROUTES } from "../../../constants";
import { UserState } from "../../../state";

export default function LoginScreen() {
  let el = <Redirect href={ROUTES.LOGIN_1} />;

  const state = useRecoilValue(UserState.loginState);

  if (state.email) {
    el = <Redirect href={ROUTES.LOGIN_2} />;
  }

  return el;
}
