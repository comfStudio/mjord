import { ExpoRequest, ExpoResponse } from "expo-router/server";
import { createReadStream } from "fs";
import fs from "fs/promises";

const HTTP_METHOD_NOT_ALLOWED = 405;
const HTTP_NOT_FOUND = 404;
const HTTP_SERVER_ERROR = 500;
const HTTP_BAD_REQUEST = 400;

const ASSETS_DIR = "./assets";

function parseUrl(req: ExpoRequest) {
  return req.expoUrl;
}

// Serve asset files in specific directories
export async function GET(req: ExpoRequest): Promise<ExpoResponse> {
  let resBody: NonNullable<ConstructorParameters<typeof ExpoResponse>[0]> = "";
  let resOptions: NonNullable<ConstructorParameters<typeof ExpoResponse>[1]> = {};

  // method not allowed
  if (req.method !== "GET" && req.method !== "HEAD") {
    resOptions = {
      ...resOptions,
      status: HTTP_METHOD_NOT_ALLOWED,
      headers: { Allow: "GET, HEAD", "Content-Length": "0" },
    };
    return new ExpoResponse(resBody, resOptions);
  }

  const originalUrl = parseUrl(req);
  const path = (originalUrl.searchParams.get("path") ?? "").trim();
  if (!path) {
    resOptions = { ...resOptions, status: HTTP_BAD_REQUEST, headers: { "Content-Length": "0" } };
    return new ExpoResponse(resBody, resOptions);
  }

  const filePath = path[0] === "/" ? `${ASSETS_DIR}${path}` : `${ASSETS_DIR}/${path}`;

  resBody = JSON.stringify({ originalUrl, filePath });

  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      throw Error("Not a file");
    }
    const contentLength = stats.size;
    const mimeType = "application/octet-stream";
    const stream = createReadStream(filePath);
    resOptions = {
      ...resOptions,
      status: 200,
      headers: { "Content-Length": contentLength.toString(), "Content-Type": mimeType },
    };
    resBody = stream;
  } catch (err) {
    if (err?.code === "ENOENT") {
      resOptions = { ...resOptions, status: HTTP_NOT_FOUND, headers: { "Content-Length": "0" } };
    } else {
      resOptions = { ...resOptions, status: HTTP_SERVER_ERROR, headers: { "Content-Length": "0" } };
    }
  }

  return new ExpoResponse(resBody, resOptions);
}
