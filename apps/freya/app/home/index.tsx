import { Tabs } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";

import { HorizontalGroupCardList } from "../../feature/group/GroupCard";
import { VerticalGroupList } from "../../feature/group/GroupList";
import { useFeaturedGroups } from "../../services/group";

export default function HomeScreen() {
  const { data } = useFeaturedGroups();

  return (
    <View style={styles.container}>
      <Tabs.Screen options={{ title: "Home" }} />
      <View style={styles.cardContainer}>
        <HorizontalGroupCardList data={data} />
      </View>
      <View
        style={[
          styles.listContainer,
          { width: Dimensions.get("screen").width },
        ]}
      >
        <VerticalGroupList data={data} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    flex: 1,
    maxWidth: 960,
  },
  listContainer: {
    flexGrow: 1,
    height: 200,
    maxHeight: 960,
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
