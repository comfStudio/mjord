import StateBlock, { defineAtom } from './base';

export default class _GroupState extends StateBlock {

  static currentGroupDetail = defineAtom({
    default: null,
  });


}
