package com.studylog.studylog.controller;

import com.studylog.studylog.dto.StudyLogCreateRequest;
import com.studylog.studylog.dto.StudyLogResponse;
import com.studylog.studylog.dto.StudyLogUpdateRequest;
import com.studylog.studylog.service.StudyLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/studylogs")
public class StudyLogController {

    private final StudyLogService studyLogService;

    // 공부 기록 생성
    @PostMapping
    public ResponseEntity<Long> createStudyLog(
            @AuthenticationPrincipal Long memberId,
            @Valid @RequestBody StudyLogCreateRequest request
    ) {
       Long studyLogId = studyLogService.create(memberId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(studyLogId);
    }

    // 회원의 공부 기록 전체 조회
    @GetMapping
    public ResponseEntity<List<StudyLogResponse>> getStudyLogs(
            @AuthenticationPrincipal Long memberId
    ) {
        List<StudyLogResponse> responses =
                studyLogService.findAll(memberId);

        return ResponseEntity.ok(responses);
    }

    // 공부 기록 단건 조회
    @GetMapping("/{studyLogId}")
    public ResponseEntity<StudyLogResponse> getStudyLog(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long studyLogId
    ) {


        return ResponseEntity.ok(studyLogService.findOne(memberId,studyLogId));
    }

    // 공부 기록 수정
    @PutMapping("/{studyLogId}")
    public ResponseEntity<Void> updateStudyLog(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long studyLogId,
            @Valid @RequestBody StudyLogUpdateRequest request
    ) {
        studyLogService.update(memberId, studyLogId, request);

        return ResponseEntity.noContent().build();
    }

    // 공부 기록 삭제
    @DeleteMapping("/{studyLogId}")
    public ResponseEntity<Void> deleteStudyLog(
            @PathVariable Long memberId,
            @PathVariable Long studyLogId
    ) {
        studyLogService.delete(memberId,studyLogId);

        return ResponseEntity.noContent().build();
    }
}
