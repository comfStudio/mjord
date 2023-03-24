import { TouchableOpacity } from "react-native";
import { useSetRecoilState } from "recoil";

import Card from "../components/Card";
import { HorizontalCardList } from "../components/CardList";
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

export default function GroupCard({
  data,
  onPress,
}: {
  data: GroupData;
  onPress?: React.ComponentProps<typeof TouchableOpacity>["onPress"];
}) {
  const setGroup = useSetRecoilState(GroupState.currentGroupDetail);

  return (
    <Card
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

export function HorizontalGroupCardList({
  data,
  onPress,
}: {
  data: GroupData[];
  onPress?: React.ComponentProps<typeof GroupCard>["onPress"];
}) {
  return (
    <HorizontalCardList
      data={data ?? GROUP_DATA}
      renderItem={({ item }) => <GroupCard data={item} onPress={onPress} />}
    />
  );
}
