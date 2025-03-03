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
  isValidUser: boolean;
  isValidAddress: boolean;
  setIsValidUser: (isValid: boolean) => void;
  setIsValidAddress: (isValid: boolean) => void;
};

const CheckoutContext = createContext<CheckoutContextType>({
  userData: { firstName: "", lastName: "" },
  addressData: { address: "", zipCode: 0 },
  onAddUser: () => {},
  onAddAddress: () => {},
  isValidUser: false,
  isValidAddress: false,
  setIsValidUser: () => {},
  setIsValidAddress: () => {},
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
  const [isValidUser, setIsValidUser] = useState<boolean>(false);
  const [isValidAddress, setIsValidAddress] = useState<boolean>(false);

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
        const userData = JSON.parse(response) as UserType;
        setUserData(userData);
        if (userData.firstName !== "" && userData.lastName !== "") {
          setIsValidUser(true);
        }
      }
    });
    getFromAsyncStorage("addressData").then((response) => {
      if (response !== null) {
        const addressData = JSON.parse(response) as AddressType;
        setAddressData(addressData);
        if (addressData.address !== "" && addressData.zipCode !== 9999) {
          setIsValidAddress(true);
        }
      }
    });
  };

  return (
    <CheckoutContext.Provider
      value={{
        userData,
        addressData,
        onAddAddress,
        onAddUser,
        isValidAddress,
        isValidUser,
        setIsValidAddress,
        setIsValidUser,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  return useContext(CheckoutContext);
};

export default CheckoutStore;
