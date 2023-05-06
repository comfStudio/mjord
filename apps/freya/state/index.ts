import AppState from './_app';
import GroupState from './_group';
import UserState from './_user';
import StateBlock from './base';

export {
  getRecoilValue,
  setRecoilValue,
  getRecoilValuePromise,
  resetRecoilValue,
  RecoilSnapshotState,
} from './base';

let initialized = false;

export function setupState() {
  if (initialized) {
    return;
  }
  initialized = true;
  const cls = [AppState, GroupState, UserState]
  cls.forEach((c) => StateBlock.setup(c));
};

setupState();

export { AppState, GroupState, UserState };
export default {
  AppState,
  GroupState,
  UserState
}; 