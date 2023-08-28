import { trueFromUnion } from '@app/misc/utils';

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

export type Size = (typeof size)[number];

// -----------------------

export type Variant = {
  primary: boolean;
  secondary: boolean;
  tertiary: boolean;
};

// -----------------------

export type ToggleVariant = {
  disabled: boolean;
  visible: boolean;
  hidden: boolean;
  outline: boolean;
};

// -----------------------

declare module "@app/styles/interface" {
  export interface VariantTypes {
    size: Size;
  }

  export interface VariantTypes extends Variant {}

  export interface VariantTypeGroups {
    variant: Variant;
  }

  export interface VariantTypes extends ToggleVariant {}
}
