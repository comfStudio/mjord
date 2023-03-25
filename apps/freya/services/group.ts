import { useQuery } from '@tanstack/react-query';

import constant, { ServiceType } from '../constants';
import { Service, ServiceLocator } from './base';
import { GroupData, MediaData } from './types';

export type GroupWithMediaData = Pick<GroupData, 'id' | 'description' | 'name' | 'visibility'> & {
    primary_media: Pick<MediaData, 'url' | 'media_type'> | null;
}

export default class Group extends Service {

    constructor() {
        super(ServiceType.Group);

    }

    async init(locator: ServiceLocator) {
    }

    async getFeaturedGroups() {
        const { data, error } = await constant.supabase
            .from("groups")
            .select(`
                id,
                name,
                primary_media:primary_media_id (
                    media_type,
                    url
                )
            `).limit(10);

        if (error) {
            throw error;
        }
        return data as GroupWithMediaData[];
    }

}

export function useFeaturedGroups() {
    const service = constant.service.get(ServiceType.Group);

    const q = useQuery(
        ['featuredGroups'],
        async () => {
            const groups = await service.getFeaturedGroups();
            return groups;
        }
    );
    return q
}