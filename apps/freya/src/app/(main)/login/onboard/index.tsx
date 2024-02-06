import { Tabs, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import Button from "@/components/Button";
import { Input } from "@/components/Input";
import constant, { ROUTES, ServiceType } from "@app/constants";
import { useInputData } from "@app/misc/form";
import { useToggle } from "@app/misc/hooks";
import { onboardSchema } from "@app/schemas/login";
import { t } from "@mjord/common";

export default function OnboardScreen() {
  const router = useRouter();

  const { control, handleSubmit, errors, isValid } = useInputData({
    schema: onboardSchema,
  });

  const [failed, setFailed] = useToggle();

  const onSubmit = handleSubmit(async (data) => {
    const { name } = data;
    setFailed(false);

    const service = constant.service.get(ServiceType.User);

    try {
      await service.updateProfile({
        name,
      });

      router.push(ROUTES.USER);
    } catch (error) {
      setFailed(true);
      constant.log.e(error);
    }
  });

  return (
    <>
      <Tabs.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        <Text style={styles.title}>{t`Welcome to HYG!`}</Text>
        <Text style={styles.subtitle}>{t`Let's fill out a couple of details`}</Text>
        <Text style={styles.header}>{t`Your profile name should be...`}</Text>
        <Input
          name="name"
          control={control}
          style={styles.tokenInput}
          keyboardType="default"
          placeholder={t`Profile name`}
        />
        {failed && <Text style={styles.errorSegmentText}>{t`Failed to update`}</Text>}
        <Button onPress={onSubmit} primary disabled={!isValid} iconName="arrow-forward" style={styles.loginButton} />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    width: "80%",
    fontSize: 24,
    marginBottom: 45,
    textAlign: "center",
  },
  subtitle: {
    fontWeight: "bold",
    width: "80%",
    fontSize: 18,
    marginBottom: 30,
    textAlign: "center",
  },
  header: {
    fontWeight: "normal",
    width: "80%",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "auto",
  },
  tokenInput: {
    width: "80%",
  },
  tokenInputView: {
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  errorSegmentText: {
    width: "80%",
    marginTop: 10,
    marginBottom: 10,
    color: "#f00",
    textAlign: "center",
  },
});
