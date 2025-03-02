import { PropsWithChildren, createContext, useContext, useState } from "react";
import { RootSiblingParent } from "react-native-root-siblings";

export type SiblingContextType = {
  message: string;
  onAdd: (message: string) => void;
  onRemove: () => void;
};

const SiblingContext = createContext<SiblingContextType>({
  message: "",
  onAdd: () => {},
  onRemove: () => {},
});

const SiblingStore = ({ children }: PropsWithChildren) => {
  const [message, setMessage] = useState<string>("");

  const onAdd = (message: string) => {
    setMessage(message);
  };

  const onRemove = () => {
    setMessage("");
  };

  return (
    <SiblingContext.Provider value={{ message, onAdd, onRemove }}>
      <RootSiblingParent>{children}</RootSiblingParent>
    </SiblingContext.Provider>
  );
};

export const useSiblingContext = () => {
  return useContext(SiblingContext);
};

export default SiblingStore;
