import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ImageSkeleton } from "./Skeleton";

export default function Card({
  title,
  description,
  imageUrl,
  href,
  onPress,
}: {
  href?: string;
  title: string;
  description: string;
  imageUrl: string;
  onPress?: React.ComponentProps<typeof TouchableOpacity>["onPress"];
}) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={
        onPress ??
        ((e) => {
          e.preventDefault();
          if (!href) return;
          router.push(href);
        })
      }
    >
      <ImageSkeleton style={styles.image} loading={true} height={200} width={200}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </ImageSkeleton>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#777",
  },
});
