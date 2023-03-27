import { useState } from "react";
import {
  FlatList,
  ListRenderItem as ListRenderItemFlat,
  StyleSheet,
  View,
} from "react-native";

import { FlashList, ListRenderItem } from "@shopify/flash-list";

import Button from "./Button";

export function VirtualizedVerticalList<T extends { id: any }>({
  data,
  renderItem,
}: {
  data: T[];
  renderItem: ListRenderItem<T>;
}) {
  return (
    <FlashList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      estimatedItemSize={10}
    />
  );
}

export default function VerticalList<T extends { id: any }>({
  data,
  renderItem,
}: {
  data: T[];
  renderItem: ListRenderItemFlat<T>;
}) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
}

function VerticalLoadMoreListRenderItem<T extends { id: any }>({
  item,
  renderItem,
}: {
  item: T;
  renderItem: (item: T) => JSX.Element;
}) {
  return renderItem(item);
}

export function VerticalLoadMoreList<T extends { id: any }>({
  data,
  renderItem,
  pageSize = 5,
  initialPageSize,
  onShowMore,
  style,
}: {
  data: T[];
  renderItem: (item: T) => JSX.Element;
  onShowMore?: () => void;
  initialPageSize?: number;
  pageSize?: number;
  style?: React.ComponentProps<typeof View>["style"];
}) {
  const [itemsToShow, setItemsToShow] = useState(initialPageSize ?? pageSize);

  const handleLoadMore = () => {
    setItemsToShow((prev) => prev + pageSize);

    onShowMore?.();
  };

  const displayedItems = data.slice(0, itemsToShow);

  return (
    <View style={[style]}>
      {displayedItems.map((item) => (
        <VerticalLoadMoreListRenderItem
          key={item.id}
          item={item}
          renderItem={renderItem}
        />
      ))}
      {itemsToShow < data.length && (
        <View style={styles.loadMoreButtonContainer}>
          <Button
            value="Show more"
            onPress={handleLoadMore}
            secondary
            size="small"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadMoreButtonContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
});
