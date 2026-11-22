import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { selectCartItems } from "../redux/cart/selectors";
import { useAppSelector } from "../redux/hooks";
import styles from "../styles/components/ShoppingCartHeaderIcon";

type ShoppingCartHeaderIconPropsType = {
  onPress?: () => void;
};

const ShoppingCartHeaderIcon = ({
  onPress,
}: ShoppingCartHeaderIconPropsType) => {
  const { theme } = useUnistyles();
  const { length } = useAppSelector(selectCartItems);

  return (
    <Pressable onPress={onPress} testID="ShoppingCartHeaderIcon.Button">
      <View style={styles.container}>
        <FontAwesome
          name="shopping-cart"
          size={30}
          color={theme.colors.onPrimary}
        />
        {length > 0 ? (
          <View style={styles.notificationContainer}>
            <Text
              style={styles.notificationText}
              testID="ShoppingCartHeaderIcon.Count"
            >
              {length}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

export default ShoppingCartHeaderIcon;
