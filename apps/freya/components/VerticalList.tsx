import { FlatList, ListRenderItem as ListRenderItemFlat } from "react-native";

import { FlashList, ListRenderItem } from "@shopify/flash-list";

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
