import React, { useEffect } from 'react';
import {
  BackHandler,
  Modal as ModalNative,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function Modal({
  visible,
  onClose,
  children,
  style,
}: {
  visible?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  style?: React.ComponentProps<typeof View>["style"];
}) {
  useEffect(() => {
    if (!visible) return;
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [onClose]);

  if (!visible) return null;

  return (
    <ModalNative visible={visible} transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.modalContent, style]}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </ModalNative>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    width: "90%",
    maxHeight: "90%",
  },
});
