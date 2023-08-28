import * as Sharing from 'expo-sharing';
import React from "react";

import Button from "@/components/Button";
import { createComponent } from "@app/components";
import { IconVariant } from "@app/components/Icon";
import constant from "@app/constants";
import { composeStyles, createStyles, useStyles } from "@app/styles/theme";
import { t } from '@mjord/common';

const ShareButton = createComponent(function ShareButton(
  {
    url,
    style,
    ...props
  }: { url: string } & Omit<
    React.ComponentProps<typeof Button>,
    "onPress" | keyof IconVariant
  >,
  ref
) {
  const stl = useStyles(styles);

  const compStyles = composeStyles(
    stl,
    {
      base: true,
    },
    style
  );

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        alert(t`Sharing is not available on this device`);
        return;
      }

      await Sharing.shareAsync(url);
    } catch (error) {
      constant.log.e("An error occurred while sharing:", error);
    }
  };

  return (
    <Button
      {...props}
      ref={ref}
      onPress={handleShare}
      iconName="share"
      style={compStyles}
    />
  );
});

export default ShareButton;

const styles = createStyles((t) => ({
  base: {},
  // text: {
  //   fontWeight: "bold",
  //   fontSize: 16,
  // },
}));
