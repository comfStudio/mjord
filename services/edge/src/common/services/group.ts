import { Client } from "common/supabase";
import { ServiceType } from "constant";
import { GroupWithMediaData } from "types/db";

import { Service } from "./base.ts";

export default class Group extends Service {
  constructor() {
    super(ServiceType.Group);
  }

  async init() {}

  async getFeaturedGroups(client: Client) {
    const { data, error } = await client
      .from("group")
      .select(
        `
                *,
                media!media_id (
                    id,
                    type,
                    thumbnail_url,
                    url
                )
            `
      )
      .limit(10);

    if (error) {
      throw error;
    }

    // @ts-expect-error: .
    return data as GroupWithMediaData[];
  }
}
