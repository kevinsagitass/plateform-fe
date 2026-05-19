import { useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const localStorageUser = localStorage.getItem("user");
    if (localStorageUser) {
      return JSON.parse(localStorageUser);
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );

  const navigate = useNavigate();

  const register = async (user) => {
    try {
    //   const result = await registerUser(user);

    //   if (result.status === "Success") {
    //     setUser(result.data.user);
    //     setToken(result.data.token);
    //     localStorage.setItem("token", result.data.token);
    //     localStorage.setItem("user", JSON.stringify(result.data.user));
    //     setIsAuthenticated(true);
    //     toast.success("Success!");
    //     navigate("/");
    //   } else {
    //     toast.error(result.data.message);
    //   }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something is wrong");
    }
  };

  const login = async (email, password) => {
    try {
    //   const result = await loginUser(email, password);

    //   if (result.status === "Success") {
    //     setUser(result.data.user);
    //     setToken(result.data.token);
    //     localStorage.setItem("token", result.data.token);
    //     localStorage.setItem("user", JSON.stringify(result.data.user));
    //     setIsAuthenticated(true);
    //     toast.success("Success!");
    //     navigate("/");
    //   } else {
    //     toast.error(result.data.message);
    //   }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something is wrong");
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const setAuth = (user, token, isAuthenticated) => {
    setUser(user);
    setToken(token);
    setIsAuthenticated(isAuthenticated);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, register, login, logout, setAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;