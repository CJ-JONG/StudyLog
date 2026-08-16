import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import { getCategories } from "../api/categoryApi";
import { getStudyLogs } from "../api/studyLogApi";
import { useAuth } from "../hooks/useAuth";
import type { CategoryResponse } from "../types/category";
import type { StudyLogResponse } from "../types/studyLog";
import { getApiErrorMessage } from "../utils/apiError";
import {
  formatKoreanDate,
  formatStudyMinutes,
} from "../utils/date";
import { sortStudyLogs } from "../utils/studyLogs";

function DashboardPage() {
  const { member } = useAuth();
  const [searchParams, setSearchParams] =
    useSearchParams();
  const [categories, setCategories] = useState<
    CategoryResponse[]
  >([]);
  const [studyLogs, setStudyLogs] = useState<
    StudyLogResponse[]
  >([]);
  const [selectedCategoryId, setSelectedCategoryId] =
    useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const [categoryData, studyLogData] =
        await Promise.all([getCategories(), getStudyLogs()]);

      setCategories(categoryData);
      setStudyLogs(sortStudyLogs(studyLogData));
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "대시보드 정보를 불러오지 못했습니다."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const categoryParam =
      searchParams.get("category") ?? "";

    if (categoryParam !== selectedCategoryId) {
      setSelectedCategoryId(categoryParam);
    }
  }, [searchParams, selectedCategoryId]);

  const updateCategoryFilter = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSearchParams(categoryId ? { category: categoryId } : {});
  };

  const totalStudyMinutes = useMemo(
    () =>
      studyLogs.reduce(
        (total, studyLog) => total + studyLog.studyMinutes,
        0
      ),
    [studyLogs]
  );

  const filteredStudyLogs = useMemo(() => {
    if (!selectedCategoryId) {
      return studyLogs;
    }

    const categoryId = Number(selectedCategoryId);

    return studyLogs.filter(
      (studyLog) => studyLog.categoryId === categoryId
    );
  }, [selectedCategoryId, studyLogs]);

  const selectedCategory = useMemo(
    () =>
      categories.find(
        (category) =>
          category.id.toString() === selectedCategoryId
      ),
    [categories, selectedCategoryId]
  );

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h1 className="dashboard-title">
            {member?.nickname}님, 오늘도 기록해 볼까요?
          </h1>
          <p>
            공부한 내용을 카테고리별로 정리하고 이전 기록을
            빠르게 확인하세요.
          </p>
        </div>
        <Link
          className="button secondary"
          to="/studylogs/new"
        >
          새 기록 작성
        </Link>
      </header>

      {loading && (
        <div className="state-panel" aria-live="polite">
          대시보드 정보를 불러오는 중입니다.
        </div>
      )}

      {!loading && errorMessage && (
        <div className="state-panel error">
          <p>{errorMessage}</p>
          <button
            className="button secondary"
            type="button"
            onClick={() => {
              void loadDashboard();
            }}
          >
            다시 시도
          </button>
        </div>
      )}

      {!loading && !errorMessage && (
        <>
          <div className="summary-grid">
            <article className="summary-card">
              <span>전체 기록</span>
              <strong>{studyLogs.length}개</strong>
            </article>
            <article className="summary-card">
              <span>전체 공부 시간</span>
              <strong>
                {formatStudyMinutes(totalStudyMinutes)}
              </strong>
            </article>
            <article className="summary-card">
              <span>등록된 카테고리</span>
              <strong>{categories.length}개</strong>
            </article>
          </div>

          {categories.length === 0 ? (
            <div className="state-panel">
              <h2>카테고리를 먼저 만들어 주세요</h2>
              <p>
                공부 기록은 카테고리와 함께 저장됩니다.
              </p>
              <Link
                className="button primary"
                to="/categories"
              >
                카테고리 만들기
              </Link>
            </div>
          ) : (
            <div className="panel">
              <section
                className="chip-toolbar"
                aria-labelledby="category-filter-heading"
              >
                <h2
                  id="category-filter-heading"
                  className="visually-hidden"
                >
                  카테고리 필터
                </h2>
                <button
                  className={
                    selectedCategoryId
                      ? "chip"
                      : "chip active"
                  }
                  type="button"
                  onClick={() => updateCategoryFilter("")}
                >
                  전체
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={
                      selectedCategoryId ===
                      category.id.toString()
                        ? "chip active"
                        : "chip"
                    }
                    type="button"
                    onClick={() =>
                      updateCategoryFilter(
                        category.id.toString()
                      )
                    }
                  >
                    {category.name}
                  </button>
                ))}
              </section>

              {studyLogs.length === 0 && (
                <div className="state-panel embedded">
                  <h2>아직 공부 기록이 없습니다</h2>
                  <p>
                    첫 기록을 작성하면 대시보드에서 바로
                    확인할 수 있습니다.
                  </p>
                  <Link
                    className="button primary"
                    to="/studylogs/new"
                  >
                    첫 기록 작성
                  </Link>
                </div>
              )}

              {studyLogs.length > 0 &&
                filteredStudyLogs.length === 0 && (
                  <div className="state-panel embedded">
                    <h2>
                      {selectedCategory?.name ?? "이 카테고리"}에
                      아직 기록이 없습니다
                    </h2>
                    <p>
                      이 주제로 공부한 내용을 남기면 여기에서
                      바로 모아볼 수 있습니다.
                    </p>
                    <Link
                      className="button secondary"
                      to="/studylogs/new"
                    >
                      기록 작성하기
                    </Link>
                  </div>
                )}

              {filteredStudyLogs.length > 0 && (
                <div className="record-list">
                  {filteredStudyLogs.map((studyLog) => (
                    <article
                      className="record-card"
                      key={studyLog.id}
                    >
                      <div className="record-card-body">
                        <span className="badge">
                          {studyLog.categoryName}
                        </span>
                        <h2>{studyLog.title}</h2>
                        <p className="record-meta">
                          {formatKoreanDate(
                            studyLog.studyDate
                          )}
                          {" · "}
                          {formatStudyMinutes(
                            studyLog.studyMinutes
                          )}
                        </p>
                        <p className="record-preview">
                          {studyLog.content ||
                            "작성된 내용이 없습니다."}
                        </p>
                      </div>
                      <Link
                        className="record-link"
                        to={`/studylogs/${studyLog.id}`}
                      >
                        상세 보기
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default DashboardPage;
