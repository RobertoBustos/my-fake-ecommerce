import { useApolloClient } from "@apollo/client/react";
import { FirebaseError } from "firebase/app";
import {
  EmailAuthProvider,
  User,
  linkWithCredential,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert } from "react-native";
import { clearCart } from "../redux/cart/reducer";
import { useAppDispatch } from "../redux/hooks";
import { resetOrder } from "../redux/order/reducer";
import { auth } from "../utils/firebase";

export type AuthContextType = {
  user: User | null;
  isAnonymous: boolean;
  isInitializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAnonymous: true,
  isInitializing: true,
  signIn: (email: string, password: string) => new Promise(() => {}),
  signUp: (email: string, password: string) => new Promise(() => {}),
  signOut: () => new Promise(() => {}),
});

const authErrorMessages: Record<string, string> = {
  "auth/invalid-credential": "Wrong email or password",
  "auth/invalid-email": "Invalid email",
  "auth/user-disabled": "This account has been disabled",
  "auth/email-already-in-use": "There is already an account with this email",
  "auth/credential-already-in-use": "There is already an account with this email",
  "auth/weak-password": "The password must contain at least 6 characters",
  "auth/too-many-requests": "Too many attempts, please try again later",
  "auth/network-request-failed": "We could not reach the server, please try again",
};

export const getAuthErrorMessage = (error: unknown) => {
  if (error instanceof FirebaseError && authErrorMessages[error.code]) {
    return authErrorMessages[error.code];
  }
  return "Unexpected error, please try again later";
};

// The API has no login of its own: it trusts the ID tokens of Firebase Auth
// and takes the uid of the token as the owner of the cart and the orders.
// The app works without an account, so without a session it signs in anonymously
const AuthStore = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const client = useApolloClient();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const previousUserId = useRef<string | null>(null);

  const startAnonymousSession = useCallback(() => {
    signInAnonymously(auth).catch((error) => {
      setIsInitializing(false);
      Alert.alert(
        "We could not start your session",
        getAuthErrorMessage(error),
        [{ text: "Try again", onPress: () => startAnonymousSession() }],
        { cancelable: false }
      );
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const userId = currentUser?.uid ?? null;
      if (previousUserId.current !== userId) {
        // Nothing of the previous user can stay on the device
        if (previousUserId.current) {
          dispatch(clearCart());
          dispatch(resetOrder());
          // clearStore leaves the active queries without data until they fetch again, so they
          // are refetched for the new user. A failed refetch shows up in its own query's error
          client.resetStore().catch(() => undefined);
        }
        previousUserId.current = userId;
      }
      setUser(currentUser);
      setIsAnonymous(currentUser?.isAnonymous ?? true);
      if (currentUser) {
        setIsInitializing(false);
      } else {
        startAnonymousSession();
      }
    });
    return unsubscribe;
  }, [client, dispatch, startAnonymousSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  // Linking keeps the uid, and with it the cart, the orders and the Stripe customer.
  // Firebase does not report this as an auth state change, so the flag is set here
  const signUp = useCallback(async (email: string, password: string) => {
    if (!auth.currentUser) throw new Error("There is no session to link");
    const credential = EmailAuthProvider.credential(email, password);
    const { user: linkedUser } = await linkWithCredential(auth.currentUser, credential);
    setIsAnonymous(linkedUser.isAnonymous);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAnonymous, isInitializing, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthStore;
