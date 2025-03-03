import { PropsWithChildren } from "react";
import CartStore from "./CartContext";
import CheckoutStore from "./CheckoutContext";
import SiblingStore from "./SiblingContext";
import StripeStore from "./StripeContext";

export const RootContext = ({ children }: PropsWithChildren) => {
  return (
    <SiblingStore>
      <CartStore>
        <StripeStore>
          <CheckoutStore>{children}</CheckoutStore>
        </StripeStore>
      </CartStore>
    </SiblingStore>
  );
};
