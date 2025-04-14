import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import MapView, {
  MapViewProps,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { useStyles } from "react-native-unistyles";
import { useAppSelector } from "../redux/hooks";
import { selectAdressCoords } from "../redux/order/selectors";
import mapStyleSheet from "../styles/components/Map";

const INITIAL_REGION: MapViewProps["initialRegion"] = {
  latitude: 19,
  longitude: -99,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

const Map = () => {
  const { styles } = useStyles(mapStyleSheet);
  const mapRef = useRef<MapView>(null);
  const coords = useAppSelector(selectAdressCoords);
  const marker = coords !== null ? { ...coords, name: "You" } : undefined;

  useEffect(() => {
    if (coords === null) return;
    mapRef.current?.animateCamera(
      { center: coords, zoom: 18 },
      { duration: 2000 }
    );
    return () => {};
  }, [coords]);

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
      >
        {marker ? <Marker coordinate={marker} /> : null}
      </MapView>
    </Animated.View>
  );
};

export default Map;
