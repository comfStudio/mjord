import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Separator({
  style,
  textStyle,
}: {
  style?: React.ComponentProps<typeof View>["style"];
  textStyle?: React.ComponentProps<typeof Text>["style"];
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.separator, textStyle]}>{"\u2B24"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  separator: {
    color: "#ecebeb",
  },
});
