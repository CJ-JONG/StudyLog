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

import {
  deleteStudyLog,
  getStudyLog,
} from "../api/studyLogApi";
import type { StudyLogResponse } from "../types/studyLog";
import { getApiErrorMessage } from "../utils/apiError";
import {
  formatKoreanDate,
  formatKoreanDateTime,
  formatStudyMinutes,
} from "../utils/date";

function StudyLogDetailPage() {
  const { studyLogId } = useParams();
  const navigate = useNavigate();
  const parsedStudyLogId = Number(studyLogId);
  const isValidStudyLogId =
    Number.isInteger(parsedStudyLogId) &&
    parsedStudyLogId > 0;

  const [studyLog, setStudyLog] =
    useState<StudyLogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadStudyLog = useCallback(async () => {
    if (!isValidStudyLogId) {
      setErrorMessage("존재하지 않는 공부 기록입니다.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      setStudyLog(await getStudyLog(parsedStudyLogId));
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "공부 기록을 불러오지 못했습니다."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [isValidStudyLogId, parsedStudyLogId]);

  useEffect(() => {
    void loadStudyLog();
  }, [loadStudyLog]);

  const handleDelete = async () => {
    if (!studyLog) {
      return;
    }

    const confirmed = window.confirm(
      `"${studyLog.title}" 공부 기록을 삭제할까요?`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setErrorMessage("");

    try {
      await deleteStudyLog(studyLog.id);
      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "공부 기록 삭제에 실패했습니다."
        )
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">공부 기록 상세</p>
          <h1 className="detail-page-title">
            {studyLog?.title ?? "공부 기록"}
          </h1>
        </div>
        <Link className="button secondary" to="/dashboard">
          목록으로
        </Link>
      </header>

      {loading && (
        <div className="state-panel">
          공부 기록을 불러오는 중입니다.
        </div>
      )}

      {!loading && errorMessage && !studyLog && (
        <div className="state-panel error">
          <p>{errorMessage}</p>
          <div className="form-actions">
            {isValidStudyLogId && (
              <button
                className="button secondary"
                type="button"
                onClick={() => {
                  void loadStudyLog();
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

      {!loading && studyLog && (
        <article className="detail-panel">
          {errorMessage && (
            <p className="alert error" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="detail-header">
            <span className="badge">
              {studyLog.categoryName}
            </span>
          </div>

          <dl className="detail-meta">
            <div>
              <dt>공부 날짜</dt>
              <dd>
                {formatKoreanDate(studyLog.studyDate)}
              </dd>
            </div>
            <div>
              <dt>공부 시간</dt>
              <dd>
                {formatStudyMinutes(
                  studyLog.studyMinutes
                )}
              </dd>
            </div>
            <div>
              <dt>작성 시각</dt>
              <dd>
                {formatKoreanDateTime(studyLog.createdAt)}
              </dd>
            </div>
            <div>
              <dt>수정 시각</dt>
              <dd>
                {formatKoreanDateTime(studyLog.updatedAt)}
              </dd>
            </div>
          </dl>

          <div className="content-block">
            <h3>내용</h3>
            <p>
              {studyLog.content || "작성된 내용이 없습니다."}
            </p>
          </div>

          <div className="form-actions">
            <Link
              className="button secondary"
              to={`/studylogs/${studyLog.id}/edit`}
            >
              수정
            </Link>
            <button
              className="button danger"
              type="button"
              onClick={() => {
                void handleDelete();
              }}
              disabled={deleting}
            >
              {deleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </article>
      )}
    </section>
  );
}

export default StudyLogDetailPage;
