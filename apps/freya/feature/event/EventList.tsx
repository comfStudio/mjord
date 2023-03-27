import { TouchableOpacity } from "react-native";

import ListItem from "../../components/ListItem";
import VerticalList from "../../components/VerticalList";
import { BasicGroupWithMediaData } from "../../services/group";
import { EventData } from "../../services/types";

export default function EventListItem({
  data,
  onPress,
  muted,
}: {
  muted?: boolean;
  data: Pick<EventData, "title" | "description">;
  onPress?: React.ComponentProps<typeof TouchableOpacity>["onPress"];
}) {
  return (
    <ListItem
      image
      muted={muted}
      title={data.title}
      description={data.description}
      onPress={
        onPress ??
        ((e) => {
          e.preventDefault();
          console.debug("Setting group", data);
        })
      }
    />
  );
}

export function VerticalEventList({
  data,
  onPress,
}: {
  data: BasicGroupWithMediaData[];
  onPress?: React.ComponentProps<typeof EventListItem>["onPress"];
}) {
  return (
    <VerticalList
      data={data}
      renderItem={({ item }) => <EventListItem data={item} onPress={onPress} />}
    />
  );
}
