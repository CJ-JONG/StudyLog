import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

const NAVIGATION_ITEMS = [
  { to: "/dashboard", label: "대시보드" },
  { to: "/categories", label: "카테고리 관리" },
  { to: "/studylogs/new", label: "새 기록 작성" },
];

export function AppLayout() {
  const { member, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="app-logo">StudyLog</p>
          <nav className="sidebar-nav" aria-label="주요 메뉴">
            {NAVIGATION_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="member-panel">
          <p>{member?.nickname}</p>
          <span>{member?.email}</span>
          <button
            className="button secondary full-width"
            type="button"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </aside>

      <div className="mobile-header">
        <p className="app-logo">StudyLog</p>
        <button
          className="button secondary"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          메뉴
        </button>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="모바일 주요 메뉴"
        >
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
          <button
            className="button secondary full-width"
            type="button"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </nav>
      )}

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
