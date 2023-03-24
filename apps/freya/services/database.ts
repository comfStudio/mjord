


import constant, { ServiceType } from '../constants';
import { Service } from './base';

export default class Database extends Service {

    constructor() {
        super(ServiceType.Database);

    }

    async init() {
    }
}
