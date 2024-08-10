import { Text } from 'react-native';

import {
  composeStyles,
  createStyles,
  defineComponentStyles,
  ThemeProps,
  ThemePropsNames,
  ThemeStyleProps,
  useStyles,
} from '@app/styles/theme';
import { AllSize, sizeFromUnion } from '@app/styles/variants';

import { createComponent } from './';

declare module "@app/styles/interface" {
  export interface ComponentStyles {
    text: defineComponentStyles<{
      names: ThemePropsNames<"variant" | "disabled" | "muted"> | AllSize;
    }>;
  }
}

type TextProps = {} & React.ComponentProps<typeof Text> &
  ThemeStyleProps<typeof Text, "text"> &
  ThemeProps<"variant" | "size" | "disabled" | "muted">;

const StyleText = createComponent<TextProps, Text>(function StyleText(
  { style, overrideStyle, disabled, muted, primary, tertiary, secondary, children, size, ...props }: TextProps,
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
      muted,
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
    color: t.colors.text,
    fontSize: t.sizing.text.body,
  },

  outline: {},
  tertiary: {},

  secondary: {
    color: t.colors.secondary,
  },

  primary: {
    color: t.colors.primary,
  },

  disabled: {
    backgroundColor: t.colors.disabledText,
  },

  muted: {
    color: t.colors.mutedText,
  },

  xs: {
    fontSize: t.sizing.text.xs,
  },

  sm: {
    fontSize: t.sizing.text.sm,
  },

  md: {
    fontSize: t.sizing.text.md,
  },

  lg: {
    fontSize: t.sizing.text.lg,
  },

  xl: {
    fontSize: t.sizing.text.xl,
  },
}));
