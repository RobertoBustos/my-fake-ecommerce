import { Provider } from "react-redux";
import RootContext from "./contexts";
import RootStack from "./navigation";
import store from "./redux/store";

export default function Index() {
  return (
    <Provider store={store}>
      <RootContext>
        <RootStack />
      </RootContext>
    </Provider>
  );
}
