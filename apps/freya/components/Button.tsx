import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { IconProp, useOptionalIconElement } from "@app/misc/ui-hooks";
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
import StyleText from "./StyleText";

declare module "./interface" {
  export interface ComponentStyles {
    button: defineComponentStyles<
      | "icon"
      | keyof Variant
      | Size
      | PickKeys<ToggleVariant, "disabled" | "outline">,
      "text"
    >;
  }
}

type ButtonProps = {
  value?: string;
  textStyle?: ComponentStyleProp<typeof Text>;
  icon?: IconProp;
} & React.ComponentProps<typeof TouchableOpacity> &
  ThemeStyleProps<typeof TouchableOpacity, "button"> &
  ThemeProps<"variant" | "size" | "outline" | "disabled">;

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
    icon,
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
      icon: !!icon,
      ...sizeFromUnion(size),
    },
    style
  );

  const iconEl = useOptionalIconElement({
    icon,
    // style: compStyles.buttonIcon,
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
      {!!iconEl && iconEl}
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
    borderColor: t.colors.borderColor,
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
  // icon: {
  //   fontSize: 18,
  // },

  secondary: {
    backgroundColor: t.colors.secondaryColor,
    borderWidth: 0,
  },

  primary: {
    backgroundColor: t.colors.primaryColor,
    borderWidth: 0,
  },

  disabled: {
    backgroundColor: "#EFEFEF",
    borderColor: t.colors.disabledBorderColor,
  },

  overrides: {
    text: {
      base: {
        fontSize: 14,
        textAlign: "center",
      },

      primary: {
        color: "white",
      },

      secondary: {
        color: "white",
      },

      large: {
        fontSize: 16,
      },

      small: {
        fontSize: 12,
      },
    },
  },
}));
