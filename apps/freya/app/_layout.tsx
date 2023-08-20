import { Tabs, usePathname } from "expo-router";
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

import constant, { ROUTES } from "../constants";
import { AuthListener } from "../feature/auth/Auth";
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

function HiddenTabs() {
  return [
    "index",
    "(main)/login/index",
    "(main)/login/onboard/index",
    "(main)/login/1",
    "(main)/login/2",
    "(main)/group/index",
    "(aux)/privacy-policy",
    "(aux)/terms-of-service",
  ].map((name) => (
    <Tabs.Screen
      key={name}
      // Name of the route to hide.
      name={name}
      options={{
        // This tab will no longer show up in the tab bar.
        href: null,
      }}
    />
  ));
}

export default function RootLayout() {
  const path = usePathname();

  useEffect(() => {
    constant.log.d("Navigating to", path);
  }, [path]);

  return (
    <RecoilRoot>
      <QueryClientProvider client={constant.client}>
        <AuthListener redirect={ROUTES.HOME} />
        <Init />
        <Tabs backBehavior="history">
          {HiddenTabs()}

          <Tabs.Screen
            name="(main)/home"
            options={{
              title: t`Explore`,
              tabBarIcon: ({ color }) => (
                <Feather name="navigation" color={color} size={26} />
              ),
            }}
          />
          <Tabs.Screen
            name="user"
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
