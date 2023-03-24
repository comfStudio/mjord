import { ServiceType } from '../constants';
import { Service } from './base';

export interface GroupData {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}

export default class Group extends Service {

    constructor() {
        super(ServiceType.Group);

    }

    async init() {
    }

}