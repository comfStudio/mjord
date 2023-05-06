import { Redirect } from 'expo-router';

import { useAuthUser } from '../../services/user';

export function Auth({ children }: { children: React.ReactNode }) {
  const user = useAuthUser();

  return <>{user ? children : <Redirect href="/login" />}</>;
}
