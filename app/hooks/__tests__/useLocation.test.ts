import Geolocation from "@react-native-community/geolocation";
import { renderHook } from "@testing-library/react-native";
import { Alert } from "react-native";
import useLocation, { LOCATION_TIMEOUT_MS } from "../useLocation";

jest.mock("@react-native-community/geolocation", () => ({
  getCurrentPosition: jest.fn(),
}));

const mockGetCurrentPosition = Geolocation.getCurrentPosition as jest.Mock;

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
    mockGetCurrentPosition.mockImplementation((success) => success(position));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    fetchMock.mockReset();
    mockGetCurrentPosition.mockReset();
  });

  it("returns the address of the current location", async () => {
    geocodeResponse({ status: "OK", results: [geocodeResult] });
    const { result } = renderHook(() => useLocation());

    const address = await result.current.getFormatedAddress();

    expect(address).toEqual({
      address: geocodeResult.formatted_address,
      zipCode: "06000",
      coords: { latitude: 19.43263, longitude: -99.13318, latitudeDelta: 2, longitudeDelta: 2 },
    });
    expect(fetchMock.mock.calls[0][0]).toContain("latlng=19.4326,-99.1332");
    expect(mockGetCurrentPosition.mock.calls[0][2]).toEqual({ timeout: LOCATION_TIMEOUT_MS });
  });

  it("returns nothing without alerting when the location fails", async () => {
    mockGetCurrentPosition.mockImplementation((_success, error) =>
      error({ code: 1, message: "User denied access to location services." })
    );
    const { result } = renderHook(() => useLocation());

    await expect(result.current.getFormatedAddress()).resolves.toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("User denied access"));
  });

  it("returns nothing without alerting when no address is found", async () => {
    geocodeResponse({ status: "ZERO_RESULTS", results: [] });
    const { result } = renderHook(() => useLocation());

    await expect(result.current.getFormatedAddress()).resolves.toBeUndefined();
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("ZERO_RESULTS"));
  });

  it("returns nothing without alerting when the request fails", async () => {
    fetchMock.mockRejectedValue(new Error("Network request failed"));
    const { result } = renderHook(() => useLocation());

    await expect(result.current.getFormatedAddress()).resolves.toBeUndefined();
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Network request failed"));
  });
});
