import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="status-page">
      <section className="status-card">
        <p className="auth-logo">StudyLog</p>
        <h1>페이지를 찾을 수 없어요</h1>
        <p>주소를 확인하거나 주요 화면으로 이동해 주세요.</p>
        <Link
          className="button primary"
          to={isAuthenticated ? "/dashboard" : "/login"}
        >
          {isAuthenticated
            ? "대시보드로 이동"
            : "로그인으로 이동"}
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
