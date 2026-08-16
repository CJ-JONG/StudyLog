import axios from "axios";

import type { ApiErrorResponse } from "../types/api";

const STATUS_MESSAGES: Record<number, string> = {
  400: "입력값을 확인해 주세요.",
  401: "로그인이 필요합니다.",
  403: "접근 권한이 없습니다.",
  404: "요청한 데이터를 찾을 수 없습니다.",
  409: "현재 상태에서 처리할 수 없습니다.",
  500: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstStringFromUnknown(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = firstStringFromUnknown(item);

      if (message) {
        return message;
      }
    }
  }

  if (isRecord(value)) {
    for (const item of Object.values(value)) {
      const message = firstStringFromUnknown(item);

      if (message) {
        return message;
      }
    }
  }

  return null;
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  if (!error.response) {
    return "백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해 주세요.";
  }

  const responseMessage = error.response.data?.message;

  if (responseMessage?.trim()) {
    return responseMessage;
  }

  const validationMessage = firstStringFromUnknown(
    error.response.data?.errors
  );

  if (validationMessage) {
    return validationMessage;
  }

  return (
    STATUS_MESSAGES[error.response.status] ??
    fallbackMessage
  );
}

export function isUnauthorizedError(error: unknown): boolean {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 401
  );
}
