import type { } from '@/services/user';
import { User as AuthUser } from '@supabase/supabase-js';

import StateBlock, { defineAtom } from './base';

export default class _UserState extends StateBlock {

  static user = defineAtom({
    default: null as AuthUser | null,
  });

  static loginState = defineAtom({
    default: {
      email: '',
    },
  });


}
