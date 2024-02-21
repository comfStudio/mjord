import { getLocales } from "expo-localization";
import { useEffect, useMemo, useReducer, useState } from "react";
import { useRecoilState } from "recoil";

import { getFilename, readFile } from "@/misc/fs";
import constant, { constantEmitter, ServiceType } from "@app/constants";
import { AppState } from "@app/state";
import { addLocale, LocaleData, useLocale } from "@mjord/common";

import { useCachedAssetFiles } from "./assets";

export function useInitialized() {
  const [initialized, setInitialized] = useToggle();

  useEffect(() => {
    if (constant.initialized) {
      setInitialized(true);
    } else {
      constantEmitter.on("initialized", setInitialized);
      return () => {
        constantEmitter.off("initialized", setInitialized);
      };
    }
  }, []);

  return initialized;
}

export function useService<T extends ServiceType>(type: T) {
  const i = useInitialized();
  return useMemo(() => {
    if (i) {
      return constant.service.get<T>(type);
    }
    return undefined;
  }, [i]);
}

export function useToggle<T = boolean>(options: readonly T[] = [false, true] as any) {
  const [[option], toggle] = useReducer((state: T[], action: React.SetStateAction<T>) => {
    const value = action instanceof Function ? action(state[0]) : action;
    const index = Math.abs(state.indexOf(value));

    return state.slice(index).concat(state.slice(0, index));
  }, options as T[]);

  return [option, toggle as (value?: React.SetStateAction<T>) => void] as const;
}

export function useRefreshByUser<T extends () => Promise<unknown>>(refetch: T) {
  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false);

  async function refetchByUser() {
    setIsRefetchingByUser(true);

    try {
      await refetch();
    } finally {
      setIsRefetchingByUser(false);
    }
  }

  return {
    isRefetchingByUser,
    refetchByUser,
  };
}

export function useAppLocale() {
  const [chosenLanguage, setChosenLanguage] = useRecoilState(AppState.language);

  const assetFiles = useCachedAssetFiles(constant.assetPaths.I18N);
  const [langContent, setLangContent] = useState<Record<string, LocaleData>>({});

  useEffect(() => {
    const langFiles = assetFiles.filter((f) => f.endsWith(".json"));

    constant.log.d(`Available languages: ${langFiles.join(",")}`);

    const ps: Promise<unknown>[] = [];
    const contents = { ...langContent };

    langFiles.forEach((langFile) => {
      const lang = getFilename(langFile, { includeExtension: false });

      if (lang === "en") return; // English is the default language
      if (contents[lang]) return; // Already loaded

      ps.push(
        readFile(langFile).then((data) => {
          const d = JSON.parse(data);
          addLocale(lang, d);

          contents[lang] = d;
        })
      );
    });

    Promise.all(ps).then(() => {
      const deviceLanguage = getLocales()[0].languageCode;

      let activeLang = !constant.locale && deviceLanguage ? deviceLanguage : chosenLanguage;

      if (activeLang !== "en" && !contents[activeLang]) {
        constant.log.e(`Language ${chosenLanguage}.json not found`);
        activeLang = "en";
      }

      constant.log.i("Active language", activeLang);

      setLangContent(contents);
      setChosenLanguage((p) => {
        constant.locale = activeLang;
        return activeLang;
      });
    });
  }, [chosenLanguage, assetFiles]);

  useLocale(chosenLanguage);

  return chosenLanguage;
}
