import { StyleSheet, View } from 'react-native';

export default function Segment({
  padded,
  margin,
  secondary,
  rounded,
  style,
  ...props
}: {
  secondary?: boolean;
  rounded?: boolean;
  padded?: boolean | "small" | "medium" | "large";
  margin?: boolean | "small" | "medium" | "large";
} & React.ComponentProps<typeof View>) {
  const segmentStyles: any[] = [];

  if (secondary) {
    segmentStyles.push(styles.secondaryContainer);
  }

  if (rounded) {
    segmentStyles.push(styles.rounded);
  }

  if (padded) {
    switch (padded) {
      case "small":
        segmentStyles.push(styles.paddedSmall);
        break;
      case "large":
        segmentStyles.push(styles.paddedLarge);
        break;
      default:
        segmentStyles.push(styles.padded);
        break;
    }
  }

  if (margin) {
    switch (margin) {
      case "small":
        segmentStyles.push(styles.marginSmall);
        break;
      case "large":
        segmentStyles.push(styles.marginLarge);
        break;
      default:
        segmentStyles.push(styles.margin);
        break;
    }
  }

  if (style) {
    segmentStyles.push(style);
  }

  return <View {...props} style={segmentStyles} />;
}

const styles = StyleSheet.create({
  secondaryContainer: {
    backgroundColor: "#ecebeb",
  },
  rounded: {
    borderRadius: 5,
  },
  padded: {
    padding: 10,
  },
  paddedSmall: {
    padding: 5,
  },
  paddedLarge: {
    padding: 15,
  },
  margin: {
    marginVertical: 8,
    marginHorizontal: 10,
  },
  marginSmall: {
    marginVertical: 5,
    marginHorizontal: 8,
  },
  marginLarge: {
    marginVertical: 12,
    marginHorizontal: 15,
  },
});
