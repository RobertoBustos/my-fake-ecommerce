import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ZodType, z } from "zod";
import { colors } from "../../constants/colors";
import { AddressType } from "../../constants/types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setShippingData } from "../../redux/order/reducer";
import { selectShippingData } from "../../redux/order/selectors";

const validationSchema: ZodType<AddressType> = z.object({
  address: z.string().min(1, { message: "Address required" }),
  zipCode: z
    .string()
    .min(5, { message: "Zipcode must contain exact 5 characters" })
    .max(5, { message: "Zipcode must contain exact 5 characters" }),
});

const AddressDetailsForm = () => {
  const dispatch = useAppDispatch();
  const shippingData = useAppSelector(selectShippingData());

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm<AddressType>({
    defaultValues: shippingData,
    resolver: zodResolver(validationSchema),
    mode: "all",
  });

  const saveToStore = () => {
    const values = getValues();
    dispatch(setShippingData(values));
  };

  return (
    <View>
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
          />
        )}
      />
      {errors.address && (
        <Text style={styles.errorText}>{errors.address.message}</Text>
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
          />
        )}
      />
      {errors.zipCode && (
        <Text style={styles.errorText}>{errors.zipCode.message}</Text>
      )}
    </View>
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
    color: colors.errorText,
  },
});

export default AddressDetailsForm;
