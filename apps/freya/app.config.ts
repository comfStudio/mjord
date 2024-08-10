import { ConfigContext, ExpoConfig } from 'expo/config';

import * as pkgJson from './package.json';

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.isplasher.mjord.dev";
  }

  if (IS_PREVIEW) {
    return "com.isplasher.mjord.preview";
  }

  return "com.isplasher.mjord";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Hygg (Dev)";
  }

  if (IS_PREVIEW) {
    return "Hygg (Preview)";
  }

  return "Hygg: Social App";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: getAppName(),
  version: pkgJson.version || "1.0.0",
  slug: "mjord",
  scheme: "mjord",
  orientation: "portrait",
  icon: "./assets/icon.png",
  sdkVersion: "51.0.0",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    bundleIdentifier: getUniqueIdentifier(),
    supportsTablet: true,
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: getUniqueIdentifier(),
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: ["expo-build-properties", "expo-localization", "expo-router", "expo-secure-store"],

  // All values in extra will be passed to your app.
  extra: {
    fact: "kittens are cool",
    updates: {
      assetPatternsToBeBundled: ["assets/**/*"],
    },
  },
});
