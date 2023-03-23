import { SplashScreen } from "expo-router";

export default function App() {
  const [isReady, setReady] = React.useState(false);

  React.useEffect(() => {
    // Perform some sort of async data or asset fetching.
    setTimeout(() => {
      setReady(true);
    }, 1000);
  }, []);

  return (
    <>
      {/* When all loading is setup, unmount the splash screen component. */}
      {!isReady && <SplashScreen />}
      <Text>My App</Text>
    </>
  );
}