import { createContext } from "react";

import type {
  AuthState,
  MemberLoginRequest,
  MemberSignupRequest,
} from "../types/auth";

export interface AuthContextValue extends AuthState {
  initializationError: string;
  login: (payload: MemberLoginRequest) => Promise<void>;
  signup: (payload: MemberSignupRequest) => Promise<void>;
  refreshSession: () => Promise<void>;
  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextValue | null>(null);
