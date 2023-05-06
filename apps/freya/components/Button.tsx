import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { IconProp, useOptionalIconElement } from "../misc/ui-hooks";

export default function Button({
  value,
  onPress,
  style,
  textStyle,
  primary,
  disabled,
  secondary,
  icon,
  children,
  size = "medium",
}: {
  value?: string;
  onPress: () => void;
  style?: object;
  textStyle?: object;
  icon?: IconProp;
  primary?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  secondary?: boolean;
  size?: "small" | "medium" | "large";
}) {
  const buttonStyles = [styles.button, style];
  const textStyles = [styles.buttonText, textStyle];

  if (primary) {
    buttonStyles.push(styles.buttonPrimary);
    textStyles.push(styles.buttonTextPrimary);
  }

  if (secondary) {
    buttonStyles.push(styles.buttonSecondary);
    textStyles.push(styles.buttonTextSecondary);
  }

  if (disabled) {
    buttonStyles.push(styles.buttonDisabled);
    textStyles.push(styles.buttonTextDisabled);
  }

  if (icon) {
    buttonStyles.push(styles.buttonBaseIcon);
  }

  const iconEl = useOptionalIconElement({
    icon,
    style: styles.buttonIcon,
  });

  switch (size) {
    case "small":
      buttonStyles.push(styles.buttonSmall);
      textStyles.push(styles.buttonTextSmall);
      break;
    case "large":
      buttonStyles.push(styles.buttonLarge);
      textStyles.push(styles.buttonTextLarge);
      break;
  }

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress}>
      {!!value && (
        <Text textBreakStrategy="simple" style={textStyles}>
          {value}
        </Text>
      )}
      {!!iconEl && iconEl}
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#007AFF",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonBaseIcon: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonText: {
    fontSize: 14,
    color: "#007AFF",
    textAlign: "center",
  },

  buttonSecondary: {
    backgroundColor: "grey",
    borderWidth: 0,
  },

  buttonTextSecondary: {
    color: "white",
  },

  buttonPrimary: {
    backgroundColor: "#007AFF",
    borderWidth: 0,
  },

  buttonTextPrimary: {
    color: "white",
  },
  buttonDisabled: {
    backgroundColor: "#EFEFEF",
    borderColor: "#EFEFEF",
  },

  buttonTextDisabled: {
    color: "#AFAFAF",
  },

  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },

  buttonTextLarge: {
    fontSize: 16,
  },

  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  buttonTextSmall: {
    fontSize: 12,
  },
});
