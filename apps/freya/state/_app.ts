import { getLocales } from 'expo-localization';

import StateBlock, { defineAtom } from './base';

import type { ThemeVariant } from '@app/styles/theme';

const deviceLanguage = getLocales()?.[0]?.languageCode ?? "en";
export const languages = ['en', 'da'];

export default class _AppState extends StateBlock {

  static themeVariant = defineAtom({
    default: null as ThemeVariant | null,
  });

  static isOnline = defineAtom({
    default: true,
  });

  static language = defineAtom({
    default: languages.includes(deviceLanguage) ? deviceLanguage : 'en'
  });
}
