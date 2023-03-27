import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ImageSkeleton } from './Skeleton';

export default function ListItem({
  imageUrl,
  image,
  title,
  description,
  size = "medium",
  href,
  onPress,
  children,
  muted,
}: {
  title: string;
  imageUrl?: string;
  image?: boolean;
  muted?: boolean;
  size?: "small" | "medium" | "large";
  description?: string;
  children?: React.ReactNode;
  href?: string;
  onPress?: React.ComponentProps<typeof TouchableOpacity>["onPress"];
}) {
  const router = useRouter();

  const containerStyles: any[] = [styles.container];
  const titleStyles: any[] = [styles.title];
  const descriptionStyles: any[] = [styles.description];

  if (muted) {
    containerStyles.push(styles.mutedContainer);
    titleStyles.push(styles.mutedTitle);
  }

  switch (size) {
    case "small":
      titleStyles.push(styles.titleSmall);
      descriptionStyles.push(styles.descriptionSmall);
      break;

    case "large":
      titleStyles.push(styles.titleLarge);
      break;

    default:
      break;
  }

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={
        onPress ??
        ((ev) => {
          ev.preventDefault();
          if (!href) return;
          router.push(href);
        })
      }
    >
      {image && (
        <ImageSkeleton
          loading={true}
          style={styles.image}
          height={64}
          width={64}
        >
          <Image style={styles.image} source={{ uri: imageUrl }} />
        </ImageSkeleton>
      )}
      <View style={styles.textContainer}>
        <Text style={titleStyles}>{title}</Text>
        {!!description && (
          <Text numberOfLines={2} style={descriptionStyles}>
            {description}
          </Text>
        )}
        {children}
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
  mutedContainer: {
    opacity: 0.5,
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
    fontSize: 15,
    fontWeight: "bold",
  },
  mutedTitle: {
    color: "#888",
  },
  titleSmall: {
    fontSize: 13,
    marginBottom: 1,
  },
  titleLarge: {
    fontSize: 18,
    marginBottom: 5,
  },

  description: {
    fontSize: 14,
    color: "#888",
  },

  descriptionSmall: {
    fontSize: 12,
  },
});
