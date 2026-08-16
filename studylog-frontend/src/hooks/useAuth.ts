import { useContext } from "react";

import { AuthContext } from "../contexts/authContextCore";
import type { AuthContextValue } from "../contexts/authContextCore";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}
