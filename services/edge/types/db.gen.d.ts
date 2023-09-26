export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
export interface Database {
    public: {
        Tables: {
            comment: {
                Row: {
                    content: string;
                    created_at: string;
                    discussion_id: Database["public"]["CompositeTypes"]["typeid"];
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    profile_id: string | null;
                };
                Insert: {
                    content: string;
                    created_at?: string;
                    discussion_id: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id?: string | null;
                };
                Update: {
                    content?: string;
                    created_at?: string;
                    discussion_id?: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "comment_discussion_id_fkey";
                        columns: ["discussion_id"];
                        referencedRelation: "discussion";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "comment_profile_id_fkey";
                        columns: ["profile_id"];
                        referencedRelation: "profile";
                        referencedColumns: ["id"];
                    }
                ];
            };
            comment_tags: {
                Row: {
                    comment_id: Database["public"]["CompositeTypes"]["typeid"];
                    created_at: string;
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    tag_id: Database["public"]["CompositeTypes"]["typeid"];
                };
                Insert: {
                    comment_id: Database["public"]["CompositeTypes"]["typeid"];
                    created_at?: string;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    tag_id: Database["public"]["CompositeTypes"]["typeid"];
                };
                Update: {
                    comment_id?: Database["public"]["CompositeTypes"]["typeid"];
                    created_at?: string;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    tag_id?: Database["public"]["CompositeTypes"]["typeid"];
                };
                Relationships: [
                    {
                        foreignKeyName: "comment_tags_comment_id_fkey";
                        columns: ["comment_id"];
                        referencedRelation: "comment";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "comment_tags_tag_id_fkey";
                        columns: ["tag_id"];
                        referencedRelation: "tag";
                        referencedColumns: ["id"];
                    }
                ];
            };
            discussion: {
                Row: {
                    content: string;
                    created_at: string;
                    event_id: Database["public"]["CompositeTypes"]["typeid"] | null;
                    group_id: Database["public"]["CompositeTypes"]["typeid"];
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    profile_id: string | null;
                    title: string;
                    visibility: Database["public"]["Enums"]["visibility_type"];
                };
                Insert: {
                    content: string;
                    created_at?: string;
                    event_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    group_id: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id?: string | null;
                    title: string;
                    visibility?: Database["public"]["Enums"]["visibility_type"];
                };
                Update: {
                    content?: string;
                    created_at?: string;
                    event_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    group_id?: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id?: string | null;
                    title?: string;
                    visibility?: Database["public"]["Enums"]["visibility_type"];
                };
                Relationships: [
                    {
                        foreignKeyName: "discussion_event_id_fkey";
                        columns: ["event_id"];
                        referencedRelation: "event";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "discussion_group_id_fkey";
                        columns: ["group_id"];
                        referencedRelation: "group";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "discussion_profile_id_fkey";
                        columns: ["profile_id"];
                        referencedRelation: "profile";
                        referencedColumns: ["id"];
                    }
                ];
            };
            discussion_tags: {
                Row: {
                    created_at: string;
                    discussion_id: Database["public"]["CompositeTypes"]["typeid"];
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    tag_id: Database["public"]["CompositeTypes"]["typeid"];
                };
                Insert: {
                    created_at?: string;
                    discussion_id: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    tag_id: Database["public"]["CompositeTypes"]["typeid"];
                };
                Update: {
                    created_at?: string;
                    discussion_id?: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    tag_id?: Database["public"]["CompositeTypes"]["typeid"];
                };
                Relationships: [
                    {
                        foreignKeyName: "discussion_tags_discussion_id_fkey";
                        columns: ["discussion_id"];
                        referencedRelation: "discussion";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "discussion_tags_tag_id_fkey";
                        columns: ["tag_id"];
                        referencedRelation: "tag";
                        referencedColumns: ["id"];
                    }
                ];
            };
            event: {
                Row: {
                    content: string;
                    created_at: string;
                    end_time: string | null;
                    group_id: Database["public"]["CompositeTypes"]["typeid"];
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    start_time: string | null;
                    title: string;
                    visibility: Database["public"]["Enums"]["visibility_type"];
                };
                Insert: {
                    content?: string;
                    created_at?: string;
                    end_time?: string | null;
                    group_id: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    start_time?: string | null;
                    title: string;
                    visibility?: Database["public"]["Enums"]["visibility_type"];
                };
                Update: {
                    content?: string;
                    created_at?: string;
                    end_time?: string | null;
                    group_id?: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    start_time?: string | null;
                    title?: string;
                    visibility?: Database["public"]["Enums"]["visibility_type"];
                };
                Relationships: [
                    {
                        foreignKeyName: "event_group_id_fkey";
                        columns: ["group_id"];
                        referencedRelation: "group";
                        referencedColumns: ["id"];
                    }
                ];
            };
            event_members: {
                Row: {
                    created_at: string;
                    event_id: Database["public"]["CompositeTypes"]["typeid"];
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    profile_id: string;
                };
                Insert: {
                    created_at?: string;
                    event_id: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id: string;
                };
                Update: {
                    created_at?: string;
                    event_id?: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "event_members_event_id_fkey";
                        columns: ["event_id"];
                        referencedRelation: "event";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "event_members_profile_id_fkey";
                        columns: ["profile_id"];
                        referencedRelation: "profile";
                        referencedColumns: ["id"];
                    }
                ];
            };
            event_tags: {
                Row: {
                    created_at: string;
                    event_id: Database["public"]["CompositeTypes"]["typeid"];
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    tag_id: Database["public"]["CompositeTypes"]["typeid"];
                };
                Insert: {
                    created_at?: string;
                    event_id: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    tag_id: Database["public"]["CompositeTypes"]["typeid"];
                };
                Update: {
                    created_at?: string;
                    event_id?: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    tag_id?: Database["public"]["CompositeTypes"]["typeid"];
                };
                Relationships: [
                    {
                        foreignKeyName: "event_tags_event_id_fkey";
                        columns: ["event_id"];
                        referencedRelation: "event";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "event_tags_tag_id_fkey";
                        columns: ["tag_id"];
                        referencedRelation: "tag";
                        referencedColumns: ["id"];
                    }
                ];
            };
            group: {
                Row: {
                    content: string;
                    created_at: string;
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    media_id: Database["public"]["CompositeTypes"]["typeid"] | null;
                    modified_at: string;
                    title: string;
                    visibility: Database["public"]["Enums"]["visibility_type"];
                };
                Insert: {
                    content?: string;
                    created_at?: string;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    media_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    modified_at?: string;
                    title: string;
                    visibility?: Database["public"]["Enums"]["visibility_type"];
                };
                Update: {
                    content?: string;
                    created_at?: string;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    media_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    modified_at?: string;
                    title?: string;
                    visibility?: Database["public"]["Enums"]["visibility_type"];
                };
                Relationships: [
                    {
                        foreignKeyName: "group_media_id_fkey";
                        columns: ["media_id"];
                        referencedRelation: "media";
                        referencedColumns: ["id"];
                    }
                ];
            };
            group_members: {
                Row: {
                    created_at: string;
                    group_id: Database["public"]["CompositeTypes"]["typeid"];
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    profile_id: string;
                    role: Database["public"]["Enums"]["member_role"];
                };
                Insert: {
                    created_at?: string;
                    group_id: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id?: string;
                    role?: Database["public"]["Enums"]["member_role"];
                };
                Update: {
                    created_at?: string;
                    group_id?: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id?: string;
                    role?: Database["public"]["Enums"]["member_role"];
                };
                Relationships: [
                    {
                        foreignKeyName: "group_members_group_id_fkey";
                        columns: ["group_id"];
                        referencedRelation: "group";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "group_members_profile_id_fkey";
                        columns: ["profile_id"];
                        referencedRelation: "profile";
                        referencedColumns: ["id"];
                    }
                ];
            };
            group_tags: {
                Row: {
                    created_at: string;
                    group_id: Database["public"]["CompositeTypes"]["typeid"];
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    tag_id: Database["public"]["CompositeTypes"]["typeid"];
                };
                Insert: {
                    created_at?: string;
                    group_id: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    tag_id: Database["public"]["CompositeTypes"]["typeid"];
                };
                Update: {
                    created_at?: string;
                    group_id?: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    tag_id?: Database["public"]["CompositeTypes"]["typeid"];
                };
                Relationships: [
                    {
                        foreignKeyName: "group_tags_group_id_fkey";
                        columns: ["group_id"];
                        referencedRelation: "group";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "group_tags_tag_id_fkey";
                        columns: ["tag_id"];
                        referencedRelation: "tag";
                        referencedColumns: ["id"];
                    }
                ];
            };
            group_urls: {
                Row: {
                    created_at: string;
                    group_id: Database["public"]["CompositeTypes"]["typeid"];
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    url_id: Database["public"]["CompositeTypes"]["typeid"];
                };
                Insert: {
                    created_at?: string;
                    group_id: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    url_id: Database["public"]["CompositeTypes"]["typeid"];
                };
                Update: {
                    created_at?: string;
                    group_id?: Database["public"]["CompositeTypes"]["typeid"];
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    url_id?: Database["public"]["CompositeTypes"]["typeid"];
                };
                Relationships: [
                    {
                        foreignKeyName: "group_urls_group_id_fkey";
                        columns: ["group_id"];
                        referencedRelation: "group";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "group_urls_url_id_fkey";
                        columns: ["url_id"];
                        referencedRelation: "url";
                        referencedColumns: ["id"];
                    }
                ];
            };
            history: {
                Row: {
                    action: string;
                    created_at: string;
                    extra: Json;
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    profile_id: string | null;
                    row_id: string;
                    table_data: Json;
                    table_name: string;
                };
                Insert: {
                    action: string;
                    created_at?: string;
                    extra?: Json;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id?: string | null;
                    row_id: string;
                    table_data?: Json;
                    table_name: string;
                };
                Update: {
                    action?: string;
                    created_at?: string;
                    extra?: Json;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id?: string | null;
                    row_id?: string;
                    table_data?: Json;
                    table_name?: string;
                };
                Relationships: [];
            };
            location: {
                Row: {
                    address: string;
                    coords: unknown | null;
                    created_at: string;
                    event_id: Database["public"]["CompositeTypes"]["typeid"] | null;
                    group_id: Database["public"]["CompositeTypes"]["typeid"] | null;
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    name: string;
                };
                Insert: {
                    address?: string;
                    coords?: unknown | null;
                    created_at?: string;
                    event_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    group_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    name?: string;
                };
                Update: {
                    address?: string;
                    coords?: unknown | null;
                    created_at?: string;
                    event_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    group_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    name?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "location_event_id_fkey";
                        columns: ["event_id"];
                        referencedRelation: "event";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "location_group_id_fkey";
                        columns: ["group_id"];
                        referencedRelation: "group";
                        referencedColumns: ["id"];
                    }
                ];
            };
            media: {
                Row: {
                    comment_id: Database["public"]["CompositeTypes"]["typeid"] | null;
                    created_at: string;
                    discussion_id: Database["public"]["CompositeTypes"]["typeid"] | null;
                    event_id: Database["public"]["CompositeTypes"]["typeid"] | null;
                    group_id: Database["public"]["CompositeTypes"]["typeid"] | null;
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    thumbnail_url: string | null;
                    type: Database["public"]["Enums"]["media_type"];
                    url: string;
                };
                Insert: {
                    comment_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    created_at?: string;
                    discussion_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    event_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    group_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    thumbnail_url?: string | null;
                    type: Database["public"]["Enums"]["media_type"];
                    url: string;
                };
                Update: {
                    comment_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    created_at?: string;
                    discussion_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    event_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    group_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    thumbnail_url?: string | null;
                    type?: Database["public"]["Enums"]["media_type"];
                    url?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "media_comment_id_fkey";
                        columns: ["comment_id"];
                        referencedRelation: "comment";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "media_discussion_id_fkey";
                        columns: ["discussion_id"];
                        referencedRelation: "discussion";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "media_event_id_fkey";
                        columns: ["event_id"];
                        referencedRelation: "event";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "media_group_id_fkey";
                        columns: ["group_id"];
                        referencedRelation: "group";
                        referencedColumns: ["id"];
                    }
                ];
            };
            profile: {
                Row: {
                    created_at: string;
                    description: string;
                    extra: Json;
                    id: string;
                    media_id: Database["public"]["CompositeTypes"]["typeid"] | null;
                    modified_at: string;
                    name: string;
                    occupation: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string;
                    extra?: Json;
                    id: string;
                    media_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    modified_at?: string;
                    name?: string;
                    occupation?: string;
                };
                Update: {
                    created_at?: string;
                    description?: string;
                    extra?: Json;
                    id?: string;
                    media_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    modified_at?: string;
                    name?: string;
                    occupation?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "profile_id_fkey";
                        columns: ["id"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "profile_media_id_fkey";
                        columns: ["media_id"];
                        referencedRelation: "media";
                        referencedColumns: ["id"];
                    }
                ];
            };
            profile_tags: {
                Row: {
                    created_at: string;
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    profile_id: string;
                    tag_id: Database["public"]["CompositeTypes"]["typeid"];
                };
                Insert: {
                    created_at?: string;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id: string;
                    tag_id: Database["public"]["CompositeTypes"]["typeid"];
                };
                Update: {
                    created_at?: string;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id?: string;
                    tag_id?: Database["public"]["CompositeTypes"]["typeid"];
                };
                Relationships: [
                    {
                        foreignKeyName: "profile_tags_profile_id_fkey";
                        columns: ["profile_id"];
                        referencedRelation: "profile";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "profile_tags_tag_id_fkey";
                        columns: ["tag_id"];
                        referencedRelation: "tag";
                        referencedColumns: ["id"];
                    }
                ];
            };
            reaction: {
                Row: {
                    comment_id: Database["public"]["CompositeTypes"]["typeid"] | null;
                    created_at: string;
                    discussion_id: Database["public"]["CompositeTypes"]["typeid"] | null;
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    profile_id: string | null;
                    reaction: string;
                };
                Insert: {
                    comment_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    created_at?: string;
                    discussion_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id?: string | null;
                    reaction: string;
                };
                Update: {
                    comment_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    created_at?: string;
                    discussion_id?: Database["public"]["CompositeTypes"]["typeid"] | null;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    profile_id?: string | null;
                    reaction?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "reaction_comment_id_fkey";
                        columns: ["comment_id"];
                        referencedRelation: "comment";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reaction_discussion_id_fkey";
                        columns: ["discussion_id"];
                        referencedRelation: "discussion";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reaction_profile_id_fkey";
                        columns: ["profile_id"];
                        referencedRelation: "profile";
                        referencedColumns: ["id"];
                    }
                ];
            };
            tag: {
                Row: {
                    created_at: string;
                    extra: Json;
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    name: string;
                };
                Insert: {
                    created_at?: string;
                    extra?: Json;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    name: string;
                };
                Update: {
                    created_at?: string;
                    extra?: Json;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    name?: string;
                };
                Relationships: [];
            };
            url: {
                Row: {
                    created_at: string;
                    id: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at: string;
                    name: string;
                };
                Insert: {
                    created_at?: string;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    name: string;
                };
                Update: {
                    created_at?: string;
                    id?: Database["public"]["CompositeTypes"]["typeid"];
                    modified_at?: string;
                    name?: string;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            base32_decode: {
                Args: {
                    s: string;
                };
                Returns: string;
            };
            base32_encode: {
                Args: {
                    id: string;
                };
                Returns: string;
            };
            compare_type_id_equality: {
                Args: {
                    lhs_id: Database["public"]["CompositeTypes"]["typeid"];
                    rhs_id: string;
                };
                Returns: boolean;
            };
            typeid_check: {
                Args: {
                    tid: Database["public"]["CompositeTypes"]["typeid"];
                    expected_type: string;
                };
                Returns: boolean;
            };
            typeid_generate: {
                Args: {
                    prefix: string;
                };
                Returns: Database["public"]["CompositeTypes"]["typeid"];
            };
            typeid_parse: {
                Args: {
                    typeid_str: string;
                };
                Returns: Database["public"]["CompositeTypes"]["typeid"];
            };
            typeid_print: {
                Args: {
                    tid: Database["public"]["CompositeTypes"]["typeid"];
                };
                Returns: string;
            } | {
                Args: {
                    tid: string;
                };
                Returns: string;
            };
            uuid_generate_v7: {
                Args: Record<PropertyKey, never>;
                Returns: string;
            };
        };
        Enums: {
            media_type: "image" | "video";
            member_role: "owner" | "admin" | "moderator" | "member";
            visibility_type: "public" | "private" | "hidden";
        };
        CompositeTypes: {
            typeid: {
                type: string;
                uuid: string;
            };
        };
    };
}
//# sourceMappingURL=db.gen.d.ts.map