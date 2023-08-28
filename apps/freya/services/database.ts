


import constant, { ServiceType } from '@app/constants';

import { Service } from './base';

export default class Database extends Service {

    constructor() {
        super(ServiceType.Database);

    }

    async init() {
    }
}
