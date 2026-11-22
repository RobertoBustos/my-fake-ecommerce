import * as Location from "expo-location";
import { useCallback } from "react";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { LatLng } from "react-native-maps";
import { GOOGLE_MAPS_API_KEY } from "../constants/config";
import { AddressType } from "../constants/types";
import { formatAddress } from "../utils/formatAddress";

// Without a timeout, a device that never answers leaves the request pending forever
export const LOCATION_TIMEOUT_MS = 10000

const useLocation = () => {
    const getAddressFromLocation = useCallback(async (coords: LatLng): Promise<GooglePlaceDetail[]> => {
        const response = await fetch(
            'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
            coords.latitude +
            ',' +
            coords.longitude +
            '&key=' +
            GOOGLE_MAPS_API_KEY,
        )
        const responseJson = await response.json()
        if (responseJson.status !== 'OK' || !responseJson.results?.length) {
            throw new Error(`Address not found (${responseJson.status})`)
        }
        return responseJson.results
    }, [])

    const getCurrentLocation = useCallback(async (): Promise<Location.LocationObject> => {
        const { granted } = await Location.requestForegroundPermissionsAsync()
        if (!granted) {
            throw new Error('Location permission not granted')
        }
        // getCurrentPositionAsync has no timeout option of its own
        let timeout: ReturnType<typeof setTimeout> | undefined
        const timedOut = new Promise<never>((_resolve, reject) => {
            timeout = setTimeout(() => reject(new Error('Location request timed out')), LOCATION_TIMEOUT_MS)
        })
        try {
            return await Promise.race([
                Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
                timedOut,
            ])
        } finally {
            clearTimeout(timeout)
        }
    }, [])

    // The address is only a prefill: on any failure the field stays empty for the user to type
    const getFormatedAddress = useCallback(async (): Promise<AddressType | undefined> => {
        try {
            const location = await getCurrentLocation()
            const address = await getAddressFromLocation(location.coords)
            return formatAddress(address[0])
        } catch (error) {
            console.warn(`Could not prefill the address from the location: ${(error as Error).message}`)
        }
    }, [getAddressFromLocation, getCurrentLocation])

    return { getCurrentLocation, getAddressFromLocation, getFormatedAddress }
}

export default useLocation
