import Geolocation, { GeolocationError } from "@react-native-community/geolocation";
import { useCallback } from "react";
import { Alert } from "react-native";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { LatLng } from "react-native-maps";
import { GOOGLE_MAPS_API_KEY } from "../constants/config";
import { formatAddress } from "../utils/formatAddress";

const useLocation = () => {
    const getAddressFromLocation = useCallback(async (coords: LatLng): Promise<GooglePlaceDetail[] | Error> => {
        return new Promise((resolve, reject) => {
            fetch(
                'https://maps.googleapis.com/maps/api/geocode/json?address=' +
                coords.latitude +
                ',' +
                coords.longitude +
                '&key=' +
                GOOGLE_MAPS_API_KEY,
            )
                .then(response => response.json())
                .then(responseJson => {
                    if (responseJson.status === 'OK') {
                        resolve(responseJson?.results);
                    } else {
                        reject('Address not found');
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }, [])

    const getCurrentLocation = useCallback(async (): Promise<GeolocationPosition | GeolocationError> => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(async (info) => {
                resolve(info)
            }, error => reject(error))
        })
    }, [])

    const getFormatedAddress = useCallback(async () => {
        try {
            const location = await getCurrentLocation()
            if ("message" in location) {
                return
            }
            const address = await getAddressFromLocation(location.coords)
            if ("message" in address) {
                return
            }
            const formatedAddress = formatAddress(address[0])
            return formatedAddress
        } catch (error) {
            Alert.alert((error as Error).message)
        }
    }, [getAddressFromLocation, getCurrentLocation])

    return { getCurrentLocation, getAddressFromLocation, getFormatedAddress }
}

export default useLocation