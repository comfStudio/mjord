import * as Sharing from 'expo-sharing';
import React from 'react';
import { StyleSheet } from 'react-native';

import { t } from '@mjord/common';

import Button from '../../components/Button';

export default function ShareButton({
  url,
  ...props
}: { url: string } & Omit<
  React.ComponentProps<typeof Button>,
  "onPress" | "icon"
>) {
  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        alert(t`Sharing is not available on this device`);
        return;
      }

      await Sharing.shareAsync(url);
    } catch (error) {
      console.error("An error occurred while sharing:", error);
    }
  };

  return <Button {...props} onPress={handleShare} icon="share" />;
}

const styles = StyleSheet.create({
  shareButton: {
    backgroundColor: "#2196F3",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
