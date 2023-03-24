
import type { Logger } from '@mjord/logger';
// import type { LocalUser } from './common/types';
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

    //   static user: LocalUser;

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
        // SUPABASE_URL: (process.env.NEXT_PUBLIC_SUPABASE_URL as string) ?? '',
        // SUPABASE_ANON_KEY:
        //   (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) ?? '',
    };
}

global.constant = global.constant || Constant;
// eslint-disable-next-line prefer-destructuring
const constant: typeof Constant = global.constant;

export default constant;

// ---------------------------------------------------------------------
