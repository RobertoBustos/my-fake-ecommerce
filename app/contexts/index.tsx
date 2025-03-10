import SiblingStore from "./SiblingContext";
import StripeStore from "./StripeContext";

export type RootContextType = {
  children: React.JSX.Element;
};

const RootContext = ({ children }: RootContextType) => {
  return (
    <SiblingStore>
      <StripeStore>{children}</StripeStore>
    </SiblingStore>
  );
};

export default RootContext;
