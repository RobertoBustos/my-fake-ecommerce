import { useEffect } from "react";
import Toast from "react-native-root-toast";
import { useSiblingContext } from "../../contexts/SiblingContext";

export type ToastMessagePropsType = {
  message: string;
};

const ToastMessage = () => {
  const { message, onRemove } = useSiblingContext();

  useEffect(() => {
    setTimeout(() => {
      onRemove();
    }, 2000);
  }, [message]);

  return message !== "" ? (
    <Toast
      visible={true}
      position={50}
      shadow={true}
      animation={true}
      hideOnPress={true}
    >
      {message}
    </Toast>
  ) : null;
};

export default ToastMessage;
