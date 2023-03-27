import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { t } from "@mjord/common";

// Mock user data
const userData = {
  name: "John Doe",
  profilePicture: "https://example.com/profile-picture.jpg",
  groups: [
    { id: 1, name: "Group 1" },
    { id: 2, name: "Group 2" },
    // Add more groups...
  ],
};

export default function UserScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: userData.profilePicture }}
          style={styles.profilePicture}
        />
        <Text style={styles.userName}>{userData.name}</Text>
      </View>

      <Text style={styles.sectionTitle}>{t`Joined Groups`}</Text>
      {/* <GroupList groups={userData.groups} />  */}

      <TouchableOpacity style={styles.settingsButton}>
        <MaterialIcons name="settings" size={24} />
        <Text style={styles.settingsButtonText}>Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginVertical: 8,
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  settingsButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
});
