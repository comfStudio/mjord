import { StyleSheet, Text, View } from "react-native";

import { VerticalLoadMoreList } from "@/components/VerticalList";
import { useFeaturedEvents } from "@/services/event";
import Segment from "@app/components/Segment";
import { t } from "@mjord/common";

import EventListItem from "./EventList";

export default function FeaturedEvents({ groupId }: { groupId: number }) {
  const { data, error } = useFeaturedEvents(groupId);

  function renderItemFuture(item: (typeof data)["future"][0]) {
    return <EventListItem data={item} />;
  }
  function renderItemPast(item: (typeof data)["future"][0]) {
    return <EventListItem data={item} muted />;
  }

  return (
    <Segment transparent>
      <VerticalLoadMoreList pageSize={5} data={data?.future ?? []} renderItem={renderItemFuture} />
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{t`Past events`}</Text>
      </View>
      <VerticalLoadMoreList initialPageSize={2} pageSize={3} data={data?.past ?? []} renderItem={renderItemPast} />
    </Segment>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 14,
    color: "#999",
    marginVertical: 5,
  },
});
