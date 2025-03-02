import { PropsWithChildren } from "react";
import CartStore from "./CartContext";
import CheckoutStore from "./CheckoutContext";
import SiblingStore from "./SiblingContext";

export const RootContext = ({ children }: PropsWithChildren) => {
  return (
    <SiblingStore>
      <CheckoutStore>
        <CartStore>{children}</CartStore>
      </CheckoutStore>
    </SiblingStore>
  );
};
