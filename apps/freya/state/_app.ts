import { getLocales } from 'expo-localization';

import StateBlock, { defineAtom } from './base';

const deviceLanguage = getLocales()[0].languageCode;
export const languages = ['en', 'da'];

export default class _AppState extends StateBlock {

  static isOnline = defineAtom({
    default: true,
  });

  static language = defineAtom({
    default: languages.includes(deviceLanguage) ? deviceLanguage : 'en'
  });
}
