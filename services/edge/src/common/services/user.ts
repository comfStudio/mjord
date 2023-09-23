import { Client, getUserId } from "common/supabase";
import { ServiceType } from "constant";
import { ProfileWithMediaData } from "types/db";

import { Service } from "./base.ts";

export default class User extends Service {
  constructor() {
    super(ServiceType.User);
  }

  async init() {}

  async getProfile(client: Client) {
    const uid = await getUserId(client);

    const { data, error } = await client
      .from("profile")
      .select(
        `
        *,
        media:media_id (
          id,
          type,
          thumbnail_url,
          url
        )
    `
      )
      .eq("id", uid)
      .single();

    if (error) {
      throw error;
    }

    // @ts-expect-error: .
    return data as ProfileWithMediaData;
  }
}
