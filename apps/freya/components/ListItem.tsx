import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ImageSkeleton } from "./Skeleton";

export default function ListItem({
  imageUrl,
  title,
  description,
  href,
  onPress,
}: {
  imageUrl: string;
  title: string;
  description: string;
  href?: string;
  onPress?: React.ComponentProps<typeof TouchableOpacity>["onPress"];
}) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={
        onPress ??
        ((ev) => {
          ev.preventDefault();
          if (!href) return;
          router.push(href);
        })
      }
    >
      <ImageSkeleton loading={true} style={styles.image} height={64} width={64}>
        <Image style={styles.image} source={{ uri: imageUrl }} />
      </ImageSkeleton>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#888",
  },
});
