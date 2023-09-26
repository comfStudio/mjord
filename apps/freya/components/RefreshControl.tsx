import { useMemo } from "react";
import { RefreshControl as NativeRefreshControl } from "react-native";

import { useTheme } from "@app/styles/theme";
import t from "@mjord/common/lib/lang";

export default function RefreshControl(props: NativeRefreshControl["props"]) {
  const theme = useTheme();

  const stylepProps = useMemo(
    (): Partial<NativeRefreshControl["props"]> => ({
      tintColor: theme.colors.primary,
      colors: theme.colors.primary ? [theme.colors.primary] : undefined,
      progressBackgroundColor: theme.colors.secondaryBackground,
      titleColor: theme.colors.text,
    }),
    [theme]
  );

  return <NativeRefreshControl title={t`Refetching...`} {...stylepProps} {...props} />;
}
