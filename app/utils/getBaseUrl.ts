import { BASE_URL, PORT } from "../constants/config"

export const getBaseUrl = () => {
    return BASE_URL + ":" + PORT
}