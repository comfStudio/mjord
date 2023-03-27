export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      comment_reactions: {
        Row: {
          comment_id: number
          created_at: string
          id: number
          profile_id: string
          reaction: string
        }
        Insert: {
          comment_id: number
          created_at?: string
          id?: number
          profile_id: string
          reaction: string
        }
        Update: {
          comment_id?: number
          created_at?: string
          id?: number
          profile_id?: string
          reaction?: string
        }
      }
      discussion_comments: {
        Row: {
          content: string
          created_at: string
          discussion_id: number
          id: number
          profile_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          discussion_id: number
          id?: number
          profile_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          discussion_id?: number
          id?: number
          profile_id?: string
          updated_at?: string
        }
      }
      discussion_media: {
        Row: {
          discussion_id: number
          id: number
          media_id: number
        }
        Insert: {
          discussion_id: number
          id?: number
          media_id: number
        }
        Update: {
          discussion_id?: number
          id?: number
          media_id?: number
        }
      }
      discussion_reactions: {
        Row: {
          created_at: string
          discussion_id: number
          id: number
          profile_id: string
          reaction: string
        }
        Insert: {
          created_at?: string
          discussion_id: number
          id?: number
          profile_id: string
          reaction: string
        }
        Update: {
          created_at?: string
          discussion_id?: number
          id?: number
          profile_id?: string
          reaction?: string
        }
      }
      discussion_tags: {
        Row: {
          discussion_id: number
          tag_id: number
        }
        Insert: {
          discussion_id: number
          tag_id: number
        }
        Update: {
          discussion_id?: number
          tag_id?: number
        }
      }
      event_members: {
        Row: {
          event_id: number
          joined_at: string
          profile_id: string
        }
        Insert: {
          event_id: number
          joined_at?: string
          profile_id: string
        }
        Update: {
          event_id?: number
          joined_at?: string
          profile_id?: string
        }
      }
      events: {
        Row: {
          address: string
          created_at: string
          description: string
          end_time: string | null
          group_id: number
          id: number
          latitude: number
          location_name: string
          longitude: number
          start_time: string
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_type"]
        }
        Insert: {
          address?: string
          created_at?: string
          description?: string
          end_time?: string | null
          group_id: number
          id?: number
          latitude?: number
          location_name?: string
          longitude?: number
          start_time: string
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
        }
        Update: {
          address?: string
          created_at?: string
          description?: string
          end_time?: string | null
          group_id?: number
          id?: number
          latitude?: number
          location_name?: string
          longitude?: number
          start_time?: string
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
        }
      }
      group_discussions: {
        Row: {
          content: string
          created_at: string
          event_id: number | null
          group_id: number
          id: number
          profile_id: string
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_type"]
        }
        Insert: {
          content: string
          created_at?: string
          event_id?: number | null
          group_id: number
          id?: number
          profile_id: string
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
        }
        Update: {
          content?: string
          created_at?: string
          event_id?: number | null
          group_id?: number
          id?: number
          profile_id?: string
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
        }
      }
      group_media: {
        Row: {
          group_id: number
          id: number
          media_id: number
        }
        Insert: {
          group_id: number
          id?: number
          media_id: number
        }
        Update: {
          group_id?: number
          id?: number
          media_id?: number
        }
      }
      group_members: {
        Row: {
          group_id: number
          joined_at: string
          profile_id: string
          role: Database["public"]["Enums"]["member_role"]
        }
        Insert: {
          group_id: number
          joined_at?: string
          profile_id: string
          role?: Database["public"]["Enums"]["member_role"]
        }
        Update: {
          group_id?: number
          joined_at?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["member_role"]
        }
      }
      group_tags: {
        Row: {
          group_id: number
          tag_id: number
        }
        Insert: {
          group_id: number
          tag_id: number
        }
        Update: {
          group_id?: number
          tag_id?: number
        }
      }
      groups: {
        Row: {
          address: string
          created_at: string
          description: string
          id: number
          latitude: number
          location_name: string
          longitude: number
          primary_media_id: number | null
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_type"]
        }
        Insert: {
          address?: string
          created_at?: string
          description?: string
          id?: number
          latitude?: number
          location_name?: string
          longitude?: number
          primary_media_id?: number | null
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
        }
        Update: {
          address?: string
          created_at?: string
          description?: string
          id?: number
          latitude?: number
          location_name?: string
          longitude?: number
          primary_media_id?: number | null
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
        }
      }
      media: {
        Row: {
          created_at: string
          id: number
          media_type: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          media_type: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          media_type?: Database["public"]["Enums"]["media_type"]
          url?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          primary_media_id: number | null
        }
        Insert: {
          id: string
          name?: string
          primary_media_id?: number | null
        }
        Update: {
          id?: string
          name?: string
          primary_media_id?: number | null
        }
      }
      tags: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      media_type: "image" | "video"
      member_role: "member" | "admin" | "moderator"
      visibility_type: "public" | "private" | "hidden"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

