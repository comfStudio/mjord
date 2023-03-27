import { Pressable, StyleSheet, Text } from "react-native";

export default function Button({
  value,
  onPress,
  style,
  textStyle,
  primary,
  secondary,
  size = "medium",
}: {
  value: string;
  onPress: () => void;
  style?: object;
  textStyle?: object;
  primary?: boolean;
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
    <Pressable style={buttonStyles} onPress={onPress}>
      <Text textBreakStrategy="simple" style={textStyles}>
        {value}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    borderColor: "#007AFF",
    borderWidth: 1,
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
