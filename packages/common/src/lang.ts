import { t as tt } from "ttag";

export { msgid, ngettext as pluralize, t, useLocale, addLocale } from "ttag";
export type { LocaleData } from "ttag";

const t = tt;
export default t;

// Example
// pluralize(msgid`${i} tick passed`, `${i} ticks passed`, i)
