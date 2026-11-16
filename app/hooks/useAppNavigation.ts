import { NavigationProp } from "expo-router/react-navigation";
import { useNavigation } from "expo-router";
import { RootStackParamList } from "../constants/types";

const useAppNavigation = () => {
    return useNavigation<NavigationProp<RootStackParamList>>();
}
export default useAppNavigation