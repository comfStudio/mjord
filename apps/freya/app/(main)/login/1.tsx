import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRecoilState } from "recoil";

import Button from "@/components/Button";
import { IconInput } from "@/components/Input";
import Segment from "@/components/Segment";
import { UserHelpers } from "@/services/user";
import { UserState } from "@/state";
import constant, { ROUTES, ServiceType } from "@app/constants";
import { useInputData } from "@app/misc/form";
import { useToggle } from "@app/misc/hooks";
import { loginSchema1 } from "@app/schemas/login";
import { t } from "@mjord/common";

function AcceptedDomainsSegment() {
  return (
    <Segment style={styles.acceptedDomains}>
      <Text
        style={styles.acceptedDomainsTitle}
      >{t`We currently only accept signups from the following domains:`}</Text>
      <Text style={styles.acceptedDomainsText}>
        {UserHelpers.validEmailDomains.join(", ")}
      </Text>
    </Segment>
  );
}

export default function Login1Screen() {
  const router = useRouter();

  const [loginState, setLoginState] = useRecoilState(UserState.loginState);

  const { control, handleSubmit, errors, isValid } = useInputData({
    schema: loginSchema1.default({ email: loginState?.email ?? "" }),
  });

  const [loginFailed, setLoginFailed] = useToggle();

  useEffect(() => {
    // since we were led here, we clear the login state
    setLoginState({ email: "" });
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setLoginFailed(false);

    const { email } = data;
    const service = constant.service.get(ServiceType.User);

    setLoginState((prev) => ({
      ...prev,
      email,
    }));

    const { error } = await service.login(email);

    if (error) {
      setLoginFailed(true);
      constant.log.e(error);
    } else {
      router.push(ROUTES.LOGIN_2);
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
        <Text style={styles.title}>{t`Continue with your student email`}</Text>
        <IconInput
          control={control}
          name="email"
          icon="mail"
          style={styles.emailInput}
          viewStyle={styles.emailInputView}
          keyboardType="email-address"
          placeholder={t`Email`}
        />
        {loginFailed && (
          <Text
            style={styles.errorSegmentText}
          >{t`Failed to login. Try again later.`}</Text>
        )}
        {errors?.email?.message &&
          (errors?.email?.message === "domain" ? (
            <AcceptedDomainsSegment />
          ) : (
            <Text style={styles.errorSegmentText}>
              {errors?.email?.message}
            </Text>
          ))}
        <Button
          primary
          disabled={!isValid}
          icon="arrow-forward"
          style={styles.loginButton}
          onPress={onSubmit}
        />
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
    fontSize: 24,
    marginBottom: 30,
  },
  emailInput: {
    width: "80%",
  },
  emailInputView: {
    marginBottom: 10,
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

  acceptedDomains: {
    textAlign: "center",
    width: "80%",
    marginTop: 10,
    marginBottom: 10,
  },

  acceptedDomainsTitle: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  acceptedDomainsText: {
    marginTop: 10,
    color: "#000",
    textAlign: "center",
  },
});
