import { View } from "react-native";

import Icon from "@/components/Icon";
import Segment from "@/components/Segment";
import StyleText from "@/components/StyleText";
import { createStyles, useStyles } from "@app/styles/theme";

type IconNames = React.ComponentProps<typeof Icon>["name"];

export function AdvisoryLabel({
  children,
  icon = "info",
}: {
  children?: string;
  icon?: React.ReactNode | IconNames;
}) {
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
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  label: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    paddingHorizontal: 10,
    color: "#666",
  },
  icon: {
    color: "#666",
    fontSize: 25,
  },
}));
