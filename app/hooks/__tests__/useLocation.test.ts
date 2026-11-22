import { renderHook } from "@testing-library/react-native";
import * as Location from "expo-location";
import { Alert } from "react-native";
import useLocation, { LOCATION_TIMEOUT_MS } from "../useLocation";

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
}));

const mockRequestPermission = Location.requestForegroundPermissionsAsync as jest.Mock;
const mockGetCurrentPosition = Location.getCurrentPositionAsync as jest.Mock;

const position = { coords: { latitude: 19.4326, longitude: -99.1332 } };

const geocodeResult = {
  formatted_address: "Plaza de la Constitución S/N, Centro, 06000 Ciudad de México, CDMX, Mexico",
  geometry: { location: { lat: 19.43263, lng: -99.13318 } },
  address_components: [
    { long_name: "06000", short_name: "06000", types: ["postal_code"] },
  ],
};

describe("useLocation", () => {
  const fetchMock = jest.fn();

  const geocodeResponse = (body: object) =>
    fetchMock.mockResolvedValue({ json: () => Promise.resolve(body) });

  beforeEach(() => {
    global.fetch = fetchMock;
    jest.spyOn(Alert, "alert");
    jest.spyOn(console, "warn").mockImplementation(() => {});
    mockRequestPermission.mockResolvedValue({ granted: true });
    mockGetCurrentPosition.mockResolvedValue(position);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
    fetchMock.mockReset();
    mockRequestPermission.mockReset();
    mockGetCurrentPosition.mockReset();
  });

  it("returns the address of the current location", async () => {
    geocodeResponse({ status: "OK", results: [geocodeResult] });
    const { result } = await renderHook(() => useLocation());

    const address = await result.current.getFormatedAddress();

    expect(address).toEqual({
      address: geocodeResult.formatted_address,
      zipCode: "06000",
      coords: { latitude: 19.43263, longitude: -99.13318, latitudeDelta: 2, longitudeDelta: 2 },
    });
    expect(fetchMock.mock.calls[0][0]).toContain("latlng=19.4326,-99.1332");
  });

  it("returns nothing without alerting when the permission is denied", async () => {
    mockRequestPermission.mockResolvedValue({ granted: false });
    const { result } = await renderHook(() => useLocation());

    await expect(result.current.getFormatedAddress()).resolves.toBeUndefined();
    expect(mockGetCurrentPosition).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("permission not granted"));
  });

  it("returns nothing without alerting when the location fails", async () => {
    mockGetCurrentPosition.mockRejectedValue(new Error("Current location is unavailable"));
    const { result } = await renderHook(() => useLocation());

    await expect(result.current.getFormatedAddress()).resolves.toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Current location is unavailable"));
  });

  it("gives up on a location that never arrives", async () => {
    jest.useFakeTimers();
    mockGetCurrentPosition.mockReturnValue(new Promise(() => {}));
    const { result } = await renderHook(() => useLocation());

    const address = result.current.getFormatedAddress();
    await jest.advanceTimersByTimeAsync(LOCATION_TIMEOUT_MS);

    await expect(address).resolves.toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("timed out"));
  });

  it("returns nothing without alerting when no address is found", async () => {
    geocodeResponse({ status: "ZERO_RESULTS", results: [] });
    const { result } = await renderHook(() => useLocation());

    await expect(result.current.getFormatedAddress()).resolves.toBeUndefined();
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("ZERO_RESULTS"));
  });

  it("returns nothing without alerting when the request fails", async () => {
    fetchMock.mockRejectedValue(new Error("Network request failed"));
    const { result } = await renderHook(() => useLocation());

    await expect(result.current.getFormatedAddress()).resolves.toBeUndefined();
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Network request failed"));
  });
});
