import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authApi from "../api/auth.js";
import { clearToken, getToken, setToken } from "./storage.js";
import { AuthContext } from "./authContextCore.js";

const initialModal = {
  isOpen: false,
  view: "login",
  email: "",
  notice: "",
  resetToken: "",
};

const readOAuthHash = () => {
  if (typeof window === "undefined") return null;

  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  const token = params.get("auth_token");
  const error = params.get("auth_error");

  if (token || error) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`
    );
  }

  return { token, error };
};

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(Boolean(getToken()));
  const [modal, setModal] = useState(initialModal);

  const persistToken = useCallback((nextToken) => {
    setToken(nextToken || "");
    setTokenState(nextToken || "");
  }, []);

  const clearSession = useCallback(() => {
    clearToken();
    setTokenState("");
    setUser(null);
    setInitializing(false);
  }, []);

  const openAuth = useCallback((view = "login", options = {}) => {
    setModal({
      isOpen: true,
      view,
      email: options.email || "",
      notice: options.notice || "",
      resetToken: options.resetToken || "",
    });
  }, []);

  const closeAuth = useCallback(() => {
    setModal((current) => ({ ...current, isOpen: false }));
  }, []);

  const setView = useCallback((view, options = {}) => {
    setModal((current) => ({
      ...current,
      view,
      email: options.email ?? current.email,
      notice: options.notice ?? "",
      resetToken: options.resetToken ?? current.resetToken,
      isOpen: true,
    }));
  }, []);

  useEffect(() => {
    const oauth = readOAuthHash();

    if (oauth?.token) {
      persistToken(oauth.token);
      setInitializing(true);
    } else if (oauth?.error) {
      openAuth("login", {
        notice: decodeURIComponent(oauth.error),
      });
      setInitializing(false);
    }
  }, [openAuth, persistToken]);

  const refreshUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setInitializing(false);
      return null;
    }

    try {
      const data = await authApi.getMe();
      setUser(data.user);
      return data.user;
    } catch {
      clearSession();
      return null;
    } finally {
      setInitializing(false);
    }
  }, [clearSession]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setInitializing(false);
      return;
    }

    setInitializing(true);
    refreshUser();
  }, [token, refreshUser]);

  useEffect(() => {
    const handleExpired = () => {
      clearSession();
      openAuth("login", {
        notice: "Your session expired. Please sign in again.",
      });
    };

    window.addEventListener("kukin:auth-expired", handleExpired);
    return () => window.removeEventListener("kukin:auth-expired", handleExpired);
  }, [clearSession, openAuth]);

  const login = useCallback(
    async (credentials) => {
      const data = await authApi.login(credentials);
      persistToken(data.token);
      setUser(data.user);
      setInitializing(false);
      setModal((current) => ({ ...current, isOpen: false, notice: "" }));
      return data;
    },
    [persistToken]
  );

  const signup = useCallback(
    async (payload) => {
      const data = await authApi.signup(payload);
      setModal((current) => ({
        ...current,
        isOpen: true,
        view: "verify-signup",
        email: data.email || payload.email,
        notice: data.message,
        resetToken: "",
      }));
      return data;
    },
    []
  );

  const verifySignupOtp = useCallback(async (payload) => {
    const data = await authApi.verifySignupOtp(payload);
    setModal((current) => ({
      ...current,
      isOpen: true,
      view: "login",
      email: payload.email || current.email,
      notice: data.message,
      resetToken: "",
    }));
    return data;
  }, []);

  const resendSignupOtp = useCallback(async (email) => {
    return authApi.resendSignupOtp({ email });
  }, []);

  const forgotPassword = useCallback(async (email) => {
    const data = await authApi.forgotPassword({ email });
    setModal((current) => ({
      ...current,
      isOpen: true,
      view: "verify-reset",
      email,
      notice: data.message,
      resetToken: "",
    }));
    return data;
  }, []);

  const verifyResetOtp = useCallback(async (payload) => {
    const data = await authApi.verifyResetOtp(payload);
    setModal((current) => ({
      ...current,
      isOpen: true,
      view: "reset",
      email: payload.email || current.email,
      notice: data.message,
      resetToken: data.resetToken,
    }));
    return data;
  }, []);

  const resetPassword = useCallback(async (payload) => {
    const data = await authApi.resetPassword(payload);
    setModal((current) => ({
      ...current,
      isOpen: true,
      view: "login",
      notice: data.message,
      resetToken: "",
    }));
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // The local session is cleared even if the server cannot be reached.
    }

    clearSession();
    setModal(initialModal);
  }, [clearSession]);

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const data = await authApi.updateMe(payload);
    setUser(data.user);
    return data;
  }, []);

  const updateAvatar = useCallback(async (file) => {
    const data = await authApi.uploadAvatar(file);
    setUser(data.user);
    return data;
  }, []);

  const updatePassword = useCallback(
    async (payload) => {
      const data = await authApi.changePassword(payload);
      if (data.token) persistToken(data.token);
      if (data.user) setUser(data.user);
      return data;
    },
    [persistToken]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: Boolean(token && user),
      modal,
      openAuth,
      closeAuth,
      setView,
      login,
      signup,
      verifySignupOtp,
      resendSignupOtp,
      forgotPassword,
      verifyResetOtp,
      resetPassword,
      logout,
      refreshUser,
      updateUser,
      updateProfile,
      updateAvatar,
      updatePassword,
    }),
    [
      user,
      token,
      initializing,
      modal,
      openAuth,
      closeAuth,
      setView,
      login,
      signup,
      verifySignupOtp,
      resendSignupOtp,
      forgotPassword,
      verifyResetOtp,
      resetPassword,
      logout,
      refreshUser,
      updateUser,
      updateProfile,
      updateAvatar,
      updatePassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


