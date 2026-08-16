import { useState, type FormEvent } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

interface LoginLocationState {
  message?: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const state = location.state as LoginLocationState | null;
  const noticeMessage =
    typeof state?.message === "string" ? state.message : "";
  const errorId = errorMessage ? "login-error" : undefined;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMessage("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage("올바른 이메일 형식으로 입력해 주세요.");
      return;
    }

    setLoading(true);

    try {
      await login({
        email: trimmedEmail,
        password,
      });

      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "로그인에 실패했습니다."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-visual" aria-hidden="true">
          <div className="visual-frame">
            <span className="visual-pill wide" />
            <span className="visual-pill" />
            <span className="visual-bar tall" />
            <span className="visual-bar medium" />
            <span className="visual-bar short" />
          </div>
          <div className="visual-card top" />
          <div className="visual-card bottom" />
        </div>

        <section className="auth-card">
          <div className="auth-heading">
            <p className="auth-logo">StudyLog</p>
            <p>
              오늘 공부한 내용을 StudyLog에 기록해 보세요.
            </p>
          </div>

          {noticeMessage && (
            <p className="alert success">{noticeMessage}</p>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="example@email.com"
              autoComplete="email"
              disabled={loading}
              aria-describedby={errorId}
              required
            />

            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              disabled={loading}
              aria-describedby={errorId}
              required
            />

            {errorMessage && (
              <p
                id="login-error"
                className="alert error"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <button
              className="button primary full-width"
              type="submit"
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <p className="auth-switch">
            아직 회원이 아니신가요?
            <Link to="/signup">회원가입</Link>
          </p>
        </section>
      </section>
    </main>
  );
}

export default LoginPage;
