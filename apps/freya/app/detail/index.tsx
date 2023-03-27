import { useSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { t } from "@mjord/common";

import Button from "../../components/Button";
import Separator from "../../components/Separator";
import { ImageSkeleton, LineSkeleton } from "../../components/Skeleton";
import FeaturedEvents from "../../feature/event/FeaturedEvents";
import LocationLabel from "../../feature/location/LocationLabel";
import { useGroup } from "../../services/group";

export default function DetailScreen() {
  const { id } = useSearchParams();
  const groupId = parseInt((id as string) || "0");

  const { data: group } = useGroup(groupId);

  const handleApplyToJoin = () => {
    // Handle the action when the user taps the "Apply to join" button
    console.log("Apply to join group ");
  };

  return (
    <ScrollView style={styles.container}>
      <ImageSkeleton
        width={1000}
        // loading={!group?.primary_media?.url}
        style={styles.image}
      >
        <Image
          source={{ uri: group?.primary_media?.url }}
          style={styles.image}
        />
      </ImageSkeleton>
      <LineSkeleton style={styles.title} loading={!group?.title}>
        <Text style={styles.title}>{group?.title}</Text>
      </LineSkeleton>

      <View style={styles.tagLine}>
        <MaterialIcons name="group" size={24} />
        <Text style={styles.membersText}>{group?.members || 0}</Text>
        <Separator />
        <LocationLabel data={group} />
      </View>

      <LineSkeleton
        lines={3}
        style={styles.description}
        loading={!group?.description}
      >
        <Text style={styles.description}>{group?.description}</Text>
      </LineSkeleton>
      <Button
        primary
        style={styles.applyButton}
        value={t`Apply to join`}
        onPress={handleApplyToJoin}
      />

      <Text style={styles.sectionTitle}>{t`Events`}</Text>
      <FeaturedEvents groupId={groupId} />
      <Text style={styles.sectionTitle}>{t`Discussions`}</Text>

      {[].map(({ item }) => (
        <View style={styles.discussion}>
          <Text style={styles.discussionTitle}>{item.title}</Text>
          <Text style={styles.discussionContent}>
            {item.content.substring(0, 100)}...
          </Text>
          <View style={styles.reactions}>
            {item.reactions.map((reaction) => (
              <Text key={reaction.id} style={styles.reaction}>
                {reaction.type}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    margin: 16,
    marginHorizontal: 16,
    marginTop: 8,
  },
  tagLine: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  membersText: {
    fontSize: 14,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  discussion: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 8,
  },
  discussionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  discussionContent: {
    fontSize: 14,
  },
  reactions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  reaction: {
    fontSize: 12,
    backgroundColor: "#eee",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  applyButton: {
    marginHorizontal: 50,
    marginTop: 10,
    marginBottom: 16,
  },
});
