import { StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

import Modal from "@/components/Modal";

export default function MapModal({
  visible,
  latitude,
  longitude,
  onClose,
}: {
  visible?: boolean;
  latitude: number;
  longitude: number;
  onClose?: () => void;
}) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 200,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
