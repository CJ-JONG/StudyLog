import axiosInstance from "./axiosInstance";
import type {
  StudyLogCreateRequest,
  StudyLogResponse,
  StudyLogUpdateRequest,
} from "../types/studyLog";

export async function getStudyLogs(): Promise<
  StudyLogResponse[]
> {
  const { data } =
    await axiosInstance.get<StudyLogResponse[]>("/studylogs");

  return data;
}

export async function getStudyLog(
  studyLogId: number
): Promise<StudyLogResponse> {
  const { data } =
    await axiosInstance.get<StudyLogResponse>(
      `/studylogs/${studyLogId}`
    );

  return data;
}

export async function createStudyLog(
  payload: StudyLogCreateRequest
): Promise<StudyLogResponse | number | undefined> {
  const { data } =
    await axiosInstance.post<
      StudyLogResponse | number | undefined
    >("/studylogs", payload);

  return data;
}

export async function updateStudyLog(
  studyLogId: number,
  payload: StudyLogUpdateRequest
): Promise<StudyLogResponse | undefined> {
  const { data } =
    await axiosInstance.put<StudyLogResponse | undefined>(
      `/studylogs/${studyLogId}`,
      payload
    );

  return data;
}

export async function deleteStudyLog(
  studyLogId: number
): Promise<void> {
  await axiosInstance.delete(`/studylogs/${studyLogId}`);
}
