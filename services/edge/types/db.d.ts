import { Database } from "./db.gen.ts";
export * from "./db.gen.ts";
export type Tables = keyof Database["public"]["Tables"];
export type Row<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type InsertDto<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type UpdateDto<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];
export type ProfileData = Row<"profile">;
export type GroupData = Row<"group">;
export type MediaData = Pick<Row<"media">, "id" | "thumbnail_url" | "type" | "url">;
export type EventData = Row<"event">;
export type GroupMemberData = Row<"group_members">;
interface MediaMixin {
  media: MediaData | null;
}
export interface ProfileWithMediaData extends ProfileData, MediaMixin {}
export interface GroupWithMediaData extends GroupData, MediaMixin {}
//# sourceMappingURL=db.d.ts.map
