import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { FullPageStatus } from "../components/common/FullPageStatus";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute() {
  const {
    isAuthenticated,
    isInitializing,
    initializationError,
    refreshSession,
  } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <FullPageStatus
        title="로그인 상태를 확인하고 있어요"
        description="잠시만 기다려 주세요."
      />
    );
  }

  if (initializationError) {
    return (
      <FullPageStatus
        title="로그인 상태를 확인하지 못했어요"
        description={initializationError}
        action={{
          label: "다시 시도",
          onClick: () => {
            void refreshSession();
          },
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: `${location.pathname}${location.search}`,
        }}
      />
    );
  }

  return <Outlet />;
}
