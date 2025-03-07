import { PropsWithChildren } from "react";
import CartStore from "./CartContext";
import SiblingStore from "./SiblingContext";
import StripeStore from "./StripeContext";

export const RootContext = ({ children }: PropsWithChildren) => {
  return (
    <SiblingStore>
      <StripeStore>
        <CartStore>{children}</CartStore>
      </StripeStore>
    </SiblingStore>
  );
};
