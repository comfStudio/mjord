import Label from "../../components/Label";

export default function LocationLabel({
  data,
}: {
  data: {
    location_name: string;
    address: string;
  };
}) {
  return (
    <Label
      value={data?.location_name ?? data?.address ?? "Unknown"}
      icon="location-on"
    />
  );
}
