import * as FileSystem from "expo-file-system";
import { useEffect, useMemo, useReducer, useState } from "react";

import constant, { constantEmitter, ServiceType } from "@app/constants";

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

export function useI18nLangs() {
  console.log({ assets: FileSystem.bundledAssets });
  console.log({ assetsDir: FileSystem.bundleDirectory });

  return useMemo(() => {
    return [];
  }, []);
}
