import { DataNotFound } from "common/error";
import { GroupFragments } from "common/fragments";
import { Client } from "common/supabase";
import { ServiceType } from "constant";
import { GroupData } from "types/db";

import { Service } from "./base.ts";

export default class Group extends Service {
  constructor() {
    super(ServiceType.Group);
  }

  async init() {
    return undefined;
  }

  async getFeaturedGroups(client: Client) {
    const { data, error } = await client.from("group").select(GroupFragments.group()).limit(10);

    if (error) {
      throw error;
    }

    // @ts-expect-error: .
    return data as GroupData<"media?">[];
  }

  async getGroup(client: Client, id: string) {
    const { data, error } = await client.rpc("get_group", { rowid: id });
    if (error) {
      throw error;
    }

    if (!data || !data.length) {
      console.error("getGroup", id, data);
      throw new DataNotFound();
    }

    return data[0] as GroupData<"media?">;
  }
}
