import React from "react";
import { Text, TouchableOpacity } from "react-native";

import {
  composeStyles,
  createStyles,
  defineComponentStyles,
  ThemeProps,
  ThemeStyleProps,
  useStyles,
} from "@app/styles/theme";
import {
  Size,
  sizeFromUnion,
  ToggleVariant,
  Variant,
} from "@app/styles/variants";

import { createComponent } from "./";
import Icon from "./Icon";
import StyleText from "./StyleText";

declare module "@app/styles/interface" {
  export interface ComponentStyles {
    button: defineComponentStyles<
      | "icon"
      | "primaryIcon"
      | "secondaryIcon"
      | keyof Variant
      | Size
      | PickKeys<ToggleVariant, "disabled" | "outline">,
      "text" | "icon"
    >;
  }
}

type ButtonProps = {
  value?: string;
  textStyle?: ComponentStyleProp<typeof Text>;
} & React.ComponentProps<typeof TouchableOpacity> &
  ThemeStyleProps<typeof TouchableOpacity, "button"> &
  ThemeProps<"variant" | "icon" | "size" | "outline" | "disabled">;

const Button = createComponent<ButtonProps, TouchableOpacity>(function Button(
  {
    value,
    style,
    overrideStyle,
    disabled,
    outline,
    primary,
    secondary,
    tertiary,
    iconName,
    iconProps,
    children,
    size = "medium",
    ...props
  }: ButtonProps,
  ref
) {
  const stl = useStyles(styles, overrideStyle);

  const compStyles = composeStyles(
    stl,
    {
      base: true,
      primary,
      secondary,
      tertiary,
      disabled,
      outline,
      icon: !!iconName || !!iconProps,
      ...sizeFromUnion(size),
    },
    style
  );

  // primary && console.log(compStyles);

  const iconStyles = composeStyles(stl, {
    primaryIcon: primary,
    secondaryIcon: secondary,
  });

  return (
    <TouchableOpacity {...props} ref={ref} style={compStyles}>
      {!!value && (
        <StyleText
          textBreakStrategy="simple"
          overrideStyle={stl.overrides?.text}
          primary={primary}
          secondary={secondary}
          tertiary={tertiary}
          disabled={disabled}
          size={size}
        >
          {value}
        </StyleText>
      )}
      <Icon
        name={iconName}
        {...iconProps}
        size={size}
        style={iconStyles as any}
        overrideStyle={stl.overrides?.icon}
      />
      {children}
    </TouchableOpacity>
  );
});

export default Button;

const styles = createStyles<"button">((t) => ({
  base: {
    backgroundColor: t.colors.inputBackground,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderColor: t.colors.border,
    borderWidth: 1,
  },

  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },

  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  outline: {
    backgroundColor: "transparent",
  },
  tertiary: {},

  icon: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  primaryIcon: {
    color: t.colors.primaryAlternate,
  },

  secondaryIcon: {
    color: t.colors.secondaryAlternate,
  },

  secondary: {
    backgroundColor: t.colors.secondary,
    borderWidth: 0,
  },

  primary: {
    backgroundColor: t.colors.primary,
    borderWidth: 0,
  },

  disabled: {
    backgroundColor: "#EFEFEF",
    borderColor: t.colors.disabledBorder,
  },

  overrides: {
    text: {
      base: {
        color: t.colors.input,
        fontSize: 14,
        textAlign: "center",
      },

      primary: {
        color: t.colors.primaryAlternate,
      },

      secondary: {
        color: t.colors.secondaryAlternate,
      },

      large: {
        fontSize: 16,
      },

      small: {
        fontSize: 12,
      },
    },

    icon: {
      medium: {
        fontSize: 18,
      },
    },
  },
}));
