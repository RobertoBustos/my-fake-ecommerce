import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput } from "react-native";
import { ZodType, z } from "zod";
import { colors } from "../../constants/colors";
import { AddressType } from "../../constants/types";
import { useAppDispatch } from "../../redux/hooks";
import { setAddressData } from "../../redux/order/reducer";
import CustomCard from "../common/CustomCard";

const validationSchema: ZodType<AddressType> = z.object({
  address: z.string().min(1, { message: "Address required" }),
  zipCode: z
    .string()
    .min(5, { message: "Zipcode must contain exact 5 characters" })
    .max(5, { message: "Zipcode must contain exact 5 characters" }),
});

export type AddressDetailsFormPropsType = {
  data: { address: string; zipCode: string };
  isLoading?: boolean;
};

const AddressDetailsForm = ({
  data,
  isLoading,
}: AddressDetailsFormPropsType) => {
  const dispatch = useAppDispatch();

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm<AddressType>({
    defaultValues: {
      address: data.address,
      zipCode: data.zipCode,
    },
    resolver: zodResolver(validationSchema),
    mode: "all",
  });

  const saveToStore = () => {
    const values = getValues();
    dispatch(setAddressData(values));
  };

  return (
    <CustomCard
      headerText="Address Details"
      isLoading={isLoading}
      testID="AddressDetailsForm.Container"
    >
      <Controller
        control={control}
        name="address"
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            inputMode="text"
            placeholder="STREET NAME  NUMBER"
            onBlur={onBlur}
            onChangeText={(e) => {
              onChange(e);
              saveToStore();
            }}
            value={value}
            style={styles.input}
            multiline={true}
            numberOfLines={4}
            placeholderTextColor={colors.dark}
            testID="AddressDetailsForm.AddressInput"
          />
        )}
      />
      {errors.address && (
        <Text
          style={styles.errorText}
          testID="AddressDetailsForm.AddressErrorText"
        >
          {errors.address.message}
        </Text>
      )}
      <Controller
        control={control}
        name="zipCode"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            inputMode="numeric"
            keyboardType="numeric"
            placeholder="ZIP CODE"
            onBlur={onBlur}
            onChangeText={(e) => {
              onChange(e);
              saveToStore();
            }}
            value={value}
            style={styles.input}
            placeholderTextColor={colors.dark}
            testID="AddressDetailsForm.ZipCodeInput"
          />
        )}
      />
      {errors.zipCode && (
        <Text
          style={styles.errorText}
          testID="AddressDetailsForm.ZipCodeErrorText"
        >
          {errors.zipCode.message}
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
    minHeight: 40,
    paddingHorizontal: 8,
    backgroundColor: colors.light,
    marginVertical: 4,
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
  },
});

export default AddressDetailsForm;
