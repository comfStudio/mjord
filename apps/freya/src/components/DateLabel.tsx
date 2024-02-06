import { StyleSheet, Text, View } from "react-native";

import { formatDate } from "@app/misc/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Label from "./Label";

export default function DateLabel({
  value,
  style,
}: {
  value?: Date;
  style?: React.ComponentProps<typeof View>["style"];
}) {
  let valueStr = formatDate(value);

  return (
    <Label style={style} icon={<MaterialCommunityIcons name="clock" style={[dateStyles.dateLabelText]} />}>
      <Text style={dateStyles.dateLabelText}>{valueStr}</Text>
    </Label>
  );
}

const dateStyles = StyleSheet.create({
  dateLabelText: {
    fontSize: 12,
    color: "#777",
  },
});

export function DateRangeLabel({
  start,
  end,
  style,
}: {
  start?: Date;
  end?: Date;
  style?: React.ComponentProps<typeof View>["style"];
}) {
  let startStr: string;
  let endStr: string;

  if (start && end) {
    [startStr, endStr] = formatDate(start, end);
  } else if (start) {
    startStr = formatDate(start);
  } else if (end) {
    endStr = formatDate(end);
  }

  return (
    <View style={[dateRangeStyles.container, style]}>
      {start && (
        <Label icon={<MaterialCommunityIcons name="clock" style={dateRangeStyles.dateLabelText} />}>
          <Text style={dateRangeStyles.dateLabelText}>{startStr}</Text>
        </Label>
      )}
      {end && (
        <>
          <Text>-</Text>
          <Label icon={<MaterialCommunityIcons name="clock" style={dateRangeStyles.dateLabelText} />}>
            <Text style={dateRangeStyles.dateLabelText}>{endStr}</Text>
          </Label>
        </>
      )}
    </View>
  );
}

const dateRangeStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabelText: {
    fontSize: 12,
    color: "#777",
  },
});
