import React from "react";

import StyleText from "@/components/StyleText";
import { booleanFromArray } from "@app/misc/utils";
import { HeadingSize } from "@app/styles/sizing";
import { composeStyles, createStyles, defineComponentStyles, useStyles } from "@app/styles/theme";

import { createComponent } from "./";

declare module "@app/styles/interface" {
  export interface ComponentStyles {
    heading: defineComponentStyles<{
      names: HeadingSize;
    }>;
  }
}

type HeadingProps = { [k in HeadingSize]?: boolean } & Omit<React.ComponentProps<typeof StyleText>, "size">;

const Heading = createComponent(function Heading(
  { overrideStyle, style, h1, h2, h3, h4, ...props }: HeadingProps,
  ref
) {
  const stl = useStyles(styles);

  const compStyles = composeStyles(
    stl,
    {
      base: true,
      ...booleanFromArray(HeadingSize, [h1, h2, h3, h4]),
    },
    style
  );

  return <StyleText {...props} ref={ref} style={compStyles} overrideStyle={overrideStyle} />;
});

export default Heading;

const styles = createStyles<"heading">((t) => ({
  base: {
    fontWeight: "bold",
    fontSize: t.sizing.text.heading.h1,
  },

  h1: {
    fontSize: t.sizing.text.heading.h1,
  },

  h2: {
    fontSize: t.sizing.text.heading.h2,
  },

  h3: {
    fontSize: t.sizing.text.heading.h3,
  },

  h4: {
    fontSize: t.sizing.text.heading.h4,
  },
}));
