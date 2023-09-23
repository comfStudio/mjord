import { View } from "react-native";

import Icon from "@/components/Icon";
import Segment from "@/components/Segment";
import StyleText from "@/components/StyleText";
import { createStyles, useStyles } from "@app/styles/theme";

type IconNames = React.ComponentProps<typeof Icon>["name"];

export function AdvisoryLabel({ children, icon = "info" }: { children?: string; icon?: React.ReactNode | IconNames }) {
  let iconEl: React.ReactNode;

  const stl = useStyles(styles);

  if (typeof icon === "string") {
    iconEl = <Icon style={stl.icon} name={icon as IconNames} />;
  } else {
    iconEl = icon;
  }

  return (
    <View style={stl.label}>
      <View>{iconEl}</View>
      <StyleText style={stl.text}>{children}</StyleText>
    </View>
  );
}

export function AdvisorySegment({ children }: { children?: React.ReactNode }) {
  const stl = useStyles(styles);

  return (
    <Segment padded rounded secondary style={stl.container}>
      {children}
    </Segment>
  );
}

const styles = createStyles((t) => ({
  container: {
    marginHorizontal: t.spacing.edge.md,
    marginVertical: t.spacing.edge.sm,
  },
  label: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginVertical: t.spacing.edge.xs,
  },
  text: {
    paddingHorizontal: t.spacing.edge.md,
    color: t.colors.mutedText,
  },
  icon: {
    color: t.colors.mutedText,
    fontSize: t.sizing.icon.md,
  },
}));
