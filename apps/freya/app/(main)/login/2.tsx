import { Tabs, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRecoilValue } from "recoil";

import Button from "@/components/Button";
import { ButtonInput } from "@/components/Input";
import { userRequireOnboarding } from "@/services/user";
import { UserState } from "@/state";
import constant, { ROUTES, ServiceType } from "@app/constants";
import { useInputData } from "@app/misc/form";
import { useToggle } from "@app/misc/hooks";
import { loginSchema2 } from "@app/schemas/login";
import { t } from "@mjord/common";

export default function Login2Screen() {
  const router = useRouter();

  const loginState = useRecoilValue(UserState.loginState);

  const [resent, setResent] = useState(false);

  const { control, handleSubmit, errors, isValid } = useInputData({
    schema: loginSchema2,
  });

  const [failed, setFailed] = useToggle([null, "login", "resend"]);

  useEffect(() => {
    if (!loginState?.email) {
      router.push(ROUTES.LOGIN_1);
    }
  }, [loginState]);

  const onLogin = handleSubmit(async (data) => {
    const { token } = data;

    setFailed(null);

    const service = constant.service.get(ServiceType.User);

    const { error } = await service.verifyLogin(loginState?.email, token);

    if (error) {
      setFailed("login");
      constant.log.e(error);
    } else {
      const profile = await service.getProfile();
      if (!profile) {
        constant.log.e("Failed to get profile after login");
        throw new Error("Failed to get profile after login");
      }
      userRequireOnboarding(profile) ? router.push(ROUTES.LOGIN_ONBOARDING) : router.push(ROUTES.USER);
    }
  });

  const onResend = useCallback(async () => {
    const service = constant.service.get(ServiceType.User);

    const { error } = await service.login(loginState?.email);

    if (error) {
      setFailed("resend");
      constant.log.e(error);
    } else {
      setResent(true);
    }
  }, []);

  return (
    <>
      <Tabs.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>{t`We've sent a magic code to your email!`}</Text>
        <View style={styles.emailView}>
          <Text style={styles.emailText}>{loginState?.email}</Text>
          <Button
            size="small"
            secondary
            value={t`Change`}
            onPress={() => {
              router.push(ROUTES.LOGIN_1);
            }}
          />
        </View>
        <ButtonInput
          name="token"
          control={control}
          style={styles.tokenInput}
          onPress={onResend}
          buttonValue={resent ? undefined : t`Resend`}
          ButtonIcon={resent ? "check" : undefined}
          keyboardType="number-pad"
          placeholder={t`Code`}
        />
        {failed === "login" && <Text style={styles.errorSegmentText}>{t`Code has expired or is invalid`}</Text>}
        {failed === "resend" && (
          <Text style={styles.errorSegmentText}>{t`Failed to resend magic code. Try again later.`}</Text>
        )}
        {errors?.token?.message && <Text style={styles.errorSegmentText}>{errors?.token?.message}</Text>}
        <Button primary disabled={!isValid} iconName="arrow-forward" style={styles.loginButton} onPress={onLogin} />
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
    marginBottom: 30,
    textAlign: "center",
  },
  emailView: {
    width: "80%",
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emailText: {
    fontSize: 16,
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
