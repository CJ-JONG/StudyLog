import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getMe,
  login as requestLogin,
  signup as requestSignup,
} from "../api/authApi";
import type {
  MemberLoginRequest,
  MemberResponse,
  MemberSignupRequest,
} from "../types/auth";
import {
  AuthContext,
  type AuthContextValue,
} from "./authContextCore";
import {
  getApiErrorMessage,
  isUnauthorizedError,
} from "../utils/apiError";
import {
  AUTH_UNAUTHORIZED_EVENT,
  clearStoredAuth,
  getStoredAccessToken,
  storeAccessToken,
  storeMember,
} from "../utils/authStorage";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [member, setMember] =
    useState<MemberResponse | null>(null);
  const [isInitializing, setIsInitializing] =
    useState(true);
  const [initializationError, setInitializationError] =
    useState("");

  const logout = useCallback(() => {
    clearStoredAuth();
    setMember(null);
    setInitializationError("");
  }, []);

  const refreshSession = useCallback(async () => {
    const accessToken = getStoredAccessToken();

    setInitializationError("");

    if (!accessToken) {
      setMember(null);
      setIsInitializing(false);
      return;
    }

    setIsInitializing(true);

    try {
      const currentMember = await getMe();

      storeMember(currentMember);
      setMember(currentMember);
    } catch (error: unknown) {
      setMember(null);

      if (isUnauthorizedError(error)) {
        clearStoredAuth();
      } else {
        setInitializationError(
          getApiErrorMessage(
            error,
            "로그인 상태를 확인하지 못했습니다."
          )
        );
      }
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, logout);

    return () => {
      window.removeEventListener(
        AUTH_UNAUTHORIZED_EVENT,
        logout
      );
    };
  }, [logout]);

  const login = useCallback(
    async (payload: MemberLoginRequest) => {
      clearStoredAuth();
      setMember(null);
      setInitializationError("");

      const response = await requestLogin(payload);

      storeAccessToken(response.accessToken);
      storeMember(response.member);
      setMember(response.member);
    },
    []
  );

  const signup = useCallback(
    async (payload: MemberSignupRequest) => {
      await requestSignup(payload);
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      member,
      isAuthenticated: member !== null,
      isInitializing,
      initializationError,
      login,
      signup,
      refreshSession,
      logout,
    }),
    [
      member,
      isInitializing,
      initializationError,
      login,
      signup,
      refreshSession,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
