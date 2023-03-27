import { Database } from '@mjord/database-types';

export type ProfileData = Database['public']['Tables']['profiles']['Row']
export type GroupData = Database['public']['Tables']['groups']['Row']
export type MediaData = Database['public']['Tables']['media']['Row']
export type EventData = Database['public']['Tables']['events']['Row']
export type GroupMemberData = Database['public']['Tables']['group_members']['Row']

