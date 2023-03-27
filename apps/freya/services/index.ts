import { ServiceLocator } from './base';
import DatabaseService from './database';
import EventService from './event';
import GroupService from './group';

export default async function setupServices() {
    const locator = new ServiceLocator();
    locator.set(new DatabaseService());
    locator.set(new GroupService());
    locator.set(new EventService());

    await locator.init();

    return locator;
}
