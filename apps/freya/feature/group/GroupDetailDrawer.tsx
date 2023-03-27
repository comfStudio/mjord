import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRecoilState } from 'recoil';

import { Ionicons } from '@expo/vector-icons';
import { t } from '@mjord/common';

import Button from '../../components/Button';
import DrawerSheet from '../../components/DrawerSheet';
import { ImageSkeleton } from '../../components/Skeleton';
import { GroupState } from '../../state';

export default function GroupDetailDrawer() {
  const [group, setGroup] = useRecoilState(GroupState.currentGroupDetail);

  const router = useRouter();

  const handleCloseDrawer = () => {
    setGroup(null);
  };

  const goToDetail = () => {
    router.push({
      pathname: "/detail",
      params: {
        id: group?.id,
      },
    });
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
        <ImageSkeleton width={48} height={48} style={styles.image}>
          <Image
            style={styles.image}
            source={{
              uri: group?.primary_media?.url,
            }}
          />
        </ImageSkeleton>
        <Text style={styles.title}>{group?.title}</Text>
        <TouchableOpacity onPress={handleIconPress}>
          <Ionicons name="ios-arrow-forward" size={24} color="black" />
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.description}>{group?.description} hello world</Text>
        <Button value={t`More details`} onPress={handleMoreDetailsPress} />
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
    marginVertical: 16,
    fontSize: 16,
    color: "#666",
  },
});
