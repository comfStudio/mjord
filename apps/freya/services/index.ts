import { ServiceLocator } from './base';
import DatabaseService from './database';
import EventService from './event';
import FunctionService from "./function";
import GroupService from './group';
import UserService from './user';

export default async function setupServices() {
    const locator = new ServiceLocator();
    locator.set(new FunctionService());
    locator.set(new DatabaseService());
    locator.set(new GroupService());
    locator.set(new EventService());
    locator.set(new UserService());

    await locator.init();

    return locator;
}
