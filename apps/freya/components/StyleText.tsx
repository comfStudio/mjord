import { Text } from "react-native";

import {
  composeStyles,
  createStyles,
  defineComponentStyles,
  ThemeProps,
  ThemeStyleProps,
  useStyles,
} from "@app/styles/theme";
import { Size, ToggleVariant, Variant } from "@app/styles/variants";

import { sizeFromUnion } from "../styles/variants";
import { createComponent } from "./";

declare module "./interface" {
  export interface ComponentStyles {
    text: defineComponentStyles<
      keyof Variant | Size | PickKeys<ToggleVariant, "disabled">
    >;
  }
}

type TextProps = {} & React.ComponentProps<typeof Text> &
  ThemeStyleProps<typeof Text, "text"> &
  ThemeProps<"variant" | "size" | "disabled">;

const StyleText = createComponent<TextProps, Text>(function StyleText(
  {
    style,
    overrideStyle,
    disabled,
    primary,
    tertiary,
    secondary,
    children,
    size = "medium",
    ...props
  }: TextProps,
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
      ...sizeFromUnion(size),
    },
    style
  );

  return (
    <Text {...props} ref={ref} style={compStyles}>
      {/* {!!iconEl && iconEl} */}
      {children}
    </Text>
  );
});

export default StyleText;

const styles = createStyles<"text">((t) => ({
  base: {
    color: t.colors.textColor,
  },

  medium: {},
  outline: {},
  tertiary: {},

  secondary: {},

  primary: {},

  disabled: {
    backgroundColor: "#EFEFEF",
  },

  large: {},

  small: {},
}));
