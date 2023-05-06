import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRecoilState } from "recoil";

import { t } from "@mjord/common";

import Button from "../../components/Button";
import { IconInput } from "../../components/Input";
import Segment from "../../components/Segment";
import constant, { ServiceType } from "../../constants";
import { UserHelpers } from "../../services/user";
import { UserState } from "../../state";

enum Error {
  None = "",
  InvalidEmail = "Invalid email",
  InvalidDomain = "Invalid domain",
  LoginFail = "Failed to login",
}

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
  const [email, setEmail] = useState(loginState?.email ?? "");
  const [validEmail, setValidEmail] = useState(
    email ? UserHelpers.emailRegex.test(email) : false
  );
  const [error, setError] = useState(Error.None);

  // on mount
  useEffect(() => {
    // since we were led here, we clear the login state
    setLoginState({ email: "" });
  }, []);

  const handleEmailChange = useCallback((text) => {
    setEmail(text);
    setValidEmail(UserHelpers.emailRegex.test(text));
  }, []);

  const onSubmit = useCallback(async () => {
    if (validEmail) {
      const domain = email.split("@")[1];
      if (UserHelpers.validEmailDomains.includes(domain.toLocaleLowerCase())) {
        setError(Error.None);

        setLoginState({
          ...loginState,
          email,
        });

        const service = constant.service.get(ServiceType.User);

        const { error } = await service.login(email);

        if (error) {
          setError(Error.LoginFail);
          console.error(error);
        } else {
          router.push("/login/2");
        }
      } else {
        setError(Error.InvalidDomain);
      }
    } else {
      setError(Error.InvalidEmail);
    }
  }, [email, validEmail]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t`Continue with your student email`}</Text>
      <IconInput
        icon="mail"
        style={styles.emailInput}
        viewStyle={styles.emailInputView}
        onChangeText={handleEmailChange}
        value={email}
        keyboardType="email-address"
        placeholder={t`Email`}
      />
      {error === Error.LoginFail && (
        <Text
          style={styles.errorSegmentText}
        >{t`Failed to login. Try again later.`}</Text>
      )}
      {error === Error.InvalidEmail && (
        <Text style={styles.errorSegmentText}>{t`Invalid email`}</Text>
      )}
      {error === Error.InvalidDomain && <AcceptedDomainsSegment />}
      <Button
        primary
        disabled={!validEmail}
        icon="arrow-forward"
        style={styles.loginButton}
        onPress={onSubmit}
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
