import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import { ProductType } from "../constants/types";
import useAppNavigation from "../hooks/useAppNavigation";
import { setSelectedProductId } from "../redux/cart/reducer";
import { useAppDispatch } from "../redux/hooks";
import catalogItemCardStyleSheet from "../styles/components/CatalogItemCard";
import { formatCurrency } from "../utils/formatCurrency";
import CustomCard from "./common/CustomCard";
import CustomImage from "./common/CustomImage";

export type CatalogItemCardPropsType = {
  data: ProductType;
  disabled?: boolean;
};

const CatalogItemCard = ({ data, disabled }: CatalogItemCardPropsType) => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const { styles } = useStyles(catalogItemCardStyleSheet);

  return (
    <CustomCard
      orientation="horizontal"
      onPress={() => {
        dispatch(setSelectedProductId(data.id));
        navigation.navigate("Product", { productId: data.id });
      }}
      disabled={disabled}
      testID={`CatalogItemCard.CardContainer-${data.id}`}
    >
      <View
        style={styles.description}
        testID={`CatalogItemCard.CardDescription-${data.id}`}
      >
        <Text style={styles.title} testID={`CatalogItemCard.Title-${data.id}`}>
          {data.title}
        </Text>
        <Text style={styles.price} testID={`CatalogItemCard.Price-${data.id}`}>
          {formatCurrency(data.unitPrice, data.currency)}
        </Text>
      </View>
      <CustomImage
        imageUrl={data.image}
        width={120}
        height={120}
        testID={`CatalogItemCard.CardImage-${data.id}`}
      />
    </CustomCard>
  );
};

export default CatalogItemCard;
