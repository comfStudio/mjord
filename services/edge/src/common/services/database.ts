import { ServiceType } from "constant";

import { Service } from "./base.ts";

export default class Database extends Service {
  constructor() {
    super(ServiceType.Database);
  }

  async init() {}
}
