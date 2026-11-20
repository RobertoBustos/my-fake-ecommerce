import { act, render } from "@testing-library/react-native";
import { User } from "firebase/auth";
import { AuthContextType, useAuthContext } from "../AuthContext";

const mockCalls: string[] = [];
let mockAuthListener: ((user: Partial<User> | null) => void) | undefined;

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: (_auth: unknown, listener: (user: Partial<User> | null) => void) => {
    mockAuthListener = listener;
    return () => undefined;
  },
  signInAnonymously: jest.fn(() => Promise.resolve()),
  signOut: jest.fn(async () => {
    mockCalls.push("signOut");
  }),
  EmailAuthProvider: { credential: jest.fn() },
  linkWithCredential: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));
jest.mock("../../utils/firebase", () => ({ auth: { currentUser: null } }));
jest.mock("../../notifications", () => ({
  syncPushToken: jest.fn(() => mockCalls.push("syncPushToken")),
  unregisterPushToken: jest.fn(async () => {
    mockCalls.push("unregisterPushToken");
  }),
}));
jest.mock("../../redux/hooks", () => ({ useAppDispatch: () => jest.fn() }));
// The reducers load uuid, whose ESM build Jest doesn't transform
jest.mock("../../redux/cart/reducer", () => ({ clearCart: jest.fn() }));
jest.mock("../../redux/order/reducer", () => ({ resetOrder: jest.fn() }));
jest.mock("@apollo/client/react", () => ({
  useApolloClient: () => ({ resetStore: () => Promise.resolve() }),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const AuthStore = require("../AuthContext").default;

const renderAuthStore = async () => {
  const context: { current?: AuthContextType } = {};
  const Probe = () => {
    context.current = useAuthContext();
    return null;
  };
  await render(
    <AuthStore>
      <Probe />
    </AuthStore>
  );
  return context;
};

const signInAs = (uid: string) => act(() => mockAuthListener?.({ uid, isAnonymous: false }));

describe("AuthStore push token", () => {
  beforeEach(() => {
    mockCalls.length = 0;
  });

  it("registers the token at startup", async () => {
    await renderAuthStore();
    await signInAs("user-1");
    expect(mockCalls).toEqual(["syncPushToken"]);
  });

  it("registers it again when another account signs in", async () => {
    await renderAuthStore();
    await signInAs("anonymous-1");
    await signInAs("user-2");
    expect(mockCalls).toEqual(["syncPushToken", "syncPushToken"]);
  });

  it("doesn't register again for the same uid", async () => {
    await renderAuthStore();
    await signInAs("user-1");
    await signInAs("user-1");
    expect(mockCalls).toEqual(["syncPushToken"]);
  });

  it("deletes the token before signing out", async () => {
    const context = await renderAuthStore();
    await signInAs("user-1");
    mockCalls.length = 0;
    await act(() => context.current!.signOut());
    expect(mockCalls).toEqual(["unregisterPushToken", "signOut"]);
  });
});
