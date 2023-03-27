import { useQuery } from '@tanstack/react-query';

import constant, { ServiceType } from '../constants';
import { Service, ServiceLocator } from './base';
import { GroupData, MediaData } from './types';

export type GroupWithtExtraData = GroupData & {
    primary_media: MediaData | null;
    member_count: {
        count: number;
    };
}

export type BasicGroupWithMediaData = Pick<GroupData, 'id' | 'description' | 'title' | 'visibility'> & {
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
                title,
                primary_media:primary_media_id (
                    media_type,
                    url
                )
            `).limit(10);

        if (error) {
            throw error;
        }
        return data as BasicGroupWithMediaData[];
    }

    async getGroup(id: number) {
        const { data, error } = await constant.supabase
            .from("groups")
            .select(`
                member_count:group_members (count),
                *,
                primary_media:primary_media_id (
                    media_type,
                    url
                )
            `).eq('id', id).single(
                {foreignTable: 'group_members'}
            );

        console.debug(data);
        if (error) {
            throw error;
        }
        return data as GroupWithtExtraData;
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

export function useGroup(id: number) {
    const service = constant.service.get(ServiceType.Group);

    const q = useQuery(
        ['group', id],
        async () => {
            const group = await service.getGroup(id);
            return group;
        }
    );
    return q
}