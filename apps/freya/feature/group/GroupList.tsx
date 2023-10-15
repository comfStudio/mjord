import React from "react";
import { TouchableOpacity } from "react-native";
import { useSetRecoilState } from "recoil";

import ListItem from "@/components/ListItem";
import VerticalList, { VerticalLoadMoreList } from "@/components/VerticalList";
import { GroupState } from "@/state";
import { GroupWithMediaData } from "@mjord/edge/db";

export default function GroupListItem({
  data,
  onPress,
}: {
  data: GroupWithMediaData;
  onPress?: React.ComponentProps<typeof TouchableOpacity>["onPress"];
}) {
  const setGroup = useSetRecoilState(GroupState.currentGroupDetail);

  return (
    <ListItem
      image
      title={data.title}
      imageUrl={data?.primary_media?.url}
      description={data?.description}
      onPress={
        onPress ??
        ((e) => {
          e.preventDefault();
          console.debug("Setting group", data);
          setGroup(data);
        })
      }
    />
  );
}

export function VerticalGroupList({
  data,
  onPress,
}: {
  data: GroupWithMediaData[];
  onPress?: React.ComponentProps<typeof GroupListItem>["onPress"];
}) {
  return <VerticalList data={data} renderItem={({ item }) => <GroupListItem data={item} onPress={onPress} />} />;
}

export function VerticalLoadMoreGroupList({
  data,
  onPress,
  ...props
}: {
  data: GroupWithMediaData[];
  onPress?: React.ComponentProps<typeof GroupListItem>["onPress"];
} & Omit<React.ComponentProps<typeof VerticalLoadMoreList>, "renderItem" | "data">) {
  return (
    <VerticalLoadMoreList
      {...props}
      data={data ?? []}
      renderItem={(item) => <GroupListItem data={item} onPress={onPress} />}
    />
  );
}
