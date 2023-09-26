import { Redirect } from "expo-router";

import { ROUTES } from "@app/constants";

export default function App() {
  return <Redirect href={ROUTES.HOME} />;
}
