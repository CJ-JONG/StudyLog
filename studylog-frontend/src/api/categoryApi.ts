import axiosInstance from "./axiosInstance";
import type {
  CategoryCreateRequest,
  CategoryResponse,
  CategoryUpdateRequest,
} from "../types/category";

export async function getCategories(): Promise<CategoryResponse[]> {
  const { data } =
    await axiosInstance.get<CategoryResponse[]>("/categories");

  return data;
}

export async function createCategory(
  payload: CategoryCreateRequest
): Promise<CategoryResponse | number | undefined> {
  const { data } =
    await axiosInstance.post<CategoryResponse | number | undefined>(
      "/categories",
      payload
    );

  return data;
}

export async function updateCategory(
  categoryId: number,
  payload: CategoryUpdateRequest
): Promise<CategoryResponse | undefined> {
  const { data } =
    await axiosInstance.patch<CategoryResponse | undefined>(
      `/categories/${categoryId}`,
      payload
    );

  return data;
}

export async function deleteCategory(
  categoryId: number
): Promise<void> {
  await axiosInstance.delete(`/categories/${categoryId}`);
}
