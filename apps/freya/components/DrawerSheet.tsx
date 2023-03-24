import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DrawerSheet({
  isVisible: controlledIsVisible,
  children,
  onClose,
}: {
  children: React.ReactNode;
  isVisible?: boolean;
  onClose?: React.ComponentProps<typeof TouchableOpacity>["onPress"];
}) {
  const insets = useSafeAreaInsets();

  const windowHeight = Dimensions.get("window").height;

  const minHeight = Math.max(insets.bottom + 80, 0.25 * windowHeight);

  const slideAnimation = useRef(new Animated.Value(0)).current;

  const [isVisibleInternal, setIsVisibleInternal] = useState(false);
  const isVisible =
    controlledIsVisible !== undefined ? controlledIsVisible : isVisibleInternal;

  useEffect(() => {
    if (isVisible) {
      setIsVisibleInternal(true);
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsVisibleInternal(false));
    }
  }, [isVisible, slideAnimation]);

  const translateY = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [minHeight, 0],
  });

  if (!isVisibleInternal) {
    return null;
  }

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom }]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={(e) => {
          if (onClose) {
            onClose(e);
          }
        }}
      />
      <Animated.View
        style={[
          styles.contentContainer,
          { minHeight, transform: [{ translateY }] },
        ]}
      >
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  contentContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginVertical: 8,
  },
});
