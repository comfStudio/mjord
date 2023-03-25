import { Tabs } from "expo-router";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import { RecoilRoot } from "recoil";

import NetInfo from "@react-native-community/netinfo";
import {
  focusManager,
  onlineManager,
  QueryClientProvider,
} from "@tanstack/react-query";

import constant from "../constants";

import type { AppStateStatus } from "react-native";
function useRefetchOnFocus() {
  useEffect(() => {
    function onAppStateChange(status: AppStateStatus) {
      if (Platform.OS !== "web") {
        focusManager.setFocused(status === "active");
      }
    }

    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);
}

function useOnlineStatusManagement() {
  useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      });
    });
  }, []);
}

export default function RootLayout() {
  useOnlineStatusManagement();
  useRefetchOnFocus();

  return (
    <RecoilRoot>
      <QueryClientProvider client={constant.client}>
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
      </QueryClientProvider>
    </RecoilRoot>
  );
}
