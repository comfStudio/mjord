import constant, { ServiceType } from "@app/constants";
import { GroupData, GroupMemberData, MediaData, ProfileData } from "@mjord/edge/db";
import { useQuery } from "@tanstack/react-query";

import { Service, ServiceLocator } from "./base";
import { useFunction } from "./function";

export type GroupWithtExtraData = GroupData & {
  primary_media: MediaData | null;
  members: {
    count: number;
  };
};

export type GroupMemberWithProfileData = GroupMemberData & {
  profile: ProfileData;
};

export default class Group extends Service {
  constructor() {
    super(ServiceType.Group);
  }

  async init(locator: ServiceLocator) {}

  async getGroup(id: number) {
    const { data, error } = await constant.supabase
      .from("groups")
      .select(
        `
                members:group_members (count),
                *,
                primary_media:primary_media_id (

                    media_type,
                    url
                )
            `
      )
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }

    return {
      ...data,
      members: data?.members?.[0] ?? { count: 0 },
    } as GroupWithtExtraData;
  }

  async getGroupMembers(id: number, from: number = 0, to: number = 30) {
    const { data, error } = await constant.supabase
      .from("group_members")
      .select(
        `
                *,
                profile:profile_id(*)
            `
      )
      .eq("group_id", id)
      .range(from, to);
    if (error) {
      throw error;
    }
    return data as GroupMemberWithProfileData[];
  }
}

export function useFeaturedGroups() {
  const r = useFunction(
    "featured",
    {
      body: {
        type: "get",
        entity: "group",
      },
    },
    {
      throttle: {
        wait: 3000,
      },
    }
  );
  return r;
}

export function useGroup(id: number) {
  const service = constant.service.get(ServiceType.Group);

  const q = useQuery(["group", id], async () => {
    const group = await service.getGroup(id);
    return group;
  });
  return q;
}

export function useGroupMembers(id: number, from: number = 0, to: number = 30) {
  const service = constant.service.get(ServiceType.Group);

  const q = useQuery(["groupMembers", id], async () => {
    const members = await service.getGroupMembers(id, from, to);
    return members;
  });
  return q;
}
