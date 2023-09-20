import { ServiceType } from "constant";

import type DatabaseService from "./database.ts";
import type UserService from "./user.ts";
import type GroupService from "./group.ts";
export class Service {
  type: ServiceType;
  // @ts-expect-error: .
  locator: ServiceLocator;

  constructor(type: ServiceType) {
    this.type = type;
  }

  async init(_locator: ServiceLocator) {}
}

type ServiceTypeMap = {
  [ServiceType.Database]: DatabaseService;
  [ServiceType.User]: UserService;
  [ServiceType.Group]: GroupService;
  // [ServiceType.Event]: EventService;
  // [ServiceType.Character]: CharacterService;
  // [ServiceType.Template]: TemplateService;
  // [ServiceType.Tag]: TagService;
};

export class ServiceLocator {
  private _instances: { [key in ServiceType]?: Service } = {};

  set<T extends Service>(instance: T) {
    this._instances[instance.type] = instance;
  }

  get<T extends ServiceType>(type: T) {
    const instance = this._instances[type];
    if (!instance) {
      throw new Deno.errors.NotFound(`No service of type ${type} found`);
    }

    return instance as ServiceTypeMap[T];
  }

  async init() {
    console.log("Initializing services");
    for (const service of Object.values(this._instances)) {
      console.log(`Initializing service ${ServiceType[service.type]}`);
      await service.init(this);
      service.locator = this;
    }
    return this;
  }
}
