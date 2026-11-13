import { RootStateType } from "../../types";
import orderReducer, { resetOrder, setAddressData, setMapCenter } from "../reducer";
import { selectIsAddressDataValid } from "../selectors";

const coords = { latitude: 19.4326, longitude: -99.1332, latitudeDelta: 0.01, longitudeDelta: 0.01 };
const address = { address: "Av. Juárez 1, Centro, CDMX", zipCode: "06000", coords };

const isValid = (order: RootStateType["order"]) =>
  selectIsAddressDataValid()({ order } as RootStateType);

describe("address validity", () => {
  it("is invalid until the map has reached the address", () => {
    const order = orderReducer(undefined, setAddressData(address));

    expect(isValid(order)).toBe(false);
  });

  it("is valid once the map is centered on the address", () => {
    let order = orderReducer(undefined, setAddressData(address));
    order = orderReducer(order, setMapCenter({ latitude: coords.latitude, longitude: coords.longitude }));

    expect(isValid(order)).toBe(true);
  });

  it("is invalid again when the address changes", () => {
    let order = orderReducer(undefined, setAddressData(address));
    order = orderReducer(order, setMapCenter({ latitude: coords.latitude, longitude: coords.longitude }));
    order = orderReducer(order, setAddressData({ ...address, coords: { ...coords, latitude: 20.6597 } }));

    expect(isValid(order)).toBe(false);
  });

  it("is invalid after the map center is cleared", () => {
    let order = orderReducer(undefined, setAddressData(address));
    order = orderReducer(order, setMapCenter({ latitude: coords.latitude, longitude: coords.longitude }));
    order = orderReducer(order, setMapCenter(null));

    expect(isValid(order)).toBe(false);
  });

  it("clears the map center when the order is reset", () => {
    let order = orderReducer(undefined, setMapCenter({ latitude: coords.latitude, longitude: coords.longitude }));
    order = orderReducer(order, resetOrder());

    expect(order.mapCenter).toBeNull();
  });
});
