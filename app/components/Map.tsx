import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import MapView, {
  Details,
  MapViewProps,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { useStyles } from "react-native-unistyles";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setMapCenter } from "../redux/order/reducer";
import { selectAdressCoords } from "../redux/order/selectors";
import { isSameLocation } from "../utils/isSameLocation";
import mapStyleSheet from "../styles/components/Map";

const INITIAL_REGION: MapViewProps["initialRegion"] = {
  latitude: 19,
  longitude: -99,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

const Map = () => {
  const { styles } = useStyles(mapStyleSheet);
  const dispatch = useAppDispatch();
  const mapRef = useRef<MapView>(null);
  const coords = useAppSelector(selectAdressCoords);
  const marker = coords ? { ...coords, name: "You" } : undefined;

  // Every visit waits for the map to reach the address again
  useEffect(() => {
    dispatch(setMapCenter(null));
  }, [dispatch]);

  useEffect(() => {
    if (!coords) return;
    mapRef.current?.animateCamera(
      { center: coords, zoom: 18 },
      { duration: 2000 }
    );
    return () => {};
  }, [coords]);

  const handleMapLoaded = () => {
    if (!coords) return;
    mapRef.current?.animateCamera(
      { center: coords, zoom: 18 },
      { duration: 2000 }
    );
  };

  // animateCamera has no completion callback, so wait until the camera stops on the address.
  // A gesture interrupts the animation, but the user has seen the map by then
  const handleRegionChangeComplete = (region: Region, details?: Details) => {
    if (!coords) return;
    if (details?.isGesture || isSameLocation(region, coords)) {
      dispatch(
        setMapCenter({ latitude: coords.latitude, longitude: coords.longitude })
      );
    }
  };

  return (
    <Animated.View style={styles.container} testID="Map.Container">
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        testID="Map.Map"
        onMapLoaded={handleMapLoaded}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {marker ? <Marker coordinate={marker} /> : null}
      </MapView>
    </Animated.View>
  );
};

export default Map;
