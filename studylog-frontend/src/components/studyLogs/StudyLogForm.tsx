import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import type { CategoryResponse } from "../../types/category";
import type {
  StudyLogCreateRequest,
  StudyLogResponse,
} from "../../types/studyLog";
import { getTodayDateInput } from "../../utils/date";

export type StudyLogFormValues = StudyLogCreateRequest;

const QUICK_MINUTES = [
  { label: "30분", value: "30" },
  { label: "1시간", value: "60" },
  { label: "2시간", value: "120" },
];

interface StudyLogFormProps {
  categories: CategoryResponse[];
  initialValues?: StudyLogResponse;
  submitLabel: string;
  submitting: boolean;
  serverError: string;
  onSubmit: (values: StudyLogFormValues) => Promise<void>;
  onCancel: () => void;
}

export function StudyLogForm({
  categories,
  initialValues,
  submitLabel,
  submitting,
  serverError,
  onSubmit,
  onCancel,
}: StudyLogFormProps) {
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [studyDate, setStudyDate] = useState(
    getTodayDateInput()
  );
  const [studyMinutes, setStudyMinutes] = useState("30");
  const [validationError, setValidationError] =
    useState("");

  useEffect(() => {
    setCategoryId(
      initialValues?.categoryId.toString() ??
        categories[0]?.id.toString() ??
        ""
    );
    setTitle(initialValues?.title ?? "");
    setContent(initialValues?.content ?? "");
    setStudyDate(
      initialValues?.studyDate ?? getTodayDateInput()
    );
    setStudyMinutes(
      initialValues?.studyMinutes.toString() ?? "30"
    );
  }, [categories, initialValues]);

  const errorMessage = validationError || serverError;
  const errorId = errorMessage
    ? "study-log-form-error"
    : undefined;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setValidationError("");

    const selectedCategoryId = Number(categoryId);
    const parsedMinutes = Number(studyMinutes);
    const trimmedTitle = title.trim();

    if (!categoryId || !Number.isInteger(selectedCategoryId)) {
      setValidationError("카테고리를 선택해 주세요.");
      return;
    }

    if (!trimmedTitle) {
      setValidationError("제목을 입력해 주세요.");
      return;
    }

    if (!studyDate) {
      setValidationError("공부 날짜를 선택해 주세요.");
      return;
    }

    if (
      !Number.isInteger(parsedMinutes) ||
      parsedMinutes < 1
    ) {
      setValidationError(
        "공부 시간은 1분 이상의 숫자로 입력해 주세요."
      );
      return;
    }

    await onSubmit({
      categoryId: selectedCategoryId,
      title: trimmedTitle,
      content: content.trim(),
      studyDate,
      studyMinutes: parsedMinutes,
    });
  };

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      {errorMessage && (
        <p
          id="study-log-form-error"
          className="alert error"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <label
        className="visually-hidden"
        htmlFor="study-log-title"
      >
        제목
      </label>
      <input
        id="study-log-title"
        className="editor-title-input"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={submitting}
        aria-describedby={errorId}
        placeholder="제목을 입력하세요"
        required
      />

      <div className="editor-meta-bar">
        <div className="field">
          <label htmlFor="study-log-category">카테고리</label>
          <select
            id="study-log-category"
            value={categoryId}
            onChange={(event) =>
              setCategoryId(event.target.value)
            }
            disabled={submitting}
            aria-describedby={errorId}
            required
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id.toString()}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="study-log-date">공부 날짜</label>
          <input
            id="study-log-date"
            type="date"
            value={studyDate}
            onChange={(event) =>
              setStudyDate(event.target.value)
            }
            disabled={submitting}
            aria-describedby={errorId}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="study-log-minutes">
            공부 시간(분)
          </label>
          <input
            id="study-log-minutes"
            type="number"
            min="1"
            step="1"
            value={studyMinutes}
            onChange={(event) =>
              setStudyMinutes(event.target.value)
            }
            disabled={submitting}
            aria-describedby={errorId}
            required
          />
        </div>
      </div>

      <div
        className="quick-time"
        aria-label="공부 시간 빠른 선택"
      >
        {QUICK_MINUTES.map((option) => (
          <button
            key={option.value}
            className={
              studyMinutes === option.value
                ? "chip active"
                : "chip"
            }
            type="button"
            onClick={() => setStudyMinutes(option.value)}
            disabled={submitting}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label
        className="visually-hidden"
        htmlFor="study-log-content"
      >
        내용
      </label>
      <textarea
        id="study-log-content"
        className="editor-content-input"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        disabled={submitting}
        rows={14}
        placeholder="오늘 공부한 내용을 적어보세요."
      />
      <div className="editor-bottom-actions">
        <button
          className="button secondary"
          type="button"
          onClick={onCancel}
          disabled={submitting}
        >
          취소
        </button>
        <button
          className="button primary"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "저장 중..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
