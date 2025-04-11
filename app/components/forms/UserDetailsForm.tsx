import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput } from "react-native";
import { ZodType, z } from "zod";
import { colors } from "../../constants/colors";
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
});

export type UserDetailsFormPropsType = {
  data: { email: string; name: string };
  isLoading?: boolean;
};

const UserDetailsForm = ({ data, isLoading }: UserDetailsFormPropsType) => {
  const dispatch = useAppDispatch();

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm<UserType>({
    defaultValues: {
      email: data.email,
      name: data.name,
    },
    resolver: zodResolver(validationSchema),
    mode: "all",
  });

  const saveToStore = () => {
    const values = getValues();
    dispatch(setCustomerData(values));
  };

  return (
    <CustomCard
      headerText="User Details"
      isLoading={isLoading}
      testID="UserDetailsForm.Container"
    >
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
            style={styles.input}
            placeholderTextColor={colors.dark}
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
            style={styles.input}
            placeholderTextColor={colors.dark}
            testID="UserDetailsForm.NameInput"
          />
        )}
      />
      {errors.name && (
        <Text style={styles.errorText} testID="UserDetailsForm.NameErrorText">
          {errors.name.message}
        </Text>
      )}
    </CustomCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    alignItems: "center",
    width: "100%",
    height: 40,
    paddingHorizontal: 8,
    backgroundColor: colors.light,
    marginVertical: 4,
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
  },
});

export default UserDetailsForm;
