import axiosInstance from "./axiosInstance";
import type {
  LoginResponse,
  MemberLoginRequest,
  MemberResponse,
  MemberSignupRequest,
} from "../types/auth";

export async function signup(
  payload: MemberSignupRequest
): Promise<MemberResponse | undefined> {
  const { data } =
    await axiosInstance.post<MemberResponse | undefined>(
      "/members",
      payload
    );

  return data;
}

export async function login(
  payload: MemberLoginRequest
): Promise<LoginResponse> {
  const { data } =
    await axiosInstance.post<LoginResponse>(
      "/members/login",
      payload
    );

  return data;
}

export async function getMe(): Promise<MemberResponse> {
  const { data } =
    await axiosInstance.get<MemberResponse>("/members/me");

  return data;
}
