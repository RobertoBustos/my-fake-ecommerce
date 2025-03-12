import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToAsyncStorage = async (key: string, data: string) => {
    try {
        await AsyncStorage.setItem(key, data);
        return true
    } catch {
        return false
    }
}

export const getFromAsyncStorage = async (key: string) => {
    try {
        const data = await AsyncStorage.getItem(key);
        return data
    } catch {
        return null
    }
}

export const searchObjectInAsyncStorage = async (storageKey: string, objectKey: string, value: string) => {
    const storage = await getFromAsyncStorage(storageKey)
    if (storage === null) {
        return undefined
    }
    const data = JSON.parse(storage)
    const object = data.find((element: any) => {
        return element[objectKey] === value
    })
    return object
}

export default {}