import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { getCategories } from "../api/categoryApi";
import {
  getStudyLog,
  updateStudyLog,
} from "../api/studyLogApi";
import { StudyLogForm } from "../components/studyLogs/StudyLogForm";
import type { StudyLogFormValues } from "../components/studyLogs/StudyLogForm";
import type { CategoryResponse } from "../types/category";
import type { StudyLogResponse } from "../types/studyLog";
import { getApiErrorMessage } from "../utils/apiError";

function StudyLogEditPage() {
  const { studyLogId } = useParams();
  const navigate = useNavigate();
  const parsedStudyLogId = Number(studyLogId);
  const isValidStudyLogId =
    Number.isInteger(parsedStudyLogId) &&
    parsedStudyLogId > 0;

  const [studyLog, setStudyLog] =
    useState<StudyLogResponse | null>(null);
  const [categories, setCategories] = useState<
    CategoryResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadFormData = useCallback(async () => {
    if (!isValidStudyLogId) {
      setLoadError("존재하지 않는 공부 기록입니다.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");

    try {
      const [categoryData, studyLogData] =
        await Promise.all([
          getCategories(),
          getStudyLog(parsedStudyLogId),
        ]);

      setCategories(categoryData);
      setStudyLog(studyLogData);
    } catch (error: unknown) {
      setLoadError(
        getApiErrorMessage(
          error,
          "수정할 공부 기록을 불러오지 못했습니다."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [isValidStudyLogId, parsedStudyLogId]);

  useEffect(() => {
    void loadFormData();
  }, [loadFormData]);

  const handleSubmit = async (
    values: StudyLogFormValues
  ) => {
    setSubmitting(true);
    setSubmitError("");

    try {
      await updateStudyLog(parsedStudyLogId, values);
      navigate(`/studylogs/${parsedStudyLogId}`, {
        replace: true,
      });
    } catch (error: unknown) {
      setSubmitError(
        getApiErrorMessage(
          error,
          "공부 기록 수정에 실패했습니다."
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
            기록 내용을 다듬으세요
          </h1>
        </div>
      </header>

      {loading && (
        <div className="state-panel">
          수정할 정보를 불러오는 중입니다.
        </div>
      )}

      {!loading && loadError && (
        <div className="state-panel error">
          <p>{loadError}</p>
          <div className="form-actions">
            {isValidStudyLogId && (
              <button
                className="button secondary"
                type="button"
                onClick={() => {
                  void loadFormData();
                }}
              >
                다시 시도
              </button>
            )}
            <Link
              className="button primary"
              to="/dashboard"
            >
              대시보드로 이동
            </Link>
          </div>
        </div>
      )}

      {!loading &&
        !loadError &&
        studyLog &&
        categories.length > 0 && (
          <StudyLogForm
            categories={categories}
            initialValues={studyLog}
            submitLabel="수정 저장"
            submitting={submitting}
            serverError={submitError}
            onSubmit={handleSubmit}
            onCancel={() =>
              navigate(`/studylogs/${studyLog.id}`)
            }
          />
        )}

      {!loading &&
        !loadError &&
        studyLog &&
        categories.length === 0 && (
          <div className="state-panel empty-hero">
            <h2>사용 가능한 카테고리가 없습니다</h2>
            <p>
              카테고리를 만든 뒤 공부 기록을 수정할 수
              있습니다.
            </p>
            <Link className="button primary" to="/categories">
              카테고리 관리로 이동
            </Link>
          </div>
        )}
    </section>
  );
}

export default StudyLogEditPage;
