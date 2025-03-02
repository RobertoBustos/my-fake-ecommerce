import { RootContext } from "./contexts";
import RootStack from "./navigation";

export default function Index() {
  return (
    <RootContext>
      <RootStack />
    </RootContext>
  );
}
