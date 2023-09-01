import { useState } from 'react';
import {
  FlatList,
  ListRenderItem as ListRenderItemFlat,
  StyleSheet,
  View,
} from 'react-native';

import { FlashList, ListRenderItem } from '@shopify/flash-list';

import Button from './Button';
import Segment from "./Segment";

export function VirtualizedVerticalList<
  T extends Record<string, any> = { id: any }
>({
  data,
  renderItem,
  keyExtractor = (item) => item.id,
}: {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
}) {
  return (
    <FlashList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      estimatedItemSize={10}
    />
  );
}

export default function VerticalList<
  T extends Record<string, any> = { id: any }
>({
  data,
  renderItem,
  keyExtractor = (item) => item?.id,
}: {
  data: T[];
  renderItem: ListRenderItemFlat<T>;
  keyExtractor?: (item: T, index: number) => string;
}) {
  return (
    <FlatList data={data} keyExtractor={keyExtractor} renderItem={renderItem} />
  );
}

function VerticalLoadMoreListRenderItem<
  T extends Record<string, any> = { id: any }
>({ item, renderItem }: { item: T; renderItem: (item: T) => JSX.Element }) {
  return renderItem(item);
}

export function VerticalLoadMoreList<
  T extends Record<string, any> = { id: any }
>({
  data,
  renderItem,
  pageSize = 5,
  initialPageSize,
  onShowMore,
  keyExtractor = (item) => item?.id,
  style,
}: {
  data: T[];
  renderItem: (item: T) => JSX.Element;
  onShowMore?: () => void;
  keyExtractor?: (item: T) => string;
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
    <Segment transparent style={[style]}>
      {displayedItems.map((item) => (
        <VerticalLoadMoreListRenderItem
          key={keyExtractor?.(item)}
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
            size="sm"
          />
        </View>
      )}
    </Segment>
  );
}

const styles = StyleSheet.create({
  loadMoreButtonContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
});
