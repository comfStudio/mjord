import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";

import constant from "@app/constants";

export function getNativePath(uri: string) {
  let u = uri;
  if (!constant.isLive) {
    const host = Constants.experienceUrl.replace("exp://", "http://");

    if (u.startsWith("asset:")) {
      const assPath = u.replace("asset:", "");
      u = `${host}/_devapi/assets?path=${encodeURIComponent(assPath)}`;
    }
  }

  console.log("getNativePath", { uri, u });

  constant.log.d("getNativePath", { uri, u });
  return u;
}

export function readDirectory(fileUri: string) {
  return FileSystem.readDirectoryAsync(getNativePath(fileUri));
}
export function getPathInfo(fileUri: string, options?: Parameters<typeof FileSystem.getInfoAsync>[1]) {
  return FileSystem.getInfoAsync(getNativePath(fileUri), options);
}
export function readFile(fileUri: string, options: Parameters<typeof FileSystem.readAsStringAsync>[1]) {
  return FileSystem.readAsStringAsync(getNativePath(fileUri), options);
}

export function getFilename(uri: string, { includeExtension = true } = {}) {
  const parts = uri.split("/");
  const filename = parts[parts.length - 1];

  if (!includeExtension) {
    return filename.split(".")[0];
  }

  return filename;
}

export const DIRECTORY = {
  BUNDLE: FileSystem.bundleDirectory,
  CACHE: FileSystem.cacheDirectory,
  DOCUMENT: FileSystem.documentDirectory,
};
