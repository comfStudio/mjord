import { TouchableOpacity } from "react-native";
import { useSetRecoilState } from "recoil";

import ListItem from "../components/ListItem";
import VerticalList from "../components/VerticalList";
import { GroupData } from "../services/group";
import { GroupState } from "../state";

const GROUP_DATA: GroupData[] = [
  {
    id: "1",
    title: "Card 1",
    description: "Description for Card 1",
    imageUrl: "https://placeimg.com/200/200/nature",
  },
  {
    id: "2",
    title: "Card 2",
    description: "Description for Card 2",
    imageUrl: "https://placeimg.com/200/200/animals",
  },
  {
    id: "3",
    title: "Card 3",
    description: "Description for Card 3",
    imageUrl: "https://placeimg.com/200/200/architecture",
  },
];

export default function GroupList({
  data,
  onPress,
}: {
  data: GroupData;
  onPress?: React.ComponentProps<typeof TouchableOpacity>["onPress"];
}) {
  const setGroup = useSetRecoilState(GroupState.currentGroupDetail);

  return (
    <ListItem
      title={data.title}
      imageUrl={data.imageUrl}
      description={data.description}
      onPress={
        onPress ??
        ((e) => {
          e.preventDefault();
          console.debug("Setting group", data);
          setGroup(data);
        })
      }
    />
  );
}

export function VerticalGroupList({
  data,
  onPress,
}: {
  data: GroupData[];
  onPress?: React.ComponentProps<typeof GroupList>["onPress"];
}) {
  return (
    <VerticalList
      data={data ?? GROUP_DATA}
      renderItem={({ item }) => <GroupList data={item} onPress={onPress} />}
    />
  );
}
