import StateBlock, { defineAtom } from './base';

export default class _AppState extends StateBlock {

  static user = defineAtom({
    default: null,
  });

  static isOnline = defineAtom({
    default: true,
  });

}
