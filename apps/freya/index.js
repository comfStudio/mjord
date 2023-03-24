import "expo-router/entry";

import setupServices from "./services";

import getLogger from "@mjord/logger";

import constant from "./constants";
// import { setupState } from './state';

async function main() {
  constant.log = getLogger();

  constant.log("initializing app");

  //   setupState();

  constant.service = await setupServices();

  constant.initialized = true;

  constant.log("initialized app");
}

main();
