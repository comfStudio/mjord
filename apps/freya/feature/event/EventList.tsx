import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import DateLabel from '../../components/DateLabel';
import ListItem from '../../components/ListItem';
import Separator from '../../components/Separator';
import VerticalList from '../../components/VerticalList';
import { EventWithtExtraData } from '../../services/event';
import { BasicGroupWithMediaData } from '../../services/group';
import LocationLabel from '../location/LocationLabel';

export default function EventListItem({
  data,
  onPress,
  muted,
}: {
  muted?: boolean;
  data: Pick<
    EventWithtExtraData,
    | "title"
    | "description"
    | "start_time"
    | "end_time"
    | "members"
    | "address"
    | "latitude"
    | "longitude"
    | "location_name"
  >;
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
    >
      <View style={itemStyles.tagLine}>
        <MaterialIcons name="group" style={itemStyles.tagLineText} />
        <Text style={itemStyles.tagLineText}>
          {" "}
          {data?.members?.count ?? "??"}
        </Text>
        <Separator style={itemStyles.tagLineSeparator} />
        <DateLabel
          value={data.start_time ? new Date(data.start_time) : undefined}
        />
        <Separator style={itemStyles.tagLineSeparator} />
        {!!(data?.address && data?.location_name) && (
          <LocationLabel
            iconStyle={itemStyles.tagLineText}
            textStyle={itemStyles.tagLineText}
            data={data}
          />
        )}
      </View>
    </ListItem>
  );
}

const itemStyles = StyleSheet.create({
  tagLine: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 3,
    paddingLeft: 5,
  },
  tagLineText: {
    fontSize: 12,
    color: "#777",
  },
  tagLineSeparator: {
    marginHorizontal: 3,
  },
});

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
