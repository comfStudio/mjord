import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

type IconNames = React.ComponentProps<typeof MaterialIcons>["name"];

export default function Label({
  icon,
  children,
  value,
  style,
  iconStyle,
  textStyle,
}: {
  icon?: React.ReactNode | IconNames;
  children?: React.ReactNode;
  value?: string;
  style?: React.ComponentProps<typeof View>["style"];
  iconStyle?: React.ComponentProps<typeof MaterialIcons>["style"];
  textStyle?: React.ComponentProps<typeof Text>["style"];
}) {
  let iconEl: React.ReactNode;

  if (typeof icon === "string") {
    iconEl = (
      <MaterialIcons
        style={[styles.icon, iconStyle]}
        name={icon as IconNames}
      />
    );
  } else {
    iconEl = icon;
  }

  return (
    <View style={[styles.container, style]}>
      {iconEl}
      <View style={styles.containerContent}>
        {!!value && <Text style={textStyle}>{value}</Text>}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecebeb",
    paddingVertical: 3,
    paddingHorizontal: 2,
    borderRadius: 5,
  },
  containerContent: {
    paddingHorizontal: 5,
  },

  icon: {
    color: "#888",
    fontSize: 24,
  },
});
