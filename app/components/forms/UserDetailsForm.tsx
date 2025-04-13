import userDetailsFormStyleSheet from "@/app/styles/components/UserDetailsForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput } from "react-native";
import { useStyles } from "react-native-unistyles";
import { ZodType, z } from "zod";
import { UserType } from "../../constants/types";
import { useAppDispatch } from "../../redux/hooks";
import { setCustomerData } from "../../redux/order/reducer";
import CustomCard from "../common/CustomCard";

const validationSchema: ZodType<UserType> = z.object({
  email: z.string().email({ message: "Invalid email" }).toLowerCase(),
  name: z
    .string()
    .min(4, { message: "Your name must contain from 4 up to 60 characters" })
    .max(60, { message: "Your name must contain from 4 up to 60 characters" }),
  phone: z
    .string()
    .min(10, { message: "Your phone number must contain 10 digits" })
    .max(10, { message: "Your phone number must contain 10 digits" }),
});

export type UserDetailsFormPropsType = {
  data: UserType;
  isLoading?: boolean;
};

const UserDetailsForm = ({ data, isLoading }: UserDetailsFormPropsType) => {
  const dispatch = useAppDispatch();
  const { styles, theme } = useStyles(userDetailsFormStyleSheet);

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm<UserType>({
    defaultValues: {
      email: data.email,
      name: data.name,
      phone: data.phone,
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

  return (
    <CustomCard isLoading={isLoading} testID="UserDetailsForm.Container">
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
            inputMode="numeric"
            keyboardType="numeric"
            placeholder="PHONE NUMBER"
            onBlur={onBlur}
            onChangeText={(e) => {
              onChange(e);
              saveToStore();
            }}
            value={value}
            style={getInputStyles(errors.phone?.message)}
            placeholderTextColor={theme.colors.typography}
            testID="AddressDetailsForm.ZipCodeInput"
          />
        )}
      />
      {errors.phone && (
        <Text
          style={styles.errorText}
          testID="AddressDetailsForm.ZipCodeErrorText"
        >
          {errors.phone.message}
        </Text>
      )}
    </CustomCard>
  );
};

export default UserDetailsForm;
