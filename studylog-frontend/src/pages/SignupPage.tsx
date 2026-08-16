import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] =
    useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const errorId = errorMessage ? "signup-error" : undefined;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedEmail = email.trim();
    const trimmedNickname = nickname.trim();

    if (
      !trimmedEmail ||
      !trimmedNickname ||
      !password ||
      !passwordConfirm
    ) {
      setErrorMessage("모든 값을 입력해 주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage("올바른 이메일 형식으로 입력해 주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      await signup({
        email: trimmedEmail,
        nickname: trimmedNickname,
        password,
      });

      navigate("/login", {
        replace: true,
        state: {
          message:
            "회원가입이 완료되었습니다. 로그인해 주세요.",
        },
      });
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "회원가입에 실패했습니다."
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
            <span className="visual-bar medium" />
            <span className="visual-bar tall" />
            <span className="visual-bar short" />
          </div>
          <div className="visual-card top" />
          <div className="visual-card bottom" />
        </div>

        <section className="auth-card">
          <div className="auth-heading">
            <p className="auth-logo">StudyLog</p>
            <h1>새 계정 만들기</h1>
            <p>카테고리별로 공부 기록을 관리해 보세요.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="signup-email">이메일</label>
            <input
              id="signup-email"
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

            <label htmlFor="signup-nickname">닉네임</label>
            <input
              id="signup-nickname"
              type="text"
              value={nickname}
              onChange={(event) =>
                setNickname(event.target.value)
              }
              placeholder="사용할 닉네임"
              autoComplete="nickname"
              disabled={loading}
              aria-describedby={errorId}
              required
            />

            <label htmlFor="signup-password">비밀번호</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
              disabled={loading}
              aria-describedby={errorId}
              required
            />

            <label htmlFor="signup-password-confirm">
              비밀번호 확인
            </label>
            <input
              id="signup-password-confirm"
              type="password"
              value={passwordConfirm}
              onChange={(event) =>
                setPasswordConfirm(event.target.value)
              }
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
              disabled={loading}
              aria-describedby={errorId}
              required
            />

            {errorMessage && (
              <p
                id="signup-error"
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
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <p className="auth-switch">
            이미 계정이 있으신가요?
            <Link to="/login">로그인</Link>
          </p>
        </section>
      </section>
    </main>
  );
}

export default SignupPage;
