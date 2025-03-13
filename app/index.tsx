import { Provider } from "react-redux";
import RootContext from "./contexts";
import RootStack from "./navigation";
import store from "./redux/store";
if (__DEV__) {
  require("../ReactotronConfig");
}

export default function Index() {
  return (
    <Provider store={store}>
      <RootContext>
        <RootStack />
      </RootContext>
    </Provider>
  );
}
