
import type { Logger } from '@mjord/logger';
import { Database } from '@mjord/database-types';
import { SupabaseClient } from '@supabase/supabase-js';
import { QueryClient } from '@tanstack/react-query';

import type { ServiceLocator } from './services/base';

export enum ServiceType {
    Database,
    Group,
    Event,
    // User,
    // Character,
    // Template,
    // Tag,
}

const isWorkerRuntime =
    typeof self !== 'undefined' &&
    self.postMessage &&
    !(
        typeof self !== 'undefined' &&
        typeof Window !== 'undefined' &&
        self instanceof Window
    );


// eslint-disable-next-line @typescript-eslint/naming-convention
export class Constant {
    static initialized = false;

    static log: Logger;

    static supabase: SupabaseClient<Database>

    static client: QueryClient

    static locale: string

    static service: ServiceLocator;

    //   static storage: LocalForage;

    static isWorkerRuntime = isWorkerRuntime;

    static options = {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    };
}


global.constant = global.constant || Constant;
// eslint-disable-next-line prefer-destructuring
const constant: typeof Constant = global.constant;

export default constant;

// ---------------------------------------------------------------------
