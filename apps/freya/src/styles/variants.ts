import { trueFromUnionArray } from "@app/misc/utils";

export const ExtraSize = ["xs", "xl"] as const;

export const Size = ["sm", "md", "lg"] as const;

export const AllSize = [...ExtraSize, ...Size] as const;

export function sizeFromUnion<T extends AllSize>(s?: T) {
  return trueFromUnionArray(AllSize, s);
}

export type Size = (typeof Size)[number];
export type ExtraSize = (typeof ExtraSize)[number];
export type AllSize = (typeof AllSize)[number];

export type ExtraSizeVariant = {
  size: Size | ExtraSize;
};

export type AllSizeVariant = {
  size: AllSize;
};

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
  muted: boolean;
  edge: boolean;
  transparent: boolean;
  rounded: boolean | Size;
  padded: boolean | Size;
  margin: boolean | Size;
};

// -----------------------

declare module "@app/styles/interface" {
  export interface VariantTypes {
    size: Size;
  }

  export interface VariantTypes extends Variant {}

  export interface VariantTypeGroups {
    variant: Variant;
    allSize: AllSizeVariant;
    extraSize: ExtraSizeVariant;
  }

  export interface VariantTypes extends ToggleVariant {}
}
