import { StyleSheet, View } from 'react-native';

import ListItem from "@/components/ListItem";
import { VerticalLoadMoreList } from "@/components/VerticalList";
import { GroupMemberWithProfileData } from "@/services/group";

export function MemberItem({ data }: { data: GroupMemberWithProfileData }) {
  return <ListItem title={data?.profile?.name} description="hello world" />;
}

export default function MemberList({
  data,
}: {
  data: GroupMemberWithProfileData[];
}) {
  const renderItem = (item) => {
    return <MemberItem data={item} />;
  };

  return (
    <View style={styles.container}>
      <VerticalLoadMoreList
        keyExtractor={(item: GroupMemberWithProfileData) => item.profile_id}
        initialPageSize={20}
        pageSize={10}
        data={data}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  memberItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  memberName: {
    fontSize: 16,
  },
});
