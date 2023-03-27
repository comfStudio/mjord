import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

type IconNames = React.ComponentProps<typeof MaterialIcons>["name"];

export default function Label({
  icon,
  children,
  value,
  style,
}: {
  icon?: React.ReactNode | IconNames;
  children?: React.ReactNode;
  value?: string;
  style?: React.ComponentProps<typeof View>["style"];
}) {
  let iconEl: React.ReactNode;

  if (typeof icon === "string") {
    iconEl = (
      <MaterialIcons style={styles.icon} name={icon as IconNames} size={24} />
    );
  } else {
    iconEl = icon;
  }

  return (
    <View style={[styles.container, style]}>
      {iconEl}
      <View style={styles.containerContent}>
        {!!value && <Text>{value}</Text>}
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
  },
});
