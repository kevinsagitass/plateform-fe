import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getMe, loginUser, registerUser } from "../services/AuthService";
import type { RegisterPayload, User } from "../types/auth";
import { resetActiveRoleState } from "@/store/slices/roleSlice";
import { persistor } from "@/store";
import { useAppDispatch } from "@/store/hooks";

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string>(
    () => localStorage.getItem("token") || ""
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const setAuth = (userData: User, tokenData: string): void => {
    setUser(userData);
    setToken(tokenData);
    setIsAuthenticated(true);

    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const clearAuth = (): void => {
    setUser(null);
    setToken("");
    setIsAuthenticated(false);

    localStorage.removeItem("persist:role");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const register = async (payload: RegisterPayload): Promise<void> => {
    try {
      await registerUser(payload);
      toast.success("Register berhasil");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something is wrong");

      throw err;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const res = await loginUser(email, password);
      const { user, token } = res.data;
      setAuth(user, token);

      toast.success(`Welcome back, ${user.name}`);

      navigate("/home");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login gagal");

      throw err;
    }
  };

  const logout = (): void => {
    clearAuth();
    dispatch(resetActiveRoleState());
    persistor.purge();

    toast.success("Logout berhasil");

    navigate("/auth");
  };

  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsLoadingAuth(false);
        return;
      }

      try {
        const res = await getMe();
        setAuth(res.user, storedToken);
        setIsAuthenticated(true);
      } catch (err) {
        console.log(err);

        clearAuth();
      } finally {
        setIsLoadingAuth(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoadingAuth,

        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
