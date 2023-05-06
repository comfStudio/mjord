import type { } from '../services/user';
import StateBlock, { defineAtom } from './base';

export default class _UserState extends StateBlock {

  static loginState = defineAtom({
    default: {
      email: '',
    },
  });


}
