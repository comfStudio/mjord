import { Colors } from "../colors";
import { reduce } from "../utils";

import type { Theme } from "../theme";
export default function lightTheme(): Theme {
  const colors = reduce<Colors>(
    {
      /*---  Colors  ---*/
      red: "#FFEDEC",
      orange: "#FFF1EA",
      yellow: "#FFF9E4",
      olive: "",
      green: "#E3F7F2",
      teal: "",
      blue: "#E9F3FF",
      violet: "#F0EEFF",
      purple: "#faebfd",
      pink: "",
      brown: "",
      grey: "#F8f9FA",
      black: "#000000",

      /*---  Light Colors  ---*/
      lightRed: "#FF695E",
      lightOrange: "#FF851B",
      lightYellow: "#FFE21F",
      lightOlive: "#D9E778",
      lightGreen: "#2ECC40",
      lightTeal: "#6DFFFF",
      lightBlue: "#54C8FF",
      lightViolet: "#A291FB",
      lightPurple: "#DC73FF",
      lightPink: "#FF8EDF",
      lightBrown: "#D67C1C",
      lightGrey: "#DCDDDE",
      lightBlack: "#545454",
    },

    (v) => ({
      primaryColor: v.blue,
      secondaryColor: v.black,

      lightPrimaryColor: v.lightBlue,
      lightSecondaryColor: v.lightBlack,
    }),

    (v) => ({
      /*---   Neutrals  ---*/
      fullBlack: "#000000",
      offWhite: "#F9FAFB",
      darkWhite: "#F3F4F5",
      midWhite: "#DCDDDE",
      white: "#FFFFFF",
    }),

    (v) => ({
      /*--- Colored Backgrounds ---*/
      redBackground: "#FFE8E6",
      orangeBackground: "#FFEDDE",
      yellowBackground: "#FFF8DB",
      oliveBackground: "#FBFDEF",
      greenBackground: "#E5F9E7",
      tealBackground: "#E1F7F7",
      blueBackground: "#DFF0FF",
      violetBackground: "#EAE7FF",
      purpleBackground: "#F6E7FF",
      pinkBackground: "#FFE3FB",
      brownBackground: "#F1E2D3",
    }),

    /*--- Colored Text ---*/
    (v) => ({
      redTextColor: v.red,
      orangeTextColor: v.orange,
      yellowTextColor: "#B58105", // Yellow text is difficult to read
      oliveTextColor: v.olive, // Olive is difficult to read
      greenTextColor: "#1EBC30", // Green is difficult to read
      tealTextColor: v.teal, // Teal text is difficult to read
      blueTextColor: v.blue,
      violetTextColor: v.violet,
      purpleTextColor: v.purple,
      pinkTextColor: v.pink,
      brownTextColor: v.brown,
    }),

    (v) => ({
      /*--- Colored Backgrounds ---*/
      redBackground: "#FFE8E6",
      orangeBackground: "#FFEDDE",
      yellowBackground: "#FFF8DB",
      oliveBackground: "#FBFDEF",
      greenBackground: "#E5F9E7",
      tealBackground: "#E1F7F7",
      blueBackground: "#DFF0FF",
      violetBackground: "#EAE7FF",
      purpleBackground: "#F6E7FF",
      pinkBackground: "#FFE3FB",
      brownBackground: "#F1E2D3",
    }),

    (v) => ({
      /*--- Colored Border ---*/
      redBorderColor: v.redTextColor,
      orangeBorderColor: v.orangeTextColor,
      yellowBorderColor: v.yellowTextColor,
      oliveBorderColor: v.oliveTextColor,
      greenBorderColor: v.greenTextColor,
      tealBorderColor: v.tealTextColor,
      blueBorderColor: v.blueTextColor,
      violetBorderColor: v.violetTextColor,
      purpleBorderColor: v.purpleTextColor,
      pinkBorderColor: v.pinkTextColor,
      brownBorderColor: v.brownTextColor,
    }),

    (v) => ({
      /*-------------------
     Alpha Colors
--------------------*/

      subtleTransparentBlack: "rgba(0, 0, 0, 0.03)",
      transparentBlack: "rgba(0, 0, 0, 0.05)",
      strongTransparentBlack: "rgba(0, 0, 0, 0.10)",
      veryStrongTransparentBlack: "rgba(0, 0, 0, 0.15)",

      subtleTransparentWhite: "rgba(255, 255, 255, 0.02)",
      transparentWhite: "rgba(255, 255, 255, 0.08)",
      strongTransparentWhite: "rgba(255, 255, 255, 0.15)",
    }),

    (v) => ({
      /* Positive */
      positiveColor: v.green,
      positiveBackgroundColor: "#FCFFF5",
      positiveBorderColor: "#A3C293",
      positiveHeaderColor: "#1A531B",
      positiveTextColor: "#2C662D",

      /* Negative */
      negativeColor: v.red,
      negativeBackgroundColor: "#FFF6F6",
      negativeBorderColor: "#E0B4B4",
      negativeHeaderColor: "#912D2B",
      negativeTextColor: "#9F3A38",

      /* Info */
      infoColor: "#31CCEC",
      infoBackgroundColor: "#F8FFFF",
      infoBorderColor: "#A9D5DE",
      infoHeaderColor: "#0E566C",
      infoTextColor: "#276F86",

      /* Warning */
      warningColor: "#F2C037",
      warningBorderColor: "#C9BA9B",
      warningBackgroundColor: "#FFFAF3",
      warningHeaderColor: "#794B02",
      warningTextColor: "#573A08",
    }),

    (v) => ({
      /*-------------------
     Neutral Text
--------------------*/

      darkTextColor: "rgba(0, 0, 0, 0.85)",
      mutedTextColor: "rgba(0, 0, 0, 0.6)",
      lightTextColor: "rgba(0, 0, 0, 0.4)",

      unselectedTextColor: "rgba(0, 0, 0, 0.4)",
      hoveredTextColor: "rgba(0, 0, 0, 0.8)",
      pressedTextColor: "rgba(0, 0, 0, 0.9)",
      selectedTextColor: "rgba(0, 0, 0, 0.95)",
      disabledTextColor: "rgba(0, 0, 0, 0.2)",

      invertedTextColor: "rgba(255, 255, 255, 0.9)",
      invertedMutedTextColor: "rgba(255, 255, 255, 0.8)",
      invertedLightTextColor: "rgba(255, 255, 255, 0.7)",
      invertedUnselectedTextColor: "rgba(255, 255, 255, 0.5)",
      invertedHoveredTextColor: "rgba(255, 255, 255, 1)",
      invertedPressedTextColor: "rgba(255, 255, 255, 1)",
      invertedSelectedTextColor: "rgba(255, 255, 255, 1)",
      invertedDisabledTextColor: "rgba(255, 255, 255, 0.2)",
    }),

    (v) => ({
      /* Positive / Negative Dupes */
      successBackgroundColor: v.positiveBackgroundColor,
      successColor: v.positiveColor,
      successBorderColor: v.positiveBorderColor,
      successHeaderColor: v.positiveHeaderColor,
      successTextColor: v.positiveTextColor,

      errorBackgroundColor: v.negativeBackgroundColor,
      errorColor: v.negativeColor,
      errorBorderColor: v.negativeBorderColor,
      errorHeaderColor: v.negativeHeaderColor,
      errorTextColor: v.negativeTextColor,
    }),

    (v) => ({
      /* This adjusts the default form input across all elements */
      inputBackground: v.white,

      /* Input Text Color */
      inputColor: v.textColor,
      inputPlaceholderColor: v.textColor,
      inputPlaceholderFocusColor: v.textColor,

      /* Used on inputs, textarea etc */
      focusedFormBorderColor: "#85B7D9",

      /* Used on dropdowns, other larger blocks */
      focusedFormMutedBorderColor: "#96C8DA",
    })
  );

  return {
    colors,
    spacing: {},
    typography: {},
  };
}
