import ContentLoader, { Rect } from "react-content-loader/native";
import { StyleProp, View, ViewStyle } from "react-native";

export function ImageSkeleton({
  height = 200,
  width = 200,
  loading = true,
  style,
  children,
}: {
  height?: number;
  width?: number;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  const el = (
    <ContentLoader
      speed={2}
      width={width ?? (style as any)?.width}
      height={height ?? (style as any)?.height}
      animate={loading}
      viewBox={`0 0 ${width} ${height}`}
      backgroundColor="#d9d9d9"
      foregroundColor="#ecebeb"
      style={style}
    >
      <Rect x="0" y="0" width={width} height={height} />
    </ContentLoader>
  );

  if (!loading) {
    return children as React.ReactElement;
  }

  if (style) {
    return <View style={style}>{el}</View>;
  }

  return el;
}

export function LineSkeleton({
  lines = 1,
  loading = true,
  lineHeight = 10,
  height: controlledHeight,
  width = 200,
  style,
  children,
}: {
  lines?: number;
  lineHeight?: number;
  height?: number;
  width?: number;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  const margin = 10;
  const height = controlledHeight ?? lines * (lineHeight + margin);

  const el = (
    <ContentLoader
      speed={2}
      width={width ?? (style as any)?.width}
      height={height ?? (style as any)?.height}
      animate={loading}
      viewBox={`0 0 ${width} ${height}`}
      backgroundColor="#d9d9d9"
      foregroundColor="#ecebeb"
      style={style}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <Rect key={i} x="0" y={i * lineHeight + margin} width={width} height={lineHeight} />
      ))}
    </ContentLoader>
  );

  if (!loading) {
    return children as React.ReactElement;
  }

  if (style) {
    return <View style={style}>{el}</View>;
  }

  return el;
}
