import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../constants/colors";
import { useCheckoutContext } from "../../contexts/CheckoutContext";

const AddressDetailsForm = () => {
  const { addressData, onAddAddress } = useCheckoutContext();
  const {
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: addressData.address,
      zipCode: addressData.zipCode,
    },
  });

  const saveToContext = () => {
    const values = getValues();
    onAddAddress(values);
  };

  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: true,
          maxLength: 50,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            editable
            placeholder="STREET NAME  NUMBER"
            onBlur={onBlur}
            onChangeText={(e) => {
              onChange(e);
              saveToContext();
            }}
            value={value}
            style={styles.input}
            multiline={true}
            numberOfLines={4}
          />
        )}
        name="address"
      />
      {errors.address && (
        <Text style={styles.errorText}>{errors.address.message}</Text>
      )}
      <Controller
        control={control}
        rules={{
          required: true,
          maxLength: 50,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="ZIP CODE"
            onBlur={onBlur}
            onChangeText={(e) => {
              onChange(e);
              saveToContext();
            }}
            value={value === 0 ? "" : value.toString()}
            style={styles.input}
            keyboardType="numeric"
            maxLength={5}
          />
        )}
        name="zipCode"
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
