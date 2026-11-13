import { configureStore } from "@reduxjs/toolkit";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import Map from "../Map";
import orderReducer, { setAddressData } from "../../redux/order/reducer";

const createStore = () => configureStore({ reducer: { order: orderReducer } });
let mockStore: ReturnType<typeof createStore>;

// The real hooks, bound to a store made for each test
jest.mock("../../redux/hooks", () => {
  const { useSyncExternalStore } = require("react");
  return {
    useAppDispatch: () => mockStore.dispatch,
    useAppSelector: (selector: (state: unknown) => unknown) =>
      useSyncExternalStore(mockStore.subscribe, () => selector(mockStore.getState())),
  };
});

const mockCamera = { center: { latitude: 19, longitude: -99 }, zoom: 8 };
const mockAnimateCamera = jest.fn();

jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MockMapView = React.forwardRef((props: object, ref: React.Ref<unknown>) => {
    React.useImperativeHandle(ref, () => ({
      animateCamera: mockAnimateCamera,
      getCamera: () => Promise.resolve(mockCamera),
    }));
    return <View {...props} />;
  });
  MockMapView.displayName = "MockMapView";
  return { __esModule: true, default: MockMapView, Marker: View, PROVIDER_GOOGLE: "google" };
});

jest.mock("react-native-unistyles", () => ({
  useStyles: () => ({ styles: { container: {}, map: {} } }),
  createStyleSheet: (styleSheet: unknown) => styleSheet,
}));

const coords = { latitude: 19.4326076, longitude: -99.133208, latitudeDelta: 0.01, longitudeDelta: 0.01 };

const renderMap = () => {
  mockStore = createStore();
  render(<Map />);
  return mockStore;
};

const advance = async (ms: number) => {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
};

describe("Map", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockAnimateCamera.mockClear();
    mockCamera.center = { latitude: 19, longitude: -99 };
    mockCamera.zoom = 8;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("confirms the address once the camera rests on it, without any region event", async () => {
    const store = renderMap();
    await act(async () => {
      store.dispatch(setAddressData({ address: "Zócalo", zipCode: "06000", coords }));
    });
    expect(mockAnimateCamera).toHaveBeenCalledTimes(1);

    await advance(500);
    expect(store.getState().order.mapCenter).toBeNull();

    mockCamera.center = { latitude: coords.latitude, longitude: coords.longitude };
    mockCamera.zoom = 18;
    await advance(500);
    expect(store.getState().order.mapCenter).toEqual({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  });

  it("does not confirm while the camera is still zooming in over the address", async () => {
    const store = renderMap();
    await act(async () => {
      store.dispatch(setAddressData({ address: "Zócalo", zipCode: "06000", coords }));
    });
    mockCamera.center = { latitude: coords.latitude, longitude: coords.longitude };
    mockCamera.zoom = 12;
    await advance(500);

    expect(store.getState().order.mapCenter).toBeNull();
  });

  it("animates again when the camera never reaches the address", async () => {
    const store = renderMap();
    await act(async () => {
      store.dispatch(setAddressData({ address: "Zócalo", zipCode: "06000", coords }));
    });

    await advance(3000);
    expect(mockAnimateCamera).toHaveBeenCalledTimes(2);
    expect(store.getState().order.mapCenter).toBeNull();
  });

  it("confirms the address when a gesture interrupts the animation", async () => {
    const store = renderMap();
    await act(async () => {
      store.dispatch(setAddressData({ address: "Zócalo", zipCode: "06000", coords }));
    });
    fireEvent(screen.getByTestId("Map.Map"), "regionChangeComplete", coords, { isGesture: true });

    expect(store.getState().order.mapCenter).toEqual({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    await advance(3000);
    expect(mockAnimateCamera).toHaveBeenCalledTimes(1);
  });
});
