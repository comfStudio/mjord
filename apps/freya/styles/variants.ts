import { trueFromUnion } from "@app/misc/utils";

const size = ["small", "medium", "large"] as const;

export function sizeFromUnion(s: Size) {
  return trueFromUnion(
    size.reduce((acc, v) => {
      acc[v] = false;
      return acc;
    }, {} as Record<Size, boolean>),
    s
  );
}

export interface VariantTypes {}

export interface VariantTypeGroups {}

// -----------------------

export type Size = (typeof size)[number];

export interface VariantTypes {
  size: Size;
}

// -----------------------

export type Variant = {
  primary: boolean;
  secondary: boolean;
  tertiary: boolean;
};

export interface VariantTypes extends Variant {}

export interface VariantTypeGroups {
  variant: Variant;
}

// -----------------------

export type ToggleVariant = {
  disabled: boolean;
  visible: boolean;
  outline: boolean;
};

export interface VariantTypes extends ToggleVariant {}
