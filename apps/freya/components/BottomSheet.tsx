import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomSheet({
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

  const minHeight = Math.max(insets.bottom + 80, 0.35 * windowHeight);

  const [contentHeight, setContentHeight] = useState(minHeight);

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
    outputRange: [contentHeight, 0],
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
          e.preventDefault();
          if (onClose) {
            onClose(e);
          }
        }}
      />
      <Animated.View
        onLayout={(e) => {
          setContentHeight(e.nativeEvent.layout.height);
        }}
        style={[
          styles.contentContainer,
          { minHeight, transform: [{ translateY }] },
        ]}
      >
        <Pressable
          onPress={(e) => {
            e.preventDefault();
            if (onClose) {
              onClose(e);
            }
          }}
        >
          <View style={styles.handle} />
        </Pressable>
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
