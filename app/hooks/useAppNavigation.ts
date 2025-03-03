import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { RootStackParamList } from "../constants/types";

export const useAppNavigation = () => {
    return useNavigation<NavigationProp<RootStackParamList>>();
}