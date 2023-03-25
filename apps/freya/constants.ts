
import type { Logger } from '@mjord/logger';
import { Database } from '@mjord/database-types';
import { SupabaseClient } from '@supabase/supabase-js';
import { QueryClient } from '@tanstack/react-query';

import type { ServiceLocator } from './services/base';

export enum ServiceType {
    Database,
    Group,
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

    static service: ServiceLocator;

    //   static storage: LocalForage;

    static isWorkerRuntime = isWorkerRuntime;

    static options = {
        // BASEPATH: '',
        // STORAGE_DATABASE_NAME: 'noveller/state',
        // DATABASE_NAME: 'noveller/db',
        // SLIMSIDEBARWIDTH: 56,
        // SIDEBARWIDTH: 240,
        // BACKEND_ENDPOINT:
        //   (process.env.NEXT_PUBLIC_BACKEND_ENDPOINT as string) ?? '',
        // GRAPHQL_ENDPOINT:
        //   (process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string) ?? '',
        // WEBSOCKET_ENDPOINT:
        //   (process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT as string) ?? '',
        SUPABASE_URL: 'http://192.168.1.35:8484',
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE',
    };
}

global.constant = global.constant || Constant;
// eslint-disable-next-line prefer-destructuring
const constant: typeof Constant = global.constant;

export default constant;

// ---------------------------------------------------------------------
