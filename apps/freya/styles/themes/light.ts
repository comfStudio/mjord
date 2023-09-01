import { Colors } from "../colors";
import { reduce } from "../utils";

import type { CustomTheme, Theme } from "../theme";
export default function lightTheme(): CustomTheme {
  const colors = reduce<Colors>(
    {
      /*---  Colors  ---*/
      red: "#FFEDEC",
      orange: "#FFF1EA",
      yellow: "#FFF9E4",
      olive: "",
      green: "#E3F7F2",
      teal: "",
      blue: "#007AFF",
      violet: "#F0EEFF",
      purple: "#faebfd",
      pink: "",
      brown: "",
      grey: "#F8f9FA",
      black: "#000000",
      white: "#FFFFFF",

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
      /*---   Neutrals  ---*/
      fullBlack: "#000000",
      offWhite: "#F9FAFB",
      darkWhite: "#F3F4F5",
      midWhite: "#DCDDDE",
    }),

    (v) => ({
      primary: v.blue,
      secondary: v.black,
      primaryAlternate: v.white,
      secondaryAlternate: v.white,

      lightPrimary: v.lightBlue,
      lightSecondary: v.lightBlack,
      text: v.black,
      pageBackground: v.white,
    }),

    (v) => ({
      primaryBackground: v.pageBackground,
      secondaryBackground: "#ecebeb",
      tertiaryBackground: "#f4f4f4",
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
      redText: v.red,
      orangeText: v.orange,
      yellowText: "#B58105", // Yellow text is difficult to read
      oliveText: v.olive, // Olive is difficult to read
      greenText: "#1EBC30", // Green is difficult to read
      tealText: v.teal, // Teal text is difficult to read
      blueText: v.blue,
      violetText: v.violet,
      purpleText: v.purple,
      pinkText: v.pink,
      brownText: v.brown,
    }),
    (v) => ({
      /*--- Colored Border ---*/
      redBorder: v.redText,
      orangeBorder: v.orangeText,
      yellowBorder: v.yellowText,
      oliveBorder: v.oliveText,
      greenBorder: v.greenText,
      tealBorder: v.tealText,
      blueBorder: v.blueText,
      violetBorder: v.violetText,
      purpleBorder: v.purpleText,
      pinkBorder: v.pinkText,
      brownBorder: v.brownText,
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
      positive: v.green,
      positiveBackground: "#FCFFF5",
      positiveBorder: "#A3C293",
      positiveHeader: "#1A531B",
      positiveText: "#2C662D",

      /* Negative */
      negative: v.red,
      negativeBackground: "#FFF6F6",
      negativeBorder: "#E0B4B4",
      negativeHeader: "#912D2B",
      negativeText: "#9F3A38",

      /* Info */
      info: "#31CCEC",
      infoBackground: "#F8FFFF",
      infoBorder: "#A9D5DE",
      infoHeader: "#0E566C",
      infoText: "#276F86",

      /* Warning */
      warning: "#F2C037",
      warningBorder: "#C9BA9B",
      warningBackground: "#FFFAF3",
      warningHeader: "#794B02",
      warningText: "#573A08",
    }),

    (v) => ({
      /*-------------------
     Neutral Text
--------------------*/

      darkText: "rgba(0, 0, 0, 0.85)",
      mutedText: "rgba(0, 0, 0, 0.6)",
      lightText: "rgba(0, 0, 0, 0.4)",

      unselectedText: "rgba(0, 0, 0, 0.4)",
      hoveredText: "rgba(0, 0, 0, 0.8)",
      pressedText: "rgba(0, 0, 0, 0.9)",
      selectedText: "rgba(0, 0, 0, 0.95)",
      disabledText: "rgba(0, 0, 0, 0.2)",

      invertedText: "rgba(255, 255, 255, 0.9)",
      invertedMutedText: "rgba(255, 255, 255, 0.8)",
      invertedLightText: "rgba(255, 255, 255, 0.7)",
      invertedUnselectedText: "rgba(255, 255, 255, 0.5)",
      invertedHoveredText: "rgba(255, 255, 255, 1)",
      invertedPressedText: "rgba(255, 255, 255, 1)",
      invertedSelectedText: "rgba(255, 255, 255, 1)",
      invertedDisabledText: "rgba(255, 255, 255, 0.2)",
    }),

    (v) => ({
      /* Positive / Negative Dupes */
      successBackground: v.positiveBackground,
      success: v.positive,
      successBorder: v.positiveBorder,
      successHeader: v.positiveHeader,
      successText: v.positiveText,

      errorBackground: v.negativeBackground,
      error: v.negative,
      errorBorder: v.negativeBorder,
      errorHeader: v.negativeHeader,
      errorText: v.negativeText,
    }),

    (v) => ({
      /* This adjusts the default form input across all elements */
      inputBackground: v.white,

      /* Input Text Color */
      input: v.text,
      inputPlaceholder: v.text,
      inputPlaceholderFocus: v.text,

      /* Used on inputs, textarea etc */
      focusedFormBorder: "#85B7D9",

      /* Used on dropdowns, other larger blocks */
      focusedFormMutedBorder: "#96C8DA",
    })
  );

  return {
    colors,
    spacing: {},
    typography: {},
  };
}
