import "expo-router/entry";
import "react-native-url-polyfill/auto";

import setupServices from "./services";

import getLogger from "@mjord/logger";

import constant from "./constants";
import { setupState } from "./state";

import { useLocale, addLocale } from "@mjord/common";
import { languages } from "./state/_app";

import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";
import { getLocales } from "expo-localization";

import langDA from "./i18n/da.json";

async function main() {
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

  constant.log("initialized app");
}

main();

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

applyLocale();
