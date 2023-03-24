import { Tabs } from "expo-router";
import { RecoilRoot } from "recoil";

export default function RootLayout() {
  return (
    <RecoilRoot>
      <Tabs>
        <Tabs.Screen
          // Name of the route to hide.
          name="index"
          options={{
            // This tab will no longer show up in the tab bar.
            href: null,
          }}
        />
        <Tabs.Screen
          // Name of the route to hide.
          name="detail/index"
          options={{
            // This tab will no longer show up in the tab bar.
            href: null,
          }}
        />
      </Tabs>
    </RecoilRoot>
  );
}
