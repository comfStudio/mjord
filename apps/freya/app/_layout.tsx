import { Tabs } from "expo-router";
import { useEffect } from "react";
import { AppState as NativeAppState, Platform } from "react-native";
import { RecoilRoot, useSetRecoilState } from "recoil";

import { Feather } from "@expo/vector-icons";
import { t } from "@mjord/common";
import NetInfo from "@react-native-community/netinfo";
import {
  focusManager,
  onlineManager,
  QueryClientProvider,
} from "@tanstack/react-query";

import constant from "../constants";
import { AppState } from "../state";

import type { AppStateStatus } from "react-native";
function useRefetchOnFocus() {
  useEffect(() => {
    function onAppStateChange(status: AppStateStatus) {
      if (Platform.OS !== "web") {
        focusManager.setFocused(status === "active");
      }
    }

    const subscription = NativeAppState.addEventListener(
      "change",
      onAppStateChange
    );

    return () => subscription.remove();
  }, []);
}

function useOnlineStatusManagement() {
  const setIsOnline = useSetRecoilState(AppState.isOnline);

  useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
        setIsOnline(!!state.isConnected);
      });
    });
  }, []);
}

function Init() {
  useOnlineStatusManagement();
  useRefetchOnFocus();

  return null;
}

function LoginTabs() {
  return [
    <Tabs.Screen
      // Name of the route to hide.
      name="login/index"
      options={{
        // This tab will no longer show up in the tab bar.
        href: null,
      }}
    />,
    <Tabs.Screen
      // Name of the route to hide.
      name="login/1"
      options={{
        // This tab will no longer show up in the tab bar.
        href: null,
      }}
    />,
    <Tabs.Screen
      // Name of the route to hide.
      name="login/2"
      options={{
        // This tab will no longer show up in the tab bar.
        href: null,
      }}
    />,
  ];
}

export default function RootLayout() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={constant.client}>
        <Init />
        <Tabs backBehavior="history">
          <Tabs.Screen
            // Name of the route to hide.
            name="index"
            options={{
              // This tab will no longer show up in the tab bar.
              href: null,
            }}
          />
          {LoginTabs()}

          <Tabs.Screen
            // Name of the route to hide.
            name="detail/index"
            options={{
              // This tab will no longer show up in the tab bar.
              href: null,
            }}
          />
          <Tabs.Screen
            name="home"
            options={{
              title: t`Explore`,
              tabBarIcon: ({ color }) => (
                <Feather name="navigation" color={color} size={26} />
              ),
            }}
          />
          <Tabs.Screen
            name="user/index"
            options={{
              title: t`You`,
              tabBarIcon: ({ color }) => (
                <Feather name="user" color={color} size={26} />
              ),
            }}
          />
        </Tabs>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
