import { StyleSheet, TextInput, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { IconProp, useOptionalIconElement } from "../misc/ui-hooks";
import Button from "./Button";

export function Input({
  style,
  ...props
}: {} & React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#888"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#333",
  },
});

export function IconInput({
  style,
  viewStyle,
  icon,
  iconStyle,

  ...props
}: {
  style?: React.ComponentProps<typeof TextInput>["style"];
  icon?: IconProp;
  viewStyle?: React.ComponentProps<typeof View>["style"];
  iconStyle?: React.ComponentProps<typeof MaterialIcons>["style"];
} & Omit<React.ComponentProps<typeof TextInput>, "style">) {
  const iconEl = useOptionalIconElement({
    icon,
    style: [iconInputStyles.icon, iconStyle],
  });

  return (
    <View style={[iconInputStyles.inputWrapper, viewStyle]}>
      {iconEl}
      <Input style={style} {...props} />
    </View>
  );
}

const iconInputStyles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
    fontSize: 24,
  },
});

export function ButtonInput({
  style,
  viewStyle,
  buttonValue,
  buttonStyle,
  onPress,
  ButtonIcon,

  ...props
}: {
  style?: React.ComponentProps<typeof TextInput>["style"];
  buttonValue?: React.ComponentProps<typeof Button>["value"];
  buttonStyle?: React.ComponentProps<typeof Button>["style"];
  onPress: React.ComponentProps<typeof Button>["onPress"];
  ButtonIcon?: React.ComponentProps<typeof Button>["icon"];
  viewStyle?: React.ComponentProps<typeof View>["style"];
} & Omit<React.ComponentProps<typeof TextInput>, "style">) {
  return (
    <View style={[buttonInputStyles.inputWrapper, viewStyle]}>
      <Input style={[buttonInputStyles.input, style]} {...props} />
      <Button
        value={buttonValue}
        onPress={onPress}
        icon={ButtonIcon}
        style={[buttonInputStyles.button, buttonStyle]}
      />
    </View>
  );
}

const buttonInputStyles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  input: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  button: {
    height: 50,
    borderRadius: 8,
    marginRight: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
});
