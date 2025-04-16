import Geolocation from "@react-native-community/geolocation";
import { useCallback } from "react";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { LatLng } from "react-native-maps";
import { GOOGLE_MAPS_API_KEY } from "../constants/config";
import { formatAddress } from "../utils/formatAddress";

const useLocation = () => {
    const getAddressFromLocation = useCallback(async (coords: LatLng): Promise<GooglePlaceDetail[]> => {
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
                        reject('not found');
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }, [])

    const getCurrentLocation = useCallback(async () => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(async (info) => {
                resolve(info.coords)
            })
        })
    }, [])

    const getFormatedAddress = useCallback(async () => {
        const coords = await getCurrentLocation()
        const address = await getAddressFromLocation(coords as LatLng)
        const formatedAddress = formatAddress(address[0])
        return formatedAddress
    }, [getAddressFromLocation, getCurrentLocation])

    return { getCurrentLocation, getAddressFromLocation, getFormatedAddress }
}

export default useLocation