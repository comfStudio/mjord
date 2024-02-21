import "react-native-url-polyfill/auto";

import { usePathname } from "expo-router";
import { Tabs } from "expo-router/tabs";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useState } from "react";
import { AppState as NativeAppState, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RecoilRoot, useSetRecoilState } from "recoil";

import { AuthListener } from "@/feature/auth/Auth";
import setupServices from "@/services";
import { AppState, setupState } from "@/state";
import constant, { constantEmitter, ROUTES } from "@app/constants";
import { useAppLocale, useInitialized } from "@app/misc/hooks";
import { getQueryClient } from "@app/services/function";
import { ThemeProvider } from "@app/styles/theme";
import { Poppins_500Medium, useFonts } from "@expo-google-fonts/poppins";
import { Feather } from "@expo/vector-icons";
import { t } from "@mjord/common";
import getLogger from "@mjord/logger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { createClient } from "@supabase/supabase-js";
import { focusManager, onlineManager, QueryClientProvider, useQueryClient } from "@tanstack/react-query";

import type { AppStateStatus } from "react-native";
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export async function main() {
  try {
    if (!constant.log) {
      constant.log = getLogger();
    }

    constant.log("initializing app");

    constant.log("Setting up states");
    setupState();

    constant.log("Setting up supabase");
    constant.supabase = createClient(constant.options.SUPABASE_URL, constant.options.SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

    constant.log("Setting up services");
    constant.service = await setupServices();

    constant.initialized = true;

    constant.log("initialized app");

    constantEmitter.emit("initialized", true);
  } catch (error) {
    constantEmitter.emit("initialized", false);
    constant.log?.e?.("Error initializing app", (error as any)?.message);
    throw error;
  }
}

function useRefetchOnFocus() {
  useEffect(() => {
    function onAppStateChange(status: AppStateStatus) {
      if (Platform.OS !== "web") {
        focusManager.setFocused(status === "active");
      }
    }

    const subscription = NativeAppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);
}

function useOnlineStatusManagement() {
  const setIsOnline = useSetRecoilState(AppState.isOnline);

  useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected && !!state.isInternetReachable);
        setIsOnline(!!state.isConnected && !!state.isInternetReachable);
      });
    });
  }, []);
}

function initReducer(state: { main: boolean; fonts: boolean }, { type }: { type: "main" | "fonts" }) {
  return { ...state, [type]: true };
}

function Init() {
  useAppLocale();

  useOnlineStatusManagement();
  useRefetchOnFocus();

  const initialized = useInitialized();
  const client = useQueryClient();

  useLayoutEffect(() => {
    if (initialized) {
      constant.log.d("BACKEND_URL", constant.options.SUPABASE_URL);
      constant.log.d("Invalidating queries");
      client.invalidateQueries({
        refetchType: "all",
      });
    }
  }, [initialized, client]);

  return null;
}

function useInit() {
  const [ready, dispatchReady] = useReducer(initReducer, { main: false, fonts: false });

  // main
  useMemo(() => {
    if (constant.initialized) {
      dispatchReady({ type: "main" });
    } else {
      main().then(() => dispatchReady({ type: "main" }));
    }
  }, []);

  // fonts

  const [fontsLoaded, fontError] = useFonts({
    Poppins_500Medium,
  });

  useLayoutEffect(() => {
    if (fontsLoaded || fontError) {
      constant?.log?.i?.("Fonts loaded");
      dispatchReady({ type: "fonts" });
    } else {
      if (!constant.initialized) {
        constant?.log?.i?.("Loading fonts");
      }
    }
  }, [fontsLoaded, fontError]);

  return Object.values(ready).every((v) => v);
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
  const appIsReady = useInit();

  const [revealed, setRevealed] = useState(constant.initialized);

  const path = usePathname();

  useEffect(() => {
    if (!constant.initialized) {
      constant?.log?.d?.("Navigating to", path);
    }
  }, [path]);

  const { client } = useMemo(() => {
    if (!constant.log) {
      constant.log = getLogger();
    }

    if (!constant.client) {
      constant.client = getQueryClient();
    }

    return {
      client: constant.client,
    };
  }, []);

  const reveal = useCallback(async () => {
    await SplashScreen.hideAsync();
    setRevealed(true);
  }, []);

  useEffect(() => {
    if (appIsReady && !revealed) {
      reveal();
    }
  }, [revealed, appIsReady]);

  return (
    <RecoilRoot>
      <QueryClientProvider client={client}>
        <SafeAreaProvider>
          <ThemeProvider>
            <AuthListener redirect={ROUTES.HOME} />
            <Init />
            <Tabs
              backBehavior="history"
              initialRouteName="(main)/home"
              screenOptions={{
                headerShown: true,
                title: "",
              }}
            >
              {HiddenTabs()}

              <Tabs.Screen
                name="(main)/home"
                options={{
                  title: t`Explore`,
                  tabBarIcon: ({ color }) => <Feather name="navigation" color={color} size={26} />,
                }}
              />
              <Tabs.Screen
                name="user"
                options={{
                  title: t`You`,
                  tabBarIcon: ({ color }) => <Feather name="user" color={color} size={26} />,
                }}
              />
            </Tabs>
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
