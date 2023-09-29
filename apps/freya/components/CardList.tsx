import { FlatList, ListRenderItem, StyleSheet } from "react-native";

import constant from "@app/constants";

export function HorizontalCardList<T extends { id: any }>({
  data,
  renderItem,
}: {
  data: T[];
  renderItem: ListRenderItem<T>;
}) {
  constant.log.d(JSON.stringify(data.map((item) => item.id)));
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
