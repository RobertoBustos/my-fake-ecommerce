import { isSameLocation } from "../isSameLocation";

describe("isSameLocation", () => {
  const point = { latitude: 19.4326, longitude: -99.1332 };

  it("accepts a map center a few meters away", () => {
    expect(isSameLocation(point, { latitude: 19.43265, longitude: -99.13324 })).toBe(true);
  });

  it("rejects a map center a block away", () => {
    expect(isSameLocation(point, { latitude: 19.4336, longitude: -99.1332 })).toBe(false);
  });
});
