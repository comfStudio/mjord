import { Redirect } from 'expo-router';

import { ROUTES } from "@app/constants";

export default function Page() {
  return <Redirect href={ROUTES.HOME} />;
}
