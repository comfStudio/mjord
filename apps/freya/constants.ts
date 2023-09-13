
import type { Logger } from '@mjord/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { QueryClient } from '@tanstack/react-query';

import type { ServiceLocator } from '@/services/base';

export enum ServiceType {
  Database,
  Function,
  User,
  Group,
  Event,
  // Character,
  // Template,
  // Tag,
}


export enum ROUTES {
    HOME = '/home',
    LOGIN = '/login',
    LOGIN_1 = '/login/1',
    LOGIN_2 = '/login/2',
    LOGIN_ONBOARDING = '/login/onboard',
    GROUP = '/group',
    USER = '/user',

    PRVACY_POLICY = '/privacy-policy',
    TERMS_OF_SERVICE = '/terms-of-service',
}


// eslint-disable-next-line @typescript-eslint/naming-convention
export class Constant {
    static initialized = false;

    static log: Logger;

    static supabase: SupabaseClient<never>

    static client: QueryClient

    static locale: string

    static service: ServiceLocator;

    //   static storage: LocalForage;

    static options = {
        SUPABASE_URL: process.env.SUPABASE_URL ?? '',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
    };
}


global.constant = global.constant || Constant;
// eslint-disable-next-line prefer-destructuring
const constant: typeof Constant = global.constant;

export default constant;

// ---------------------------------------------------------------------
