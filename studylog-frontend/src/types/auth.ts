export interface MemberResponse {
  id: number;
  email: string;
  nickname: string;
}

export interface MemberSignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface MemberLoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  member: MemberResponse;
}

export interface AuthState {
  member: MemberResponse | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}
