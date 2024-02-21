import type { Logger } from "@mjord/logger";
import EventEmitter from "eventemitter3";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";

import { SupabaseClient } from "@supabase/supabase-js";
import { QueryClient } from "@tanstack/react-query";

import type { ServiceLocator } from "@/services/base";

export enum ServiceType {
  Database,
  Function,
  User,
  Group,
  Event,
  // Character,
  // Template,
  // Tag,
}

export enum ROUTES {
  HOME = "/home",
  LOGIN = "/login",
  LOGIN_1 = "/login/1",
  LOGIN_2 = "/login/2",
  LOGIN_ONBOARDING = "/login/onboard",
  GROUP = "/group",
  USER = "/user",

  PRVACY_POLICY = "/privacy-policy",
  TERMS_OF_SERVICE = "/terms-of-service",
}

export interface EventMap {
  initialized: (success: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export default class constant {
  static initialized = false;

  static isLive = Constants.appOwnership !== "expo";

  static log: Logger;

  static supabase: SupabaseClient<never>;

  static client: QueryClient;

  static locale: string;

  static service: ServiceLocator;

  static options = {
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };

  static assetPaths = {
    // bundleDirectory is 'asset://'
    I18N: FileSystem.bundleDirectory + "/i18n",
  };
}

if (!constant.isLive) {
  // replace superbase url with correct local url during dev
  if (constant.options.SUPABASE_URL.startsWith(":")) {
    const expHost = Constants.experienceUrl.replace("exp://", "").split(":")[0];
    constant.options.SUPABASE_URL = "http://" + expHost + constant.options.SUPABASE_URL;
  }
}

global.constantEmitter = global.constantEmitter || new EventEmitter();
// eslint-disable-next-line prefer-destructuring
export const constantEmitter: EventEmitter<EventMap> = global.constantEmitter;
