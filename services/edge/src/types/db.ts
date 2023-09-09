import { Database } from "./db.gen.ts";

export * from "./db.gen.ts";

export type Tables = keyof Database["public"]["Tables"];
export type Row<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type ProfileData = Row<"profile">;
export type GroupData = Row<"group">;
export type MediaData = Row<"media">;
export type EventData = Row<"event">;
export type GroupMemberData = Row<"group_members">;
