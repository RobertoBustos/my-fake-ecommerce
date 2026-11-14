import { render, screen, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import CustomImage from "../CustomImage";

describe("CustomImage", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    global.fetch = fetchMock;
    jest.spyOn(Alert, "alert");
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    fetchMock.mockReset();
  });

  it("shows a placeholder without loading or alerting when the URL is empty", async () => {
    render(<CustomImage imageUrl="" width={100} height={100} />);

    await waitFor(() => expect(screen.queryByTestId("LoadingScreen.Loader")).toBeNull());
    expect(screen.getByTestId("EmptyImage.Container")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it("keeps the placeholder without alerting when the download fails", async () => {
    fetchMock.mockRejectedValue(new Error("Network request failed"));

    render(<CustomImage imageUrl="https://example.com/image.jpg" width={100} height={100} />);

    await waitFor(() => expect(screen.queryByTestId("LoadingScreen.Loader")).toBeNull());
    expect(screen.getByTestId("EmptyImage.Container")).toBeTruthy();
    expect(console.warn).toHaveBeenCalled();
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it("keeps the placeholder when the server answers with an error status", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404 });

    render(<CustomImage imageUrl="https://example.com/missing.jpg" width={100} height={100} />);

    await waitFor(() => expect(screen.queryByTestId("LoadingScreen.Loader")).toBeNull());
    expect(screen.getByTestId("EmptyImage.Container")).toBeTruthy();
    expect(Alert.alert).not.toHaveBeenCalled();
  });
});
