import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { AddressType } from "../constants/types";

export const formatAddress = (address: GooglePlaceDetail): AddressType => {
    let values = { address: address.formatted_address, zipCode: "" }
    address.address_components.map(component => {
        if (component.types.includes("postal_code")) {
            values.zipCode = component.long_name
        }
    })

    return values
}

export default {}