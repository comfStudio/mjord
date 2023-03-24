import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRecoilState } from "recoil";

import { Ionicons } from "@expo/vector-icons";

import Button from "../components/Button";
import DrawerSheet from "../components/DrawerSheet";
import { GroupState } from "../state";

export default function GroupDetailDrawer() {
  const [group, setGroup] = useRecoilState(GroupState.currentGroupDetail);

  const router = useRouter();

  const handleCloseDrawer = () => {
    setGroup(null);
  };

  const goToDetail = () => {
    router.push("/detail");
    handleCloseDrawer();
  };

  const handleHeaderPress = () => {
    goToDetail();
  };

  const handleIconPress = () => {
    goToDetail();
  };

  const handleMoreDetailsPress = () => {
    goToDetail();
  };

  return (
    <DrawerSheet isVisible={!!group} onClose={handleCloseDrawer}>
      <TouchableOpacity style={styles.header} onPress={handleHeaderPress}>
        <Image
          style={styles.image}
          source={{
            uri: group?.imageUrl ?? "https://placeimg.com/200/200/architecture",
          }}
        />
        <Text style={styles.title}>{group?.title}</Text>
        <TouchableOpacity onPress={handleIconPress}>
          <Ionicons name="ios-arrow-forward" size={24} color="black" />
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.description}>{group?.description}</Text>
        <Button value="More details" onPress={handleMoreDetailsPress} />
      </View>
    </DrawerSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#666",
  },
});
