import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { AddressType } from "../constants/types";

export const formatAddress = (address: GooglePlaceDetail): AddressType => {
    const coords = {
        latitude: address.geometry.location.lat,
        longitude: address.geometry.location.lng,
        latitudeDelta: 2,
        longitudeDelta: 2,
    }
    let values = { address: address.formatted_address, zipCode: "", coords: coords }
    address.address_components.map(component => {
        if (component.types.includes("postal_code")) {
            values.zipCode = component.long_name
        }
    })

    return values
}

export default {}