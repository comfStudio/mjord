import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

import { HorizontalGroupCardList } from "@/feature/group/GroupCard";
import { VerticalLoadMoreGroupList } from "@/feature/group/GroupList";
import { useFeaturedGroups } from "@/services/group";
import RefreshControl from "@app/components/RefreshControl";
import { useRefreshByUser } from "@app/misc/hooks";

export default function HomeScreen() {
  const { data, refetch } = useFeaturedGroups();

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />}
    >
      <View style={styles.cardContainer}>
        <HorizontalGroupCardList data={data ?? []} />
      </View>
      <View style={[styles.listContainer, { width: Dimensions.get("screen").width }]}>
        <VerticalLoadMoreGroupList initialPageSize={30} pageSize={10} data={data ?? []} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    maxWidth: 960,
  },
  listContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
