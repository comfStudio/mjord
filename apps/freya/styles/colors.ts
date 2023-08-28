export type ColorValue = string;

export interface Colors {
  primaryColor: ColorValue;
  secondaryColor: ColorValue;

  lightPrimaryColor: ColorValue;
  lightSecondaryColor: ColorValue;

  pageBackground: ColorValue;
  textColor: ColorValue;

  /*-------------------
      Paragraph
--------------------*/

  paragraphMargin: ColorValue;
  paragraphLineHeight: ColorValue;

  /*-------------------
       Links
--------------------*/

  linkColor: ColorValue;
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
  redHeaderColor: ColorValue;
  oliveHeaderColor: ColorValue;
  greenHeaderColor: ColorValue;
  yellowHeaderColor: ColorValue;
  blueHeaderColor: ColorValue;
  tealHeaderColor: ColorValue;
  pinkHeaderColor: ColorValue;
  violetHeaderColor: ColorValue;
  purpleHeaderColor: ColorValue;
  orangeHeaderColor: ColorValue;
  brownHeaderColor: ColorValue;

  /*--- Colored Text ---*/
  redTextColor: ColorValue;
  orangeTextColor: ColorValue;
  yellowTextColor: ColorValue; // Yellow text is difficult to read
  oliveTextColor: ColorValue; // Olive is difficult to read
  greenTextColor: ColorValue; // Green is difficult to read
  tealTextColor: ColorValue; // Teal text is difficult to read
  blueTextColor: ColorValue;
  violetTextColor: ColorValue;
  purpleTextColor: ColorValue;
  pinkTextColor: ColorValue;
  brownTextColor: ColorValue;

  /*--- Colored Border ---*/
  redBorderColor: ColorValue;
  orangeBorderColor: ColorValue;
  yellowBorderColor: ColorValue;
  oliveBorderColor: ColorValue;
  greenBorderColor: ColorValue;
  tealBorderColor: ColorValue;
  blueBorderColor: ColorValue;
  violetBorderColor: ColorValue;
  purpleBorderColor: ColorValue;
  pinkBorderColor: ColorValue;
  brownBorderColor: ColorValue;

  /*-------------------
  Highlighted Text
--------------------*/

  highlightBackground: ColorValue;
  highlightColor: ColorValue;

  inputHighlightBackground: ColorValue;
  inputHighlightColor: ColorValue;

  /*--------------
   Form Input
---------------*/

  /* This adjusts the default form input across all elements */
  inputBackground: ColorValue;

  /* Input Text Color */
  inputColor: ColorValue;
  inputPlaceholderColor: ColorValue;
  inputPlaceholderFocusColor: ColorValue;

  /* Line Height Default For Inputs in Browser (Descenders are 17px at 14px base em) */
  inputLineHeight: ColorValue;

  /*-------------------
    Focused Input
--------------------*/

  /* Used on inputs, textarea etc */
  focusedFormBorderColor: ColorValue;

  /* Used on dropdowns, other larger blocks */
  focusedFormMutedBorderColor: ColorValue;

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
  positiveColor: ColorValue;
  positiveBackgroundColor: ColorValue;
  positiveBorderColor: ColorValue;
  positiveHeaderColor: ColorValue;
  positiveTextColor: ColorValue;

  /* Negative */
  negativeColor: ColorValue;
  negativeBackgroundColor: ColorValue;
  negativeBorderColor: ColorValue;
  negativeHeaderColor: ColorValue;
  negativeTextColor: ColorValue;

  /* Info */
  infoColor: ColorValue;
  infoBackgroundColor: ColorValue;
  infoBorderColor: ColorValue;
  infoHeaderColor: ColorValue;
  infoTextColor: ColorValue;

  /* Warning */
  warningColor: ColorValue;
  warningBorderColor: ColorValue;
  warningBackgroundColor: ColorValue;
  warningHeaderColor: ColorValue;
  warningTextColor: ColorValue;

  /*-------------------
     Neutral Text
--------------------*/

  darkTextColor: ColorValue;
  mutedTextColor: ColorValue;
  lightTextColor: ColorValue;

  unselectedTextColor: ColorValue;
  hoveredTextColor: ColorValue;
  pressedTextColor: ColorValue;
  selectedTextColor: ColorValue;
  disabledTextColor: ColorValue;

  invertedTextColor: ColorValue;
  invertedMutedTextColor: ColorValue;
  invertedLightTextColor: ColorValue;
  invertedUnselectedTextColor: ColorValue;
  invertedHoveredTextColor: ColorValue;
  invertedPressedTextColor: ColorValue;
  invertedSelectedTextColor: ColorValue;
  invertedDisabledTextColor: ColorValue;

  borderColor: ColorValue;
  strongBorderColor: ColorValue;
  internalBorderColor: ColorValue;
  selectedBorderColor: ColorValue;
  strongSelectedBorderColor: ColorValue;
  disabledBorderColor: ColorValue;

  solidInternalBorderColor: ColorValue;
  solidBorderColor: ColorValue;
  solidSelectedBorderColor: ColorValue;

  whiteBorderColor: ColorValue;
  selectedWhiteBorderColor: ColorValue;

  solidWhiteBorderColor: ColorValue;
  selectedSolidWhiteBorderColor: ColorValue;

  /* Positive / Negative Dupes */
  successBackgroundColor: ColorValue;
  successColor: ColorValue;
  successBorderColor: ColorValue;
  successHeaderColor: ColorValue;
  successTextColor: ColorValue;

  errorBackgroundColor: ColorValue;
  errorColor: ColorValue;
  errorBorderColor: ColorValue;
  errorHeaderColor: ColorValue;
  errorTextColor: ColorValue;

  /*******************************
             States
*******************************/

  /*-------------------
        Focus
--------------------*/

  primaryColorFocus: ColorValue;
  secondaryColorFocus: ColorValue;
  lightPrimaryColorFocus: ColorValue;
  lightSecondaryColorFocus: ColorValue;

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
  positiveColorFocus: ColorValue;
  negativeColorFocus: ColorValue;

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
  primaryColorDown: ColorValue;
  secondaryColorDown: ColorValue;
  lightPrimaryColorDown: ColorValue;
  lightSecondaryColorDown: ColorValue;

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
  positiveColorDown: ColorValue;
  negativeColorDown: ColorValue;

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
  primaryColorActive: ColorValue;
  secondaryColorActive: ColorValue;
  lightPrimaryColorActive: ColorValue;
  lightSecondaryColorActive: ColorValue;

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
  positiveColorActive: ColorValue;
  negativeColorActive: ColorValue;

  /*---  Dark Tones  ---*/
  fullBlackActive: ColorValue;
  blackActive: ColorValue;
  greyActive: ColorValue;

  /*---  Light Tones  ---*/
  whiteActive: ColorValue;
  offWhiteActive: ColorValue;
  darkWhiteActive: ColorValue;
}
