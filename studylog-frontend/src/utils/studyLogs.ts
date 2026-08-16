import type { StudyLogResponse } from "../types/studyLog";

export function sortStudyLogs(
  studyLogs: StudyLogResponse[]
): StudyLogResponse[] {
  return [...studyLogs].sort((left, right) => {
    const dateCompare = right.studyDate.localeCompare(left.studyDate);

    if (dateCompare !== 0) {
      return dateCompare;
    }

    return right.createdAt.localeCompare(left.createdAt);
  });
}
