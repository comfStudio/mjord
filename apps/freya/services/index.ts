import { ServiceLocator } from './base';
import DatabaseService from './database';
import GroupService from './group';

export default async function setupServices() {
    const locator = new ServiceLocator();
    locator.set(new DatabaseService());
    locator.set(new GroupService());

    await locator.init();

    return locator;
}
