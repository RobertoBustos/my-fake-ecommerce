import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput } from "react-native";
import { useStyles } from "react-native-unistyles";
import { ZodType, z } from "zod";
import { UserType } from "../../constants/types";
import { PHONE_PATTERN } from "../../constants/validation";
import { useOrderContext } from "../../contexts/OrderContext";
import { useAppDispatch } from "../../redux/hooks";
import { setCustomerData } from "../../redux/order/reducer";
import userDetailsFormStyleSheet from "../../styles/components/UserDetailsForm";
import CustomCard from "../common/CustomCard";

const validationSchema = z.object({
  email: z.email({ error: "Invalid email" }).toLowerCase(),
  name: z
    .string()
    .min(4, { error: "Your name must contain from 4 up to 60 characters" })
    .max(60, { error: "Your name must contain from 4 up to 60 characters" }),
  phone: z.string().regex(PHONE_PATTERN, {
    error: "Your phone number must contain 10 to 15 digits, with an optional + at the start",
  }),
}) satisfies ZodType<UserType>;

const UserDetailsForm = () => {
  const dispatch = useAppDispatch();
  const { styles, theme } = useStyles(userDetailsFormStyleSheet);
  const { orderData } = useOrderContext();

  const {
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm<UserType>({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
    },
    resolver: zodResolver(validationSchema),
    mode: "all",
  });

  const saveToStore = () => {
    const values = getValues();
    dispatch(setCustomerData(values));
  };

  const getInputStyles = useCallback(
    (error?: string) => {
      if (error) {
        return { ...styles.input, borderColor: theme.colors.error };
      }
      return styles.input;
    },
    [styles.input, theme.colors.error]
  );

  useEffect(() => {
    if (!orderData || orderData.customer === null) return;
    reset(orderData.customer);
    return () => {};
  }, [orderData, reset]);

  return (
    <CustomCard testID="UserDetailsForm.Container">
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value, name } }) => (
          <TextInput
            inputMode="email"
            placeholder="EMAIL"
            onBlur={onBlur}
            onChangeText={(e) => {
              onChange(e);
              saveToStore();
            }}
            value={value}
            style={getInputStyles(errors.email?.message)}
            placeholderTextColor={theme.colors.typography}
            testID="UserDetailsForm.EmailInput"
          />
        )}
      />
      {errors.email && (
        <Text style={styles.errorText} testID="UserDetailsForm.EmailErrorText">
          {errors.email?.message}
        </Text>
      )}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            inputMode="text"
            placeholder="FIRST NAME, LAST NAME"
            onBlur={onBlur}
            onChangeText={(e) => {
              onChange(e);
              saveToStore();
            }}
            value={value}
            style={getInputStyles(errors.name?.message)}
            placeholderTextColor={theme.colors.typography}
            testID="UserDetailsForm.NameInput"
          />
        )}
      />
      {errors.name && (
        <Text style={styles.errorText} testID="UserDetailsForm.NameErrorText">
          {errors.name.message}
        </Text>
      )}
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            inputMode="tel"
            keyboardType="phone-pad"
            placeholder="PHONE NUMBER"
            onBlur={onBlur}
            onChangeText={(e) => {
              onChange(e);
              saveToStore();
            }}
            value={value}
            style={getInputStyles(errors.phone?.message)}
            placeholderTextColor={theme.colors.typography}
            testID="UserDetailsForm.PhoneInput"
          />
        )}
      />
      {errors.phone && (
        <Text style={styles.errorText} testID="UserDetailsForm.PhoneErrorText">
          {errors.phone.message}
        </Text>
      )}
    </CustomCard>
  );
};

export default UserDetailsForm;
