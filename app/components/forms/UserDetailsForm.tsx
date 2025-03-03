import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../constants/colors";
import { useCheckoutContext } from "../../contexts/CheckoutContext";

const UserDetailsForm = () => {
  const { userData, onAddUser, setIsValidUser } = useCheckoutContext();
  const {
    control,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
    },
  });

  const saveToContext = () => {
    const values = getValues();
    onAddUser(values);
  };

  useEffect(() => {
    setIsValidUser(isValid);
  }, [isValid]);

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
            placeholder="FIRST NAME"
            onBlur={onBlur}
            onChangeText={(e) => {
              onChange(e);
              saveToContext();
            }}
            value={value}
            style={styles.input}
          />
        )}
        name="firstName"
      />
      {errors.firstName && (
        <Text style={styles.errorText}>{errors.firstName.message}</Text>
      )}
      <Controller
        control={control}
        rules={{
          required: true,
          maxLength: 50,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="LAST NAME"
            onBlur={onBlur}
            onChangeText={(e) => {
              onChange(e);
              saveToContext();
            }}
            value={value}
            style={styles.input}
          />
        )}
        name="lastName"
      />
      {errors.lastName && (
        <Text style={styles.errorText}>{errors.lastName.message}</Text>
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
    height: 40,
    paddingHorizontal: 8,
    backgroundColor: colors.light,
    marginVertical: 4,
    fontSize: 16,
  },
  errorText: {
    color: colors.errorText,
  },
});

export default UserDetailsForm;
