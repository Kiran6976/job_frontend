import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const [authModal, setAuthModal] = useState({
    isOpen: false,
    tab: "login", // "login" or "signup"
    redirectTo: null,
  });

  const syncAuth = () => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      setUser(savedUser ? JSON.parse(savedUser) : null);
      setToken(savedToken || null);
    } catch {
      setUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    syncAuth();
    const handleStorage = () => syncAuth();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("authChange", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authChange", handleStorage);
    };
  }, []);

  const openAuthModal = (redirectTo = null, tab = "login") => {
    setAuthModal({
      isOpen: true,
      tab,
      redirectTo,
    });
  };

  const closeAuthModal = () => {
    setAuthModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const setAuthData = (userData, tokenData) => {
    if (tokenData) localStorage.setItem("token", tokenData);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(tokenData);
    window.dispatchEvent(new Event("authChange"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    window.dispatchEvent(new Event("authChange"));
  };

  const isAuthenticated = Boolean(user || token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        authModal,
        openAuthModal,
        closeAuthModal,
        setAuthModal,
        setAuthData,
        logout,
      }}
    >
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
