import { TouchableOpacity } from 'react-native';
import { useSetRecoilState } from 'recoil';

import Card from '../../components/Card';
import { HorizontalCardList } from '../../components/CardList';
import { BasicGroupWithMediaData } from '../../services/group';
import { GroupState } from '../../state';

export default function GroupCard({
  data,
  onPress,
}: {
  data: BasicGroupWithMediaData;
  onPress?: React.ComponentProps<typeof TouchableOpacity>["onPress"];
}) {
  const setGroup = useSetRecoilState(GroupState.currentGroupDetail);

  return (
    <Card
      title={data.title}
      imageUrl={data?.primary_media?.url}
      description={data.description}
      onPress={
        onPress ??
        ((e) => {
          e.preventDefault();
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
  data: BasicGroupWithMediaData[];
  onPress?: React.ComponentProps<typeof GroupCard>["onPress"];
}) {
  return (
    <HorizontalCardList
      data={data}
      renderItem={({ item }) => <GroupCard data={item} onPress={onPress} />}
    />
  );
}
