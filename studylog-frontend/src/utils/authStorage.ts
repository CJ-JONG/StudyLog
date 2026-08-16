import type { MemberResponse } from "../types/auth";

export const ACCESS_TOKEN_KEY = "accessToken";
export const MEMBER_STORAGE_KEY = "member";
export const AUTH_UNAUTHORIZED_EVENT = "studylog:unauthorized";

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function storeAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function storeMember(member: MemberResponse): void {
  localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(member));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(MEMBER_STORAGE_KEY);
}
