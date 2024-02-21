import React, { useEffect, useState } from "react";

import { DIRECTORY, getPathInfo, readDirectory } from "@/misc/fs";
import constant from "@app/constants";

export function useCachedAssetFiles(dirPath: string = "", deps: React.DependencyList = []) {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    if (!Object.values(DIRECTORY).some((v) => v && dirPath.startsWith(v))) {
      if (dirPath && dirPath[0] !== "/") {
        dirPath = "/" + dirPath;
      }
    }

    const p = DIRECTORY.BUNDLE + dirPath;

    getPathInfo(p)
      .then(async (info) => {
        if (!info.exists) {
          constant.log.e("Directory not found", dirPath);
          return;
        }

        setFiles(await readDirectory(info.uri));
      })
      .catch((e) => constant.log.e("Error reading directory", dirPath, e));
  }, [...deps]);

  return files;
}
