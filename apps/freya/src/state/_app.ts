import StateBlock, { defineAtom } from "./base";

import type { ThemeVariant } from "@app/styles/theme";

export default class _AppState extends StateBlock {
  static themeVariant = defineAtom({
    default: null as ThemeVariant | null,
  });

  static isOnline = defineAtom({
    default: true,
  });

  static language = defineAtom({
    default: "en",
  });
}
