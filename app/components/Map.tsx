import React, { useCallback, useEffect, useRef } from "react";
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

const ADDRESS_ZOOM = 18;
const CENTER_DURATION = 2000;
const CAMERA_CHECK_INTERVAL = 500;
// Checks without reaching the address before animating again
const CHECKS_BEFORE_RECENTER = 6;

const Map = () => {
  const { styles } = useStyles(mapStyleSheet);
  const dispatch = useAppDispatch();
  const mapRef = useRef<MapView>(null);
  const cameraCheckRef = useRef<ReturnType<typeof setInterval>>();
  const coords = useAppSelector(selectAdressCoords);
  const marker = coords ? { ...coords, name: "You" } : undefined;

  const centerOnAddress = useCallback(() => {
    if (!coords) return;
    mapRef.current?.animateCamera(
      { center: coords, zoom: ADDRESS_ZOOM },
      { duration: CENTER_DURATION }
    );
  }, [coords]);

  const confirmAddressOnMap = useCallback(() => {
    if (!coords) return;
    clearInterval(cameraCheckRef.current);
    dispatch(
      setMapCenter({ latitude: coords.latitude, longitude: coords.longitude })
    );
  }, [coords, dispatch]);

  // Every visit waits for the map to reach the address again
  useEffect(() => {
    dispatch(setMapCenter(null));
  }, [dispatch]);

  // animateCamera has no completion callback, and on iOS onRegionChangeComplete can be
  // skipped or arrive out of order, so read the camera until it rests on the address.
  // If it never gets there (an animation started before the map's first layout is
  // replaced by the initial region), animate again
  useEffect(() => {
    if (!coords) return;
    centerOnAddress();
    let checks = 0;
    cameraCheckRef.current = setInterval(async () => {
      // Read before the await: a slow getCamera must not make several checks animate
      const check = ++checks;
      try {
        const camera = await mapRef.current?.getCamera();
        if (
          camera &&
          (camera.zoom ?? 0) >= ADDRESS_ZOOM - 0.5 &&
          isSameLocation(camera.center, coords)
        ) {
          confirmAddressOnMap();
          return;
        }
      } catch {
        // The map is not ready yet; the next check tries again
      }
      if (check % CHECKS_BEFORE_RECENTER === 0) centerOnAddress();
    }, CAMERA_CHECK_INTERVAL);
    return () => clearInterval(cameraCheckRef.current);
  }, [coords, centerOnAddress, confirmAddressOnMap]);

  // A gesture interrupts the animation, but the user has seen the map by then
  const handleRegionChangeComplete = (_region: Region, details?: Details) => {
    if (details?.isGesture) confirmAddressOnMap();
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
        onMapLoaded={centerOnAddress}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {marker ? <Marker coordinate={marker} /> : null}
      </MapView>
    </Animated.View>
  );
};

export default Map;
