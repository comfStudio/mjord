import { DimensionValue } from "react-native";

import { Spacing } from "./spacing";

export interface Sizing {
  image: {
    hero: {
      width: DimensionValue;
      height: DimensionValue;
    };
  };

  text: {
    heading: {
      h1: number;
      h2: number;
      h3: number;
      h4: number;
    };
    body: number;
    sm: number;
    md: number;
    lg: number;
  };
}

export default function sizing(spacing: Spacing): Sizing {
  return {
    image: {
      hero: {
        width: spacing.sized.full,
        height: spacing.size[48],
      },
    },

    text: {
      heading: {
        h1: spacing.size[6],
        h2: spacing.size[5],
        h3: spacing.size[4.5],
        h4: spacing.size[4],
      },
      body: spacing.size[4],

      sm: spacing.size[3.5],
      md: spacing.size[4],
      lg: spacing.size[4.5],
    },
  };
}
