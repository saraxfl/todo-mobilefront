import { createContext, useContext, useEffect, useState } from "react";
import { getToken, loginWithFirebase, logoutFirebase } from "@/services/authService";

type AuthContextType = {
  isLoggedIn: boolean;
  loadingSession: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = await getToken();
      setIsLoggedIn(!!token);
      setLoadingSession(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    await loginWithFirebase(email, password);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await logoutFirebase();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loadingSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}