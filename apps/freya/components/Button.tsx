import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Button({
  value,
  onPress,
  style,
  textStyle,
}: {
  value: string;
  onPress: () => void;
  style?: object;
  textStyle?: object;
}) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text textBreakStrategy="simple" style={[styles.buttonText, textStyle]}>
        {value}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignSelf: "center",
    marginTop: 16,
  },
  buttonText: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
});
