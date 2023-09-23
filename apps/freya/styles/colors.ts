export type ColorValue = string;

export interface Colors {
  primary: ColorValue;
  secondary: ColorValue;
  primaryAlternate: ColorValue;
  secondaryAlternate: ColorValue;

  lightPrimary: ColorValue;
  lightSecondary: ColorValue;

  primaryBackground: ColorValue;
  secondaryBackground: ColorValue;
  tertiaryBackground: ColorValue;

  pageBackground: ColorValue;
  text: ColorValue;

  /*-------------------
      Paragraph
--------------------*/

  paragraphMargin: ColorValue;
  paragraphLineHeight: ColorValue;

  /*-------------------
       Links
--------------------*/

  link: ColorValue;
  linkUnderline: ColorValue;

  red: ColorValue;
  orange: ColorValue;
  yellow: ColorValue;
  olive: ColorValue;
  green: ColorValue;
  teal: ColorValue;
  blue: ColorValue;
  violet: ColorValue;
  purple: ColorValue;
  pink: ColorValue;
  brown: ColorValue;
  grey: ColorValue;
  black: ColorValue;

  /*---  Light Colors  ---*/
  lightRed: ColorValue;
  lightOrange: ColorValue;
  lightYellow: ColorValue;
  lightOlive: ColorValue;
  lightGreen: ColorValue;
  lightTeal: ColorValue;
  lightBlue: ColorValue;
  lightViolet: ColorValue;
  lightPurple: ColorValue;
  lightPink: ColorValue;
  lightBrown: ColorValue;
  lightGrey: ColorValue;
  lightBlack: ColorValue;

  /*---   Neutrals  ---*/
  fullBlack: ColorValue;
  offWhite: ColorValue;
  darkWhite: ColorValue;
  midWhite: ColorValue;
  white: ColorValue;

  /*--- Colored Backgrounds ---*/
  redBackground: ColorValue;
  orangeBackground: ColorValue;
  yellowBackground: ColorValue;
  oliveBackground: ColorValue;
  greenBackground: ColorValue;
  tealBackground: ColorValue;
  blueBackground: ColorValue;
  violetBackground: ColorValue;
  purpleBackground: ColorValue;
  pinkBackground: ColorValue;
  brownBackground: ColorValue;

  /*--- Colored Headers ---*/
  redHeader: ColorValue;
  oliveHeader: ColorValue;
  greenHeader: ColorValue;
  yellowHeader: ColorValue;
  blueHeader: ColorValue;
  tealHeader: ColorValue;
  pinkHeader: ColorValue;
  violetHeader: ColorValue;
  purpleHeader: ColorValue;
  orangeHeader: ColorValue;
  brownHeader: ColorValue;

  /*--- Colored Text ---*/
  redText: ColorValue;
  orangeText: ColorValue;
  yellowText: ColorValue; // Yellow text is difficult to read
  oliveText: ColorValue; // Olive is difficult to read
  greenText: ColorValue; // Green is difficult to read
  tealText: ColorValue; // Teal text is difficult to read
  blueText: ColorValue;
  violetText: ColorValue;
  purpleText: ColorValue;
  pinkText: ColorValue;
  brownText: ColorValue;

  /*--- Colored Border ---*/
  redBorder: ColorValue;
  orangeBorder: ColorValue;
  yellowBorder: ColorValue;
  oliveBorder: ColorValue;
  greenBorder: ColorValue;
  tealBorder: ColorValue;
  blueBorder: ColorValue;
  violetBorder: ColorValue;
  purpleBorder: ColorValue;
  pinkBorder: ColorValue;
  brownBorder: ColorValue;

  /*-------------------
  Highlighted Text
--------------------*/

  highlightBackground: ColorValue;
  highlight: ColorValue;

  inputHighlightBackground: ColorValue;
  inputHighlight: ColorValue;

  /*--------------
   Form Input
---------------*/

  /* This adjusts the default form input across all elements */
  inputBackground: ColorValue;

  /* Input Text Color */
  input: ColorValue;
  inputPlaceholder: ColorValue;
  inputPlaceholderFocus: ColorValue;

  /* Line Height Default For Inputs in Browser (Descenders are 17px at 14px base em) */
  inputLineHeight: ColorValue;

  /*-------------------
    Focused Input
--------------------*/

  /* Used on inputs, textarea etc */
  focusedFormBorder: ColorValue;

  /* Used on dropdowns, other larger blocks */
  focusedFormMutedBorder: ColorValue;

  /*-------------------
        Alpha Colors
    --------------------*/

  subtleTransparentBlack: ColorValue;
  transparentBlack: ColorValue;
  strongTransparentBlack: ColorValue;
  veryStrongTransparentBlack: ColorValue;

  subtleTransparentWhite: ColorValue;
  transparentWhite: ColorValue;
  strongTransparentWhite: ColorValue;

  /*-------------------
        Accents
    --------------------*/

  /* Differentiating Neutrals */
  subtleGradient: ColorValue;

  /* Differentiating Layers */
  subtleShadow: ColorValue;
  floatingShadow: ColorValue;

  /*******************************
             Power-User
    *******************************/

  /*-------------------
        Emotive Colors
    --------------------*/

  /* Positive */
  positive: ColorValue;
  positiveBackground: ColorValue;
  positiveBorder: ColorValue;
  positiveHeader: ColorValue;
  positiveText: ColorValue;

  /* Negative */
  negative: ColorValue;
  negativeBackground: ColorValue;
  negativeBorder: ColorValue;
  negativeHeader: ColorValue;
  negativeText: ColorValue;

  /* Info */
  info: ColorValue;
  infoBackground: ColorValue;
  infoBorder: ColorValue;
  infoHeader: ColorValue;
  infoText: ColorValue;

  /* Warning */
  warning: ColorValue;
  warningBorder: ColorValue;
  warningBackground: ColorValue;
  warningHeader: ColorValue;
  warningText: ColorValue;

  /*-------------------
     Neutral Text
--------------------*/

  darkText: ColorValue;
  mutedText: ColorValue;
  lightText: ColorValue;

  unselectedText: ColorValue;
  hoveredText: ColorValue;
  pressedText: ColorValue;
  selectedText: ColorValue;
  disabledText: ColorValue;

  invertedText: ColorValue;
  invertedMutedText: ColorValue;
  invertedLightText: ColorValue;
  invertedUnselectedText: ColorValue;
  invertedHoveredText: ColorValue;
  invertedPressedText: ColorValue;
  invertedSelectedText: ColorValue;
  invertedDisabledText: ColorValue;

  border: ColorValue;
  strongBorder: ColorValue;
  internalBorder: ColorValue;
  selectedBorder: ColorValue;
  strongSelectedBorder: ColorValue;
  disabledBorder: ColorValue;

  solidInternalBorder: ColorValue;
  solidBorder: ColorValue;
  solidSelectedBorder: ColorValue;

  whiteBorder: ColorValue;
  selectedWhiteBorder: ColorValue;

  solidWhiteBorder: ColorValue;
  selectedSolidWhiteBorder: ColorValue;

  /* Positive / Negative Dupes */
  successBackground: ColorValue;
  success: ColorValue;
  successBorder: ColorValue;
  successHeader: ColorValue;
  successText: ColorValue;

  errorBackground: ColorValue;
  error: ColorValue;
  errorBorder: ColorValue;
  errorHeader: ColorValue;
  errorText: ColorValue;

  /*******************************
             States
*******************************/

  /*-------------------
        Focus
--------------------*/

  primaryFocus: ColorValue;
  secondaryFocus: ColorValue;
  lightPrimaryFocus: ColorValue;
  lightSecondaryFocus: ColorValue;

  redFocus: ColorValue;
  orangeFocus: ColorValue;
  yellowFocus: ColorValue;
  oliveFocus: ColorValue;
  greenFocus: ColorValue;
  tealFocus: ColorValue;
  blueFocus: ColorValue;
  violetFocus: ColorValue;
  purpleFocus: ColorValue;
  pinkFocus: ColorValue;
  brownFocus: ColorValue;

  lightRedFocus: ColorValue;
  lightOrangeFocus: ColorValue;
  lightYellowFocus: ColorValue;
  lightOliveFocus: ColorValue;
  lightGreenFocus: ColorValue;
  lightTealFocus: ColorValue;
  lightBlueFocus: ColorValue;
  lightVioletFocus: ColorValue;
  lightPurpleFocus: ColorValue;
  lightPinkFocus: ColorValue;
  lightBrownFocus: ColorValue;
  lightGreyFocus: ColorValue;
  lightBlackFocus: ColorValue;

  /*---  Emotive  ---*/
  positiveFocus: ColorValue;
  negativeFocus: ColorValue;

  /*---  Dark Tones  ---*/
  fullBlackFocus: ColorValue;
  blackFocus: ColorValue;
  greyFocus: ColorValue;

  /*---  Light Tones  ---*/
  whiteFocus: ColorValue;
  offWhiteFocus: ColorValue;
  darkWhiteFocus: ColorValue;

  /*-------------------
    Down (:active)
--------------------*/

  /*---  Colors  ---*/
  primaryDown: ColorValue;
  secondaryDown: ColorValue;
  lightPrimaryDown: ColorValue;
  lightSecondaryDown: ColorValue;

  redDown: ColorValue;
  orangeDown: ColorValue;
  yellowDown: ColorValue;
  oliveDown: ColorValue;
  greenDown: ColorValue;
  tealDown: ColorValue;
  blueDown: ColorValue;
  violetDown: ColorValue;
  purpleDown: ColorValue;
  pinkDown: ColorValue;
  brownDown: ColorValue;

  lightRedDown: ColorValue;
  lightOrangeDown: ColorValue;
  lightYellowDown: ColorValue;
  lightOliveDown: ColorValue;
  lightGreenDown: ColorValue;
  lightTealDown: ColorValue;
  lightBlueDown: ColorValue;
  lightVioletDown: ColorValue;
  lightPurpleDown: ColorValue;
  lightPinkDown: ColorValue;
  lightBrownDown: ColorValue;
  lightGreyDown: ColorValue;
  lightBlackDown: ColorValue;

  /*---  Emotive  ---*/
  positiveDown: ColorValue;
  negativeDown: ColorValue;

  /*---  Dark Tones  ---*/
  fullBlackDown: ColorValue;
  blackDown: ColorValue;
  greyDown: ColorValue;

  /*---  Light Tones  ---*/
  whiteDown: ColorValue;
  offWhiteDown: ColorValue;
  darkWhiteDown: ColorValue;

  /*-------------------
        Active
--------------------*/

  /*---  Colors  ---*/
  primaryActive: ColorValue;
  secondaryActive: ColorValue;
  lightPrimaryActive: ColorValue;
  lightSecondaryActive: ColorValue;

  redActive: ColorValue;
  orangeActive: ColorValue;
  yellowActive: ColorValue;
  oliveActive: ColorValue;
  greenActive: ColorValue;
  tealActive: ColorValue;
  blueActive: ColorValue;
  violetActive: ColorValue;
  purpleActive: ColorValue;
  pinkActive: ColorValue;
  brownActive: ColorValue;

  lightRedActive: ColorValue;
  lightOrangeActive: ColorValue;
  lightYellowActive: ColorValue;
  lightOliveActive: ColorValue;
  lightGreenActive: ColorValue;
  lightTealActive: ColorValue;
  lightBlueActive: ColorValue;
  lightVioletActive: ColorValue;
  lightPurpleActive: ColorValue;
  lightPinkActive: ColorValue;
  lightBrownActive: ColorValue;
  lightGreyActive: ColorValue;
  lightBlackActive: ColorValue;

  /*---  Emotive  ---*/
  positiveActive: ColorValue;
  negativeActive: ColorValue;

  /*---  Dark Tones  ---*/
  fullBlackActive: ColorValue;
  blackActive: ColorValue;
  greyActive: ColorValue;

  /*---  Light Tones  ---*/
  whiteActive: ColorValue;
  offWhiteActive: ColorValue;
  darkWhiteActive: ColorValue;
}

export default function colors(): Colors {
  return {} as Colors;
}
