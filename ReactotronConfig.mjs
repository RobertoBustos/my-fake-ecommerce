import Reactotron, { asyncStorage } from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";

const reactotron = Reactotron.configure({
  name: "My Fake Ecommerce",
}) // controls connection & communication settings
  .use(asyncStorage())
  .use(reactotronRedux())
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

export default reactotron;
