import { View } from "react-native";

import { LineSkeleton } from "@/components/Skeleton";
import Heading from "@app/components/Heading";
import { loginSchema1 } from "@app/schemas/login";
import {
  composeStyles,
  createStyles,
  defineComponentStyles,
  ThemeProps,
  ThemePropsNames,
  ThemeStyleProps,
  useStyles,
} from "@app/styles/theme";

import { createComponent } from "./";

loginSchema1;

declare module "@app/styles/interface" {
  export interface ComponentStyles {
    segment: defineComponentStyles<{
      names:
        | ThemePropsNames<"secondary" | "tertiary" | "rounded" | "padded" | "margin" | "edge" | "transparent">
        | "marginSm"
        | "marginMd"
        | "marginLg"
        | "paddingSm"
        | "paddingMd"
        | "paddingLg";
    }>;
  }
}

const Segment = createComponent<
  ThemeStyleProps<typeof View> &
    Omit<React.ComponentProps<typeof View>, "style"> &
    ThemeProps<"secondary" | "tertiary" | "rounded" | "padded" | "margin" | "edge" | "transparent">,
  View
>(function Segment(
  { padded, margin, secondary, tertiary, transparent, rounded, edge, style, overrideStyle, ...props },
  ref
) {
  const stl = useStyles(styles, overrideStyle);

  const compStyles = composeStyles(
    stl,
    {
      base: true,
      secondary,
      tertiary,
      edge,
      transparent,
      rounded: !!rounded,
      padded: !!padded,
      margin: !!margin,
      paddingSm: padded === "sm",
      paddingMd: padded === "md" || padded === true,
      paddingLg: padded === "lg",
      marginSm: margin === "sm",
      marginMd: margin === "md" || margin === true,
      marginLg: margin === "lg",
      roundedSm: rounded === "sm",
      roundedMd: rounded === "md" || rounded === true,
      roundedLg: rounded === "lg",
    },
    style
  );

  return <View {...props} ref={ref} style={compStyles} />;
});

export default Segment;

const styles = createStyles<"segment">((t) => ({
  base: {
    backgroundColor: t.colors.primaryBackground,
  },

  secondary: {
    backgroundColor: t.colors.secondaryBackground,
  },
  tertiary: {
    backgroundColor: t.colors.tertiaryBackground,
  },

  transparent: {
    backgroundColor: undefined,
  },

  rounded: {},
  roundedSm: {
    borderRadius: t.sizing.border.sm,
  },
  roundedMd: {
    borderRadius: t.sizing.border.md,
  },
  roundedLg: {
    borderRadius: t.sizing.border.lg,
  },

  padded: {},
  paddingSm: {
    padding: t.spacing.edge.sm,
  },
  paddingMd: {
    padding: t.spacing.edge.md,
  },
  paddingLg: {
    padding: t.spacing.edge.lg,
  },

  edge: {
    paddingHorizontal: t.spacing.edge.default,
  },
  margin: {},
  marginSm: {
    marginVertical: t.spacing.size[1],
    marginHorizontal: t.spacing.size[1.5],
  },
  marginMd: {
    marginVertical: t.spacing.size[2],
    marginHorizontal: t.spacing.size[2.5],
  },
  marginLg: {
    marginVertical: t.spacing.size[3],
    marginHorizontal: t.spacing.size[3.5],
  },
}));

export const EdgeSegment = createComponent<Omit<React.ComponentProps<typeof Segment>, "edge">, View>(
  function EdgeSegment({ style, ...props }, ref) {
    const stl = useStyles(edgeSegmentStyles);

    return <Segment {...props} ref={ref} edge style={[stl.base, style]} />;
  }
);

const edgeSegmentStyles = createStyles((t) => ({
  base: {
    padding: t.spacing.edge.sm,
  },
}));

export const TitleSegment = createComponent<
  React.ComponentProps<typeof Segment> & {
    title: string | React.ComponentProps<typeof Heading>;
  },
  View
>(function EdgeSegment({ children, title, ...props }, ref) {
  const stl = useStyles(titleSegmentStyles);

  return (
    <Segment {...props} ref={ref}>
      {typeof title === "string" ? (
        <LineSkeleton style={stl.title} loading={!title}>
          <Heading h1 style={stl.title}>
            {title}
          </Heading>
        </LineSkeleton>
      ) : (
        !!title && <Heading {...title} />
      )}
      {children}
    </Segment>
  );
});

const titleSegmentStyles = createStyles((t) => ({
  title: {
    marginBottom: t.spacing.edge.sm,
  },
}));
