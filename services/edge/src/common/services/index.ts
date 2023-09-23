import { ServiceLocator } from "./base.ts";
import DatabaseService from "./database.ts";
import GroupService from "./group.ts";
import UserService from "./user.ts";

export default async function setupServices() {
  console.log("Setting up services");
  const locator = new ServiceLocator();
  locator.set(new DatabaseService());
  locator.set(new UserService());
  locator.set(new GroupService());
  // locator.set(new EventService());

  await locator.init();

  console.log("Finished setting up services");

  return locator;
}
