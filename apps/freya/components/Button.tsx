import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

export default function Button({
  value,
  onPress,
  style,
  textStyle,
  primary,
  secondary,
  icon,
  children,
  size = "medium",
}: {
  value?: string;
  onPress: () => void;
  style?: object;
  textStyle?: object;
  icon?: React.ComponentProps<typeof MaterialIcons>["name"];
  primary?: boolean;
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

  if (icon) {
    buttonStyles.push(styles.buttonBaseIcon);
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
    <TouchableOpacity style={buttonStyles} onPress={onPress}>
      {!!value && (
        <Text textBreakStrategy="simple" style={textStyles}>
          {value}
        </Text>
      )}
      {!!icon && (
        <MaterialIcons name={icon} style={[textStyles, styles.buttonIcon]} />
      )}
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
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
