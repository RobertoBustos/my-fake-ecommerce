import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import { ApiErrorCode, getErrorCode, getErrorMessage, isNotFound } from "../apiErrors";

const graphQLErrors = (extensions: Record<string, unknown>, message = "Something failed") =>
  new CombinedGraphQLErrors({ data: null, errors: [{ message, extensions }] });

const serverError = (status: number, body: unknown) =>
  new ServerError(`Response not successful: Received status code ${status}`, {
    response: new Response(null, { status }),
    bodyText: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("API errors", () => {
  it("reads the code and the argument of a GraphQL error", () => {
    const error = graphQLErrors({ code: ApiErrorCode.NOT_FOUND, invalidArgument: "cartId" });

    expect(getErrorCode(error)).toBe(ApiErrorCode.NOT_FOUND);
    expect(isNotFound(error, "cartId")).toBe(true);
    expect(isNotFound(error, "id")).toBe(false);
  });

  it("reads the GraphQL error inside a non-2xx JSON answer", () => {
    const error = serverError(401, {
      errors: [{ message: "Invalid token", extensions: { code: ApiErrorCode.UNAUTHENTICATED } }],
    });

    expect(getErrorCode(error)).toBe(ApiErrorCode.UNAUTHENTICATED);
    expect(getErrorMessage(error)).toBe("Your session expired, please try again");
  });

  it("shows the request id on internal errors", () => {
    const error = graphQLErrors(
      { code: ApiErrorCode.INTERNAL_SERVER_ERROR, requestId: "req-1" },
      "Unexpected error"
    );

    expect(getErrorMessage(error)).toBe("Unexpected error\nRequest id: req-1");
  });

  it("treats a server answer without GraphQL errors as a connection problem", () => {
    const error = serverError(502, "<html>Bad gateway</html>");

    expect(getErrorCode(error)).toBeUndefined();
    expect(getErrorMessage(error)).toBe("We could not reach the store, please try again");
  });

  it("treats a failed fetch as a connection problem", () => {
    expect(getErrorMessage(new TypeError("Network request failed"))).toBe(
      "We could not reach the store, please try again"
    );
  });

  it("keeps the message of any other error", () => {
    expect(getErrorCode(new Error("Boom"))).toBeUndefined();
    expect(getErrorMessage(new Error("Boom"))).toBe("Boom");
  });
});
