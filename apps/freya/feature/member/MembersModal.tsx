import { ScrollView, StyleSheet } from "react-native";

import Modal from "@/components/Modal";
import { useGroupMembers } from "@/services/group";

import MemberList from "./MemberList";

export default function MembersModal({
  groupId,
  visible,
  onClose,
}: {
  groupId: number;
  visible?: boolean;
  onClose?: () => void;
}) {
  const { data, error } = useGroupMembers(groupId, 0, 10);

  return (
    <Modal style={styles.container} visible={visible} onClose={onClose}>
      <ScrollView style={styles.scrollView}>
        <MemberList data={data ?? []} />
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: "50%",
  },
  scrollView: {
    flex: 1,
  },
});
