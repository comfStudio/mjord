import { useState } from "react";
import { TouchableOpacity } from "react-native";

import Label from "@/components/Label";

import MapModal from "./MapModal";

export default function LocationLabel({
  data,
  ...props
}: {
  data: {
    location_name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
} & Omit<React.ComponentProps<typeof Label>, "value" | "icon">) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <MapModal
        visible={visible}
        latitude={data?.latitude ?? 0}
        longitude={data?.longitude ?? 0}
        onClose={() => setVisible(false)}
      />
      <TouchableOpacity onPress={() => setVisible(false)}>
        <Label {...props} value={data?.location_name ?? data?.address ?? "Unknown"} icon="location-on" />
      </TouchableOpacity>
    </>
  );
}
