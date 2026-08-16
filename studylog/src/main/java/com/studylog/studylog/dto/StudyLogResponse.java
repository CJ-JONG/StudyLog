package com.studylog.studylog.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record StudyLogResponse(
        Long id, Long categoryId, String categoryName,
        String title, String content,
        LocalDate studyDate, Integer studyMinutes,
        LocalDateTime createdAt, LocalDateTime updatedAt
) {
}
