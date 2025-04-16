import React from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";
import { useStyles } from "react-native-unistyles";
import loadingSpinnerStyleSheet from "../styles/components/LoadingSpinner";

const LoadingSpinner = (props: ActivityIndicatorProps) => {
  const { styles } = useStyles(loadingSpinnerStyleSheet);

  return <ActivityIndicator {...props} style={styles.loader} />;
};

export default LoadingSpinner;
