import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AddressType, UserType } from "../constants/types";
import {
  getFromAsyncStorage,
  saveToAsyncStorage,
} from "../utils/saveToAsyncStorage";

export type CheckoutContextType = {
  userData: UserType;
  addressData: AddressType;
  onAddUser: (user: UserType) => void;
  onAddAddress: (address: AddressType) => void;
};

const CheckoutContext = createContext<CheckoutContextType>({
  userData: { firstName: "", lastName: "" },
  addressData: { address: "", zipCode: 0 },
  onAddUser: () => {},
  onAddAddress: () => {},
});

const CheckoutStore = ({ children }: PropsWithChildren) => {
  const [userData, setUserData] = useState<UserType>({
    lastName: "",
    firstName: "",
  });
  const [addressData, setAddressData] = useState<AddressType>({
    address: "",
    zipCode: 0,
  });

  const onAddUser = (user: UserType) => {
    setUserData(user);
    saveUser(user);
  };

  const onAddAddress = (address: AddressType) => {
    setAddressData(address);
    saveAddress(address);
  };

  const saveUser = async (user: UserType) => {
    saveToAsyncStorage("userData", JSON.stringify(user));
  };

  const saveAddress = async (address: AddressType) => {
    saveToAsyncStorage("addressData", JSON.stringify(address));
  };

  useEffect(() => {
    fetchCheckout();
  }, []);

  const fetchCheckout = async () => {
    getFromAsyncStorage("userData").then((response) => {
      if (response !== null) {
        setUserData(JSON.parse(response));
      }
    });
    getFromAsyncStorage("addressData").then((response) => {
      if (response !== null) {
        setAddressData(JSON.parse(response));
      }
    });
  };

  return (
    <CheckoutContext.Provider
      value={{ userData, addressData, onAddAddress, onAddUser }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  return useContext(CheckoutContext);
};

export default CheckoutStore;
