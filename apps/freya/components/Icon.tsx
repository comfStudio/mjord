import React from "react";

import {
  composeStyles,
  createStyles,
  defineComponentStyles,
  ThemeProps,
  ThemeStyleProps,
  useStyles,
} from "@app/styles/theme";
import { Size, sizeFromUnion } from "@app/styles/variants";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Icon as NativeIcon,
  IconButtonProps,
} from "@expo/vector-icons/build/createIconSet";

import { createComponent } from "./";

declare module "@app/styles/interface" {
  export interface ComponentStyles {
    icon: defineComponentStyles<Size>;
  }
}

export type IconVariant = {
  iconName: IconNames;
  iconProps: Omit<IconProps, "overrideStyle">;
};

declare module "@app/styles/interface" {
  export interface VariantTypes extends IconVariant {}

  export interface VariantTypeGroups {
    icon: IconVariant;
  }
}

type IconNames = React.ComponentProps<typeof MaterialIcons>["name"];

type IconProps<G extends string = IconNames> = {
  icon?: NativeIcon<G, any>;
  name?: G;
} & Omit<IconButtonProps<string>, "name" | "size"> &
  Omit<ThemeStyleProps<never, "icon">, "style"> &
  ThemeProps<"hidden" | "size">;

const Icon = createComponent(function Icon(
  {
    hidden,
    icon: Icon,
    name,
    overrideStyle,
    style,
    size = "medium",
    ...props
  }: IconProps,
  ref
) {
  const stl = useStyles(styles, overrideStyle);

  const compStyles = composeStyles(
    stl,
    {
      base: true,
      ...sizeFromUnion(size),
    },
    style
  );

  if (hidden || (!Icon && !name)) {
    return null;
  }

  return !Icon ? (
    <MaterialIcons
      {...props}
      ref={ref}
      style={compStyles}
      name={name as IconNames}
    />
  ) : (
    <Icon {...props} ref={ref} style={compStyles} name={name} />
  );
});

export default Icon;

const styles = createStyles<"icon">((t) => ({
  base: {},

  medium: {
    fontSize: 16,
  },

  large: {
    fontSize: 18,
  },

  small: {
    fontSize: 14,
  },
}));
