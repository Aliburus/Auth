import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../utils/api";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await api.get("/api/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      setUser(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Giriş başarısız");
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await api.post("/api/auth/register", {
        username,
        email,
        password,
      });
      setUser(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Kayıt başarısız");
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Çıkış başarısız");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
