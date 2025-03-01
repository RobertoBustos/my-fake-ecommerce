import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToAsyncStorage = async (key: string, data: string) => {
    try {
        await AsyncStorage.setItem(key, data);
        return true
    } catch (error) {
        return false
    }
}

export const getFromAsyncStorage = async (key: string) => {
    try {
        const data = await AsyncStorage.getItem(key);
        return data
    } catch (error) {
        return null
    }
}