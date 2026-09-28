import { createContext, useContext, useEffect, useState } from "react";
import { apiGet, logout } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiGet(
        "/employees/api/v4/me/"
      );

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();

      setUser(data);
    } catch (error) {
      console.error(
        "Failed to load current user:",
        error
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) ?? false;
  };

  const handleLogout = () => {
    setUser(null);
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        hasPermission,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}