import { FlatList, ListRenderItem, StyleSheet } from "react-native";



export function HorizontalCardList<T extends { id: any }>({
  data,
  renderItem,
}: {
  data: T[];
  renderItem: ListRenderItem<T>;
}) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.cardList}
    />
  );
}

const styles = StyleSheet.create({
  cardList: {
    paddingHorizontal: 16,
  },
});
