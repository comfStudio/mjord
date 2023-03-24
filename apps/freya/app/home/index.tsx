import { Tabs } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";

import { HorizontalGroupCardList } from "../../feature/GroupCard";
import { VerticalGroupList } from "../../feature/GroupList";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Tabs.Screen options={{ title: "Home" }} />
      <View style={styles.cardContainer}>
        <HorizontalGroupCardList />
      </View>
      <View
        style={[
          styles.listContainer,
          { width: Dimensions.get("screen").width },
        ]}
      >
        <VerticalGroupList />
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
