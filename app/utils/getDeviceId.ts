import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { getFromAsyncStorage, saveToAsyncStorage } from "./asyncStorageUtils";

export const getDeviceId = async (): Promise<string | undefined> => {
    try {
        const deviceId = await getFromAsyncStorage("device_id")
        if (deviceId === null) {
            const newDeviceId = uuidv4()
            await saveToAsyncStorage("device_id", newDeviceId)
            return newDeviceId
        }
        return deviceId
    } catch {
        return undefined
    }
}

export default {}