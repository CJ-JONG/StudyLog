export interface StudyLogResponse {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  content: string;
  studyDate: string;
  studyMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudyLogCreateRequest {
  categoryId: number;
  title: string;
  content: string;
  studyDate: string;
  studyMinutes: number;
}

export interface StudyLogUpdateRequest {
  categoryId: number;
  title: string;
  content: string;
  studyDate: string;
  studyMinutes: number;
}
