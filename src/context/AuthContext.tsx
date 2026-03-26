import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  sendPasswordReset,
  logoutUser,
} from "../services/auth.service";
import {
  createOrFetchUserProfile,
  clearProfileCache,
  type UserProfile,
} from "../services/user.service";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, displayName?: string) => Promise<any>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      try {
        setUser(firebaseUser);
        if (firebaseUser) {
          const userProfile = await createOrFetchUserProfile(firebaseUser.uid, {
            displayName: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL || "",
          });
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isLoggedIn: !!user,
    signIn: (email, password) => loginWithEmail(email, password),
    signUp: (email, password, displayName = "") => registerWithEmail(email, password, displayName),
    signInWithGoogle: () => loginWithGoogle().then(() => undefined),
    resetPassword: (email) => sendPasswordReset(email),
    logout: async () => {
      clearProfileCache();
      await logoutUser();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
