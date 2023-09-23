import 'react-native-url-polyfill/auto';

import { getLocales } from 'expo-localization';
import { SplashScreen, Tabs, useNavigation, usePathname } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  AppState as NativeAppState,
  Platform,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecoilRoot, useSetRecoilState } from 'recoil';

import { AuthListener } from '@/feature/auth/Auth';
import setupServices from '@/services';
import { AppState, setupState } from '@/state';
import { languages } from '@/state/_app';
import constant, { ROUTES } from '@app/constants';
import langDA from '@app/i18n/da.json';
import { ThemeProvider } from '@app/styles/theme';
import { Feather } from '@expo/vector-icons';
import { addLocale, t, useLocale } from '@mjord/common';
import getLogger from '@mjord/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createClient } from '@supabase/supabase-js';
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import type { AppStateStatus } from "react-native";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export async function main() {
  constant.log = getLogger();

  constant.log("initializing app");

  constant.log("Setting up states");
  setupState();

  constant.log("Setting up supabase");
  constant.supabase = createClient(
    constant.options.SUPABASE_URL,
    constant.options.SUPABASE_ANON_KEY,
    {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    }
  );

  constant.log("Setting up react query");
  constant.client = new QueryClient();

  constant.log("Setting up services");
  constant.service = await setupServices();

  constant.initialized = true;

  applyLocale();

  constant.log("initialized app");
}

function applyLocale() {
  const deviceLanguage = getLocales()[0].languageCode;
  const langs = {
    da: langDA,
  };

  languages.forEach((lang) => {
    if (lang === "en") return; // English is the default language
    if (!langs[lang]) throw new Error(`Language ${lang}.json not found`);
    addLocale(lang, langs[lang]);
    if (lang === deviceLanguage) {
      useLocale(lang);
      constant.locale = lang;
    }
  });
}

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
  const [appIsReady, setAppIsReady] = useState(false);

  const path = usePathname();

  useEffect(() => {
    main().then(() => setAppIsReady(true));
  }, []);

  useEffect(() => {
    constant.log.d("Navigating to", path);
  }, [path]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const nav = useNavigation()

  if (!appIsReady) {
    return <ActivityIndicator />;
  }

  return (
    <RecoilRoot>
      <QueryClientProvider client={constant.client}>
        <SafeAreaProvider>
          <ThemeProvider>
            <AuthListener redirect={ROUTES.HOME} />
            <Init />
            <Tabs
              backBehavior="history"
              initialRouteName="(main)/home"
              screenListeners={({ navigation, route}) => {
                const nav: Navigation = navigation;
                if (navigation) {

                }
                return {}
              }}
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
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
