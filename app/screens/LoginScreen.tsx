import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TextInput } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { z } from "zod";
import FooterButton from "../components/FooterButton";
import Layout from "../components/Layout";
import CustomButton from "../components/common/CustomButton";
import CustomCard from "../components/common/CustomCard";
import CustomFooter from "../components/common/CustomFooter";
import { getAuthErrorMessage, useAuthContext } from "../contexts/AuthContext";
import useAppNavigation from "../hooks/useAppNavigation";
import { selectIsCartEmpty } from "../redux/cart/selectors";
import { useAppSelector } from "../redux/hooks";
import styles from "../styles/components/UserDetailsForm";

const validationSchema = z.object({
  email: z.email({ error: "Invalid email" }).toLowerCase(),
  password: z
    .string()
    .min(6, { error: "The password must contain at least 6 characters" }),
});

type CredentialsType = z.infer<typeof validationSchema>;

const LoginScreen = () => {
  const { theme } = useUnistyles();
  const { signIn, signUp } = useAuthContext();
  const navigation = useAppNavigation();
  const isCartEmpty = useAppSelector(selectIsCartEmpty);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CredentialsType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(validationSchema),
    mode: "all",
  });

  const getInputStyles = useCallback(
    (error?: string) => {
      if (error) {
        return [styles.input, { borderColor: theme.colors.error }];
      }
      return styles.input;
    },
    [theme.colors.error]
  );

  const authenticate = async ({ email, password }: CredentialsType) => {
    setIsProcessing(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      navigation.goBack();
    } catch (error) {
      setIsProcessing(false);
      Alert.alert(getAuthErrorMessage(error));
    }
  };

  // Creating an account keeps the cart, signing in to an existing one changes the
  // user and the API has no way yet to move the cart to it (ECOMMOB-14)
  const submit = handleSubmit((credentials) => {
    if (isSignUp || isCartEmpty) {
      authenticate(credentials);
      return;
    }
    Alert.alert(
      "Your cart will be lost",
      "The items in your current cart do not move to an existing account.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => authenticate(credentials) },
      ]
    );
  });

  return (
    <Layout
      footerComponent={
        <CustomFooter>
          <FooterButton
            text={isSignUp ? "Create Account" : "Sign In"}
            onPress={submit}
            isLoading={isProcessing}
            disabled={!isValid || isProcessing}
            testID="LoginScreen.Footer"
          />
        </CustomFooter>
      }
      testID="LoginScreen.Layout"
    >
      <CustomCard testID="LoginScreen.Container">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              inputMode="email"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="EMAIL"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={getInputStyles(errors.email?.message)}
              placeholderTextColor={theme.colors.typography}
              testID="LoginScreen.EmailInput"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText} testID="LoginScreen.EmailErrorText">
            {errors.email?.message}
          </Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              secureTextEntry
              autoCapitalize="none"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              placeholder="PASSWORD"
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={submit}
              value={value}
              style={getInputStyles(errors.password?.message)}
              placeholderTextColor={theme.colors.typography}
              testID="LoginScreen.PasswordInput"
            />
          )}
        />
        {errors.password && (
          <Text
            style={styles.errorText}
            testID="LoginScreen.PasswordErrorText"
          >
            {errors.password?.message}
          </Text>
        )}
        <CustomButton
          onPress={() => setIsSignUp(!isSignUp)}
          disabled={isProcessing}
          buttonComponent={
            <Text style={{ color: theme.colors.typography }}>
              {isSignUp
                ? "Already have an account? Sign in"
                : "New here? Create an account"}
            </Text>
          }
          testID="LoginScreen.ToggleMode"
        />
      </CustomCard>
    </Layout>
  );
};

export default LoginScreen;
