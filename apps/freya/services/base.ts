import constant, { ServiceType } from "@app/constants";
import { GenericError } from "@mjord/common";

import type DatabaseService from "./database";
import type GroupService from "./group";
import type EventService from "./event";
import type UserService from "./user";
import type FunctionService from "./function";
export class Service {
  type: ServiceType;

  constructor(type: ServiceType) {
    this.type = type;
  }

  async init(locator: ServiceLocator) {}
}

type ServiceTypeMap = {
  [ServiceType.Database]: DatabaseService;
  [ServiceType.Group]: GroupService;
  [ServiceType.Event]: EventService;
  [ServiceType.User]: UserService;
  [ServiceType.Function]: FunctionService;
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
      throw new GenericError("No service of type", type, "found");
    }

    return instance as ServiceTypeMap[T];
  }

  async init() {
    for (const service of Object.values(this._instances)) {
      constant.log.i(`Initializing service ${ServiceType[service.type]}`);
      await service.init(this);
    }
    return this;
  }
}
