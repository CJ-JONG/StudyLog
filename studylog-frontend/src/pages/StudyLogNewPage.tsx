import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCategories } from "../api/categoryApi";
import { createStudyLog } from "../api/studyLogApi";
import { StudyLogForm } from "../components/studyLogs/StudyLogForm";
import type { StudyLogFormValues } from "../components/studyLogs/StudyLogForm";
import type { CategoryResponse } from "../types/category";
import { getApiErrorMessage } from "../utils/apiError";

function StudyLogNewPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<
    CategoryResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      setCategories(await getCategories());
    } catch (error: unknown) {
      setLoadError(
        getApiErrorMessage(
          error,
          "카테고리를 불러오지 못했습니다."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const handleSubmit = async (
    values: StudyLogFormValues
  ) => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const createdStudyLog = await createStudyLog(values);

      if (typeof createdStudyLog === "number") {
        navigate(`/studylogs/${createdStudyLog}`, {
          replace: true,
        });
        return;
      }

      if (createdStudyLog?.id) {
        navigate(`/studylogs/${createdStudyLog.id}`, {
          replace: true,
        });
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      setSubmitError(
        getApiErrorMessage(
          error,
          "공부 기록 저장에 실패했습니다."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h1 className="subpage-title">
            오늘의 공부를 남기세요
          </h1>
          <p>
            날짜, 카테고리, 공부 시간을 함께 기록하면 나중에
            흐름을 확인하기 쉽습니다.
          </p>
        </div>
      </header>

      {loading && (
        <div className="state-panel">
          카테고리를 불러오는 중입니다.
        </div>
      )}

      {!loading && loadError && (
        <div className="state-panel error">
          <p>{loadError}</p>
          <button
            className="button secondary"
            type="button"
            onClick={() => {
              void loadCategories();
            }}
          >
            다시 시도
          </button>
        </div>
      )}

      {!loading && !loadError && categories.length === 0 && (
        <div className="state-panel empty-hero">
          <h2>카테고리가 필요합니다</h2>
          <p>
            공부 기록을 작성하기 전에 사용할 카테고리를 먼저
            만들어 주세요.
          </p>
          <Link className="button primary" to="/categories">
            카테고리 만들기
          </Link>
        </div>
      )}

      {!loading && !loadError && categories.length > 0 && (
        <StudyLogForm
          categories={categories}
          submitLabel="기록 저장"
          submitting={submitting}
          serverError={submitError}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/dashboard")}
        />
      )}
    </section>
  );
}

export default StudyLogNewPage;
