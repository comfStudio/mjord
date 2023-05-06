import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useRecoilState } from "recoil";

import { t } from "@mjord/common";

import { Input } from "../../../components/Input";
import constant, { ServiceType } from "../../../constants";
import { UserState } from "../../../state";

enum Error {
  None = "",
  InvalidToken = "Invalid token",
  MissingEmail = "Missing email",
}

export default function OnboardScreen() {
  const router = useRouter();

  const [loginState, setLoginState] = useRecoilState(UserState.loginState);

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
      router.push("user");
    }
  }, [token, loginState]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t`Welcome to HYG!`}</Text>
      <Text style={styles.emailText}>{loginState?.email}</Text>
      <Input
        style={styles.tokenInput}
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
  emailText: {
    width: "80%",
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
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
