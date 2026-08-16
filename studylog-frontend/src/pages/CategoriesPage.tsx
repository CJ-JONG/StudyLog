import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { Link } from "react-router-dom";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../api/categoryApi";
import { getStudyLogs } from "../api/studyLogApi";
import type { CategoryResponse } from "../types/category";
import { getApiErrorMessage } from "../utils/apiError";

function CategoriesPage() {
  const [categories, setCategories] = useState<
    CategoryResponse[]
  >([]);
  const [recordCounts, setRecordCounts] = useState<
    Record<number, number>
  >({});
  const [newCategoryName, setNewCategoryName] =
    useState("");
  const [editingId, setEditingId] =
    useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] =
    useState<number | null>(null);
  const [deletingId, setDeletingId] =
    useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const [categoryData, studyLogData] =
        await Promise.all([getCategories(), getStudyLogs()]);

      setCategories(categoryData);
      setRecordCounts(
        studyLogData.reduce<Record<number, number>>(
          (counts, studyLog) => {
            counts[studyLog.categoryId] =
              (counts[studyLog.categoryId] ?? 0) + 1;

            return counts;
          },
          {}
        )
      );
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "카테고리 정보를 불러오지 못했습니다."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const handleCreate = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const name = newCategoryName.trim();

    if (!name) {
      setErrorMessage("카테고리 이름을 입력해 주세요.");
      return;
    }

    setCreating(true);

    try {
      await createCategory({ name });
      setNewCategoryName("");
      await loadCategories();
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "카테고리 추가에 실패했습니다."
        )
      );
    } finally {
      setCreating(false);
    }
  };

  const beginEdit = (category: CategoryResponse) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleUpdate = async (
    event: FormEvent<HTMLFormElement>,
    category: CategoryResponse
  ) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const name = editingName.trim();

    if (!name) {
      setErrorMessage("수정할 이름을 입력해 주세요.");
      return;
    }

    if (name === category.name) {
      cancelEdit();
      return;
    }

    setSavingId(category.id);

    try {
      await updateCategory(category.id, { name });
      cancelEdit();
      setSuccessMessage("카테고리 이름을 수정했습니다.");
      await loadCategories();
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "카테고리 수정에 실패했습니다."
        )
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (category: CategoryResponse) => {
    setErrorMessage("");
    setSuccessMessage("");

    const confirmed = window.confirm(
      `"${category.name}" 카테고리를 삭제할까요?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(category.id);

    try {
      await deleteCategory(category.id);
      setSuccessMessage("카테고리를 삭제했습니다.");
      await loadCategories();
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "카테고리 삭제에 실패했습니다."
        )
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h1 className="subpage-title">
            공부 주제를 정리하세요
          </h1>
          <p>
            기록에 사용할 카테고리를 만들고 이름을 관리할 수
            있습니다.
          </p>
        </div>
      </header>

      <form className="panel form-row" onSubmit={handleCreate}>
        <div className="field grow">
          <label htmlFor="new-category-name">
            새 카테고리 이름
          </label>
          <input
            id="new-category-name"
            type="text"
            value={newCategoryName}
            onChange={(event) =>
              setNewCategoryName(event.target.value)
            }
            disabled={creating}
            placeholder="예: 알고리즘"
            required
          />
        </div>
        <button
          className="button primary"
          type="submit"
          disabled={creating}
        >
          {creating ? "추가 중..." : "추가"}
        </button>
      </form>

      {errorMessage && (
        <p className="alert error" role="alert">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="alert success" aria-live="polite">
          {successMessage}
        </p>
      )}

      <div className="panel">
        {loading && (
          <div className="state-panel embedded">
            카테고리를 불러오는 중입니다.
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="state-panel embedded">
            <h2>등록된 카테고리가 없습니다</h2>
            <p>
              먼저 카테고리를 만든 뒤 공부 기록을 작성할 수
              있습니다.
            </p>
          </div>
        )}

        {!loading && categories.length > 0 && (
          <ul className="category-list">
            {categories.map((category) => (
              <li className="category-item" key={category.id}>
                {editingId === category.id ? (
                  <form
                    className="inline-edit"
                    onSubmit={(event) =>
                      void handleUpdate(event, category)
                    }
                  >
                    <label
                      className="visually-hidden"
                      htmlFor={`category-${category.id}`}
                    >
                      카테고리 이름
                    </label>
                    <input
                      id={`category-${category.id}`}
                      type="text"
                      value={editingName}
                      onChange={(event) =>
                        setEditingName(event.target.value)
                      }
                      disabled={savingId === category.id}
                      required
                    />
                    <button
                      className="button primary"
                      type="submit"
                      disabled={savingId === category.id}
                    >
                      {savingId === category.id
                        ? "저장 중..."
                        : "저장"}
                    </button>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={cancelEdit}
                      disabled={savingId === category.id}
                    >
                      취소
                    </button>
                  </form>
                ) : (
                  <>
                    <Link
                      className="category-info category-link"
                      to={`/dashboard?category=${category.id}`}
                    >
                      <span>{category.name}</span>
                      <p>
                        연결된 공부 기록{" "}
                        {recordCounts[category.id] ?? 0}개
                      </p>
                    </Link>
                    <div className="item-actions">
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => beginEdit(category)}
                        disabled={deletingId === category.id}
                      >
                        수정
                      </button>
                      <button
                        className="button danger"
                        type="button"
                        onClick={() => {
                          void handleDelete(category);
                        }}
                        disabled={deletingId === category.id}
                      >
                        {deletingId === category.id
                          ? "삭제 중..."
                          : "삭제"}
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default CategoriesPage;
