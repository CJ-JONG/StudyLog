package com.studylog.studylog.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record StudyLogCreateRequest(

        @NotNull(message = "카테고리를 선택해주세요.")
        Long categoryId,

        @NotBlank(message = "제목은 필수입니다.")
        @Size(max = 100, message = "제목은 100자 이하여야 합니다.")
        String title,

        @NotBlank(message = "공부 내용은 필수입니다.")
        String content,

        @NotNull(message = "공부 날짜는 필수입니다.")
        @PastOrPresent(message = "공부 날짜는 미래일 수 없습니다.")
        LocalDate studyDate,

        @NotNull(message = "공부 시간은 필수입니다.")
        @Positive(message = "공부 시간은 1분 이상이어야 합니다.")
        Integer studyMinutes
) {
}
