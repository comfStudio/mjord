import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRecoilState } from "recoil";

import { t } from "@mjord/common";

import Button from "../../components/Button";
import { ButtonInput } from "../../components/Input";
import constant, { ServiceType } from "../../constants";
import { UserState } from "../../state";

enum Error {
  None = "",
  InvalidToken = "Invalid token",
  MissingEmail = "Missing email",
  ResendFail = "Failed to resend token",
}

export default function Login2Screen() {
  const router = useRouter();

  const [loginState, setLoginState] = useRecoilState(UserState.loginState);

  const [resent, setResent] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState(Error.None);

  const handleTokenChange = (text) => {
    setToken(text);
  };

  const onLogin = useCallback(async () => {
    if (!token.length) {
      setError(Error.InvalidToken);
      return;
    }

    if (!loginState?.email) {
      setError(Error.MissingEmail);
      return;
    }

    setError(Error.None);

    const service = constant.service.get(ServiceType.User);

    const { error } = await service.verifyLogin(loginState?.email, token);

    if (error) {
      setError(Error.InvalidToken);
      console.error(error);
    } else {
      router.push("/user");
    }
  }, [token, loginState]);

  const onResend = useCallback(async () => {
    const service = constant.service.get(ServiceType.User);

    const { error } = await service.login(loginState?.email);

    if (error) {
      setError(Error.ResendFail);
      console.error(error);
    } else {
      setResent(true);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
      >{t`We've sent a magic code to your email!`}</Text>
      <View style={styles.emailView}>
        <Text style={styles.emailText}>{loginState?.email}</Text>
        <Button
          size="small"
          secondary
          value={t`Change`}
          onPress={() => {
            router.push("/login/1");
          }}
        />
      </View>
      <ButtonInput
        style={styles.tokenInput}
        onPress={onResend}
        buttonValue={resent ? undefined : t`Resend`}
        ButtonIcon={resent ? "check" : undefined}
        onChangeText={handleTokenChange}
        value={token}
        keyboardType="number-pad"
        placeholder={t`Code`}
      />
      {error === Error.MissingEmail && (
        <Text style={styles.errorSegmentText}>{t`Missing email`}</Text>
      )}
      {error === Error.InvalidToken && (
        <Text
          style={styles.errorSegmentText}
        >{t`Code has expired or is invalid`}</Text>
      )}
      {error === Error.ResendFail && (
        <Text
          style={styles.errorSegmentText}
        >{t`Failed to resend magic code. Try again later.`}</Text>
      )}
      <Button
        primary
        disabled={!token.length}
        icon="arrow-forward"
        style={styles.loginButton}
        onPress={onLogin}
      />
    </View>
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
