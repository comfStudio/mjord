import { DimensionValue } from "react-native";

import { Spacing } from "./spacing";
import { AllSize } from "./variants";

export type IconSize = AllSize;
export type TextSize = AllSize;
export type BorderSize = AllSize;

export const HeadingSize = ["h1", "h2", "h3", "h4"] as const;

export type HeadingSize = (typeof HeadingSize)[number];

export interface Sizing {
  image: {
    hero: {
      width: DimensionValue;
      height: DimensionValue;
    };
  };

  text: Record<TextSize, number> & {
    heading: Record<HeadingSize, number>;
    body: number;
  };

  border: Record<BorderSize, number> & {
    default: number;
    radius: Record<BorderSize, number>;
  };

  icon: Record<TextSize, number>;
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

      xs: spacing.size[3],
      sm: spacing.size[3.5],
      md: spacing.size[4],
      lg: spacing.size[4.5],
      xl: spacing.size[5],
    },

    border: {
      default: spacing.size[1.5],
      xs: spacing.size[0.5],
      sm: spacing.size[1],
      md: spacing.size[1.5],
      lg: spacing.size[2],
      xl: spacing.size[2.5],
      radius: {
        xs: spacing.size[0.5],
        sm: spacing.size[1],
        md: spacing.size[1.5],
        lg: spacing.size[2],
        xl: spacing.size[2.5],
      },
    },

    icon: {
      xs: spacing.size[4.5],
      sm: spacing.size[5],
      md: spacing.size[7],
      lg: spacing.size[8],
      xl: spacing.size[10],
    },
  };
}
