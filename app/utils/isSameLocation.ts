import { LatLng } from "react-native-maps";

// About 10 m: the map center never lands exactly on the coordinates it animated to
const LOCATION_TOLERANCE = 0.0001

export const isSameLocation = (first: LatLng, second: LatLng) =>
    Math.abs(first.latitude - second.latitude) < LOCATION_TOLERANCE &&
    Math.abs(first.longitude - second.longitude) < LOCATION_TOLERANCE

export default {}
