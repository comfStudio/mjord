import { Call, Fn, Identity, Match, Objects, Pipe, Strings, Tuples, Unions } from "hotscript";

import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

import { Database } from "./db.gen.ts";

export * from "./db.gen.ts";

export type SchemaName = "public";

export type Tables = keyof Database[SchemaName]["Tables"];
export type Enums<T extends keyof Database[SchemaName]["Enums"]> = Database[SchemaName]["Enums"][T];
export type Row<T extends Tables> = TypeidAsString<Database[SchemaName]["Tables"][T]["Row"]>;

export type InsertDto<T extends Tables> = Database[SchemaName]["Tables"][T]["Insert"];
export type UpdateDto<T extends Tables> = Database[SchemaName]["Tables"][T]["Update"];

export type FilterQuery<T extends Tables> = PostgrestFilterBuilder<
  Database[SchemaName],
  Database[SchemaName]["Tables"][T]["Row"],
  unknown,
  Database[SchemaName]["Tables"][T]["Row"] extends { Relationships: infer R } ? R : unknown
>;

export type TypeidAsString<T> = Pipe<
  T,
  [
    Objects.MapValues<
      Match<
        [
          Match.With<{ type: string; uuid: string }, string>,
          Match.With<{ type: string; uuid: string } | null, string | null>,
          Match.With<any, Identity>,
        ]
      >
    >,
  ]
>;

interface OptionalMixin extends Fn {
  return: [this["arg0"], Call<Strings.Append<"?">, this["arg0"]>];
}

type MixinParam<E extends string = ""> =
  | Pipe<["media"], [Tuples.ToUnion, Unions.Exclude<E>, Unions.ToTuple, Tuples.FlatMap<OptionalMixin>, Tuples.ToUnion]>
  | "";

type ForeignCountMixin = [{ count: number }];
type MediaMixin = { [key: string]: MediaData };

type MixinData<T, U extends MixinParam = ""> = Pipe<
  U,
  [
    Unions.Map<
      Match<
        [Match.With<"media", Call<Objects.Values, [MediaMixin]>>, Match.With<"media?", MediaMixin>, Match.With<any, {}>]
      >
    >,
    Unions.ToTuple,
    Tuples.Append<T>,
    Tuples.ToIntersection,
  ]
>;

type MixinRow<T extends Tables, M extends MixinParam = "", P extends keyof Row<T> | undefined = undefined> = MixinData<
  P extends keyof Row<T> ? Pick<Row<T>, P> : Row<T>,
  M
>;

export type ProfileData<M extends MixinParam<"profile"> = ""> = MixinRow<"profile", M>;
export type GroupData<M extends MixinParam<"group"> = ""> = MixinRow<"group", M> & {
  members: ForeignCountMixin;
};
export type MediaData<M extends MixinParam<"media"> = ""> = MixinRow<
  "media",
  M,
  "id" | "thumbnail_url" | "type" | "url"
>;
export type EventData<M extends MixinParam<"event"> = ""> = MixinRow<"event", M>;
export type GroupMemberData<M extends MixinParam<"group_members"> = ""> = MixinRow<"group_members", M>;
