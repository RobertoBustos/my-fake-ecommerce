import React from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";
import styles from "../styles/components/LoadingSpinner";

const LoadingSpinner = (props: ActivityIndicatorProps) => {
  return <ActivityIndicator {...props} style={styles.loader} />;
};

export default LoadingSpinner;
