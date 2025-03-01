import SiblingStore from "./contexts/SiblingContext";
import CartStore from "./contexts/cartContext";
import RootStack from "./navigation";

export default function Index() {
  return (
    <SiblingStore>
      <CartStore>
        <RootStack />
      </CartStore>
    </SiblingStore>
  );
}
