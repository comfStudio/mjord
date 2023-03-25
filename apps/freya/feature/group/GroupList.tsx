import { TouchableOpacity } from "react-native";
import { useSetRecoilState } from "recoil";

import ListItem from "../../components/ListItem";
import VerticalList from "../../components/VerticalList";
import { GroupWithMediaData } from "../../services/group";
import { GroupState } from "../../state";

export default function GroupList({
  data,
  onPress,
}: {
  data: GroupWithMediaData;
  onPress?: React.ComponentProps<typeof TouchableOpacity>["onPress"];
}) {
  const setGroup = useSetRecoilState(GroupState.currentGroupDetail);

  return (
    <ListItem
      title={data.name}
      imageUrl={data?.primary_media?.url}
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
  data: GroupWithMediaData[];
  onPress?: React.ComponentProps<typeof GroupList>["onPress"];
}) {
  return (
    <VerticalList
      data={data}
      renderItem={({ item }) => <GroupList data={item} onPress={onPress} />}
    />
  );
}
