import constant, { ServiceType } from '@app/constants';
import { EventData } from "@mjord/edge/db";
import { useQuery } from '@tanstack/react-query';

import { Service, ServiceLocator } from "./base";

export type EventWithtExtraData = EventData & {
    members: {
        count: number;
    };
}

export default class Event extends Service {

    constructor() {
        super(ServiceType.Event);

    }

    async init(locator: ServiceLocator) {
    }

    async getFeaturedEvents(groupId: number) {
        // date for beginning of today in UTC
        const dateToday = new Date(new Date().setUTCHours(0, 0, 0, 0));

        const { data: futureData, error } = await constant.supabase
            .from("events")
            .select(`
                members:event_members (count),
                *
            `)
            .eq('group_id', groupId)
            .gte('start_time', dateToday.toISOString()).order('start_time', { ascending: true }).limit(10);

        if (error) {
            throw error;
        }

        const { data: pastData } = await constant.supabase
            .from("events")
            .select(`
                members:event_members (count),
                *
            `)
            .eq('group_id', groupId)
            .lte('start_time', dateToday.toISOString()).order('start_time', { ascending: false }).limit(10);




        return {
            future: futureData.map(d => ({ ...d, members: d?.members?.[0] ?? { count: 0 } })) as EventWithtExtraData[],
            past: pastData.map(d => ({ ...d, members: d?.members?.[0] ?? { count: 0 } })) as EventWithtExtraData[]
        }
    }


}

export function useFeaturedEvents(groupId: number) {
    const service = constant.service.get(ServiceType.Event);

    const q = useQuery(
        ['featuredEvents', groupId],
        async () => {
            const data = await service.getFeaturedEvents(groupId);
            return data;
        }
    );
    return q
}
