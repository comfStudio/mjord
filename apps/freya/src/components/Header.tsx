import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface AnimatedHeaderProps {
  startOffset?: number;
  endOffset: number;
  backgroundStyle?: ViewStyle;
  transparentContent?: boolean;
}

export function useAnimatedHeader({
  startOffset = 0,
  endOffset = 200,
  transparentContent = false,
  backgroundStyle,
}: AnimatedHeaderProps) {
  const nav = useNavigation();

  const heightOffset = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    const headerOpacity = interpolate(heightOffset.value, [startOffset, endOffset], [0, 1], {
      extrapolateRight: "clamp",
    });
    const style = {
      opacity: headerOpacity,
    };

    return style;
  }, [startOffset, endOffset]);

  useLayoutEffect(() => {
    nav.setOptions({
      headerStyle: {
        opacity: transparentContent ? style.opacity : 1,
      },
      headerBackground: () => (
        <Animated.View
          style={[
            {
              backgroundColor: "#ecebeb",
              ...StyleSheet.absoluteFillObject,
              ...backgroundStyle,
            },
            style,
          ]}
        />
      ),
      headerTransparent: true,
    });
  }, [nav, style]);

  return heightOffset;
}

export function AnimatedHeaderScrollView({
  header,
  ...props
}: {
  header: AnimatedHeaderProps;
} & React.ComponentProps<typeof Animated.ScrollView>) {
  const yOffset = useAnimatedHeader(header);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      yOffset.value = e.contentOffset.y;
    },
  });

  return <Animated.ScrollView {...props} onScroll={scrollHandler} scrollEventThrottle={16} />;
}
