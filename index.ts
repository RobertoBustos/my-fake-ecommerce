// Registers the themes before any style sheet is created
import "./app/styles/config/unistyles";
import { registerRootComponent } from "expo";
import App from "./app";

registerRootComponent(App);
