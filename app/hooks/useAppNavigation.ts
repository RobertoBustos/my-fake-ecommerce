import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../constants/types";

const useAppNavigation = () => {
    return useNavigation<NavigationProp<RootStackParamList>>();
}
export default useAppNavigation