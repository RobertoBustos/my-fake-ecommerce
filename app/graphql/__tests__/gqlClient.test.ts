import { gql } from "@apollo/client";
import { getErrorCode, getErrorMessage } from "../../utils/apiErrors";

const mockGetIdToken = jest.fn();
const mockSignOut = jest.fn();

jest.mock("react-native-get-random-values", () => ({}));
// jest-expo resolves the ESM browser build of uuid, which Jest doesn't transform
jest.mock("uuid", () => ({ v4: () => crypto.randomUUID() }));
jest.mock("firebase/auth", () => ({ signOut: (...args: unknown[]) => mockSignOut(...args) }));
jest.mock("../../utils/firebase", () => ({
  auth: { currentUser: { getIdToken: (...args: unknown[]) => mockGetIdToken(...args) } },
}));
jest.mock("../../constants/config", () => ({
  API_URL: "https://api.test/graphql",
  REQUEST_TIMEOUT_MS: 15000,
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const gqlClient = require("../gqlClient").default;

const QUERY = gql`
  query Products {
    products {
      id
    }
  }
`;

type Answer = { status?: number; body: unknown };

const answer = ({ status = 200, body }: Answer) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/graphql-response+json" },
  });

const unauthenticated = {
  status: 401,
  body: { errors: [{ message: "Invalid token", extensions: { code: "UNAUTHENTICATED" } }] },
};
const products = { body: { data: { products: [{ __typename: "Product", id: "1" }] } } };

const mockFetch = (...answers: Answer[]) => {
  const fetchMock = jest.fn();
  answers.forEach((next) => fetchMock.mockImplementationOnce(async () => answer(next)));
  global.fetch = fetchMock;
  return fetchMock;
};

const headersOf = (fetchMock: jest.Mock, call: number) =>
  new Headers(fetchMock.mock.calls[call][1].headers);

const runQuery = () => gqlClient.query({ query: QUERY, fetchPolicy: "no-cache" });

describe("API client", () => {
  beforeEach(() => {
    mockGetIdToken.mockReset().mockResolvedValue("token-1");
    mockSignOut.mockReset();
  });

  it("sends the ID token and a request id on every request", async () => {
    const fetchMock = mockFetch(products);

    const result = await runQuery();

    expect(result.data.products).toHaveLength(1);
    const headers = headersOf(fetchMock, 0);
    expect(headers.get("authorization")).toBe("Bearer token-1");
    expect(headers.get("x-request-id")).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("adds the request id to the errors of the answer", async () => {
    const fetchMock = mockFetch({
      body: {
        data: null,
        errors: [{ message: "Unexpected error", extensions: { code: "INTERNAL_SERVER_ERROR" } }],
      },
    });

    const error = await runQuery().catch((reason: unknown) => reason);

    const requestId = headersOf(fetchMock, 0).get("x-request-id");
    expect(getErrorMessage(error)).toBe(`Unexpected error\nRequest id: ${requestId}`);
  });

  it("renews the token once and retries on UNAUTHENTICATED", async () => {
    // Like Firebase, a forced refresh replaces the cached token
    let token = "token-1";
    mockGetIdToken.mockImplementation(async (forceRefresh?: boolean) => {
      if (forceRefresh) token = "token-2";
      return token;
    });
    const fetchMock = mockFetch(unauthenticated, products);

    const result = await runQuery();

    expect(result.data.products).toHaveLength(1);
    expect(mockGetIdToken).toHaveBeenCalledWith(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(headersOf(fetchMock, 1).get("authorization")).toBe("Bearer token-2");
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("signs out when the renewed token is rejected too", async () => {
    const fetchMock = mockFetch(unauthenticated, unauthenticated);

    const error = await runQuery().catch((reason: unknown) => reason);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(getErrorCode(error)).toBe("UNAUTHENTICATED");
    expect(mockSignOut).toHaveBeenCalled();
  });

  it("retries a retryable CONFLICT up to twice", async () => {
    const conflict = {
      body: {
        data: null,
        errors: [{ message: "Busy", extensions: { code: "CONFLICT", retryable: true } }],
      },
    };
    const fetchMock = mockFetch(conflict, conflict, products);

    const result = await runQuery();

    expect(result.data.products).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  }, 10000);
});
