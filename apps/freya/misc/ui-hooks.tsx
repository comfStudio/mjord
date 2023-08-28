import { MaterialIcons } from '@expo/vector-icons';

type IconNames = React.ComponentProps<typeof MaterialIcons>["name"];

const t: IconNames = "check";

export type IconProp = React.ReactNode | IconNames;

export function useOptionalIconElement({
  icon,
  style,
}: {
  icon?: IconProp;
  style?: React.ComponentProps<typeof MaterialIcons>["style"];
}) {
  let iconEl: React.ReactNode;

  if (typeof icon === "string") {
    iconEl = <MaterialIcons style={style} name={icon as IconNames} />;
  } else {
    iconEl = icon;
  }

  return iconEl;
}
