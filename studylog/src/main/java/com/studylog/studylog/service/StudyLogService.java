package com.studylog.studylog.service;

import com.studylog.category.domain.Category;
import com.studylog.category.domain.repository.CategoryRepository;
import com.studylog.member.domain.Member;

import com.studylog.member.repository.MemberRepository;
import com.studylog.studylog.domain.StudyLog;
import com.studylog.studylog.dto.StudyLogCreateRequest;
import com.studylog.studylog.dto.StudyLogResponse;
import com.studylog.studylog.dto.StudyLogUpdateRequest;
import com.studylog.studylog.repository.StudyLogRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudyLogService {

    private final StudyLogRepository studyLogRepository;
    private final MemberRepository memberRepository;
    private final CategoryRepository categoryRepository;

    // 공부 기록 생성
    @Transactional
    public Long create(Long memberId, StudyLogCreateRequest request) {
        Member member = memberRepository.findById(memberId).orElseThrow(() ->
                new IllegalArgumentException("존재하지 않는 회원입니다."));

       Category category = categoryRepository.findById(request.categoryId()).orElseThrow(() ->
                new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        if (!category.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("본인의 카테고리만 사용 가능합니다.");
        }

        StudyLog studyLog = new StudyLog(
                member, category, request.title(), request.content(),
                request.studyDate(), request.studyMinutes()
        );
        return studyLogRepository.save(studyLog).getId();
    }

    // 내 공부 기록 전체 조회
    public List<StudyLogResponse> findAll (Long memberId) {
        return studyLogRepository.findAllByMemberId(memberId).stream()
                .map(this::toResponse).toList();
    }


    // 공부 기록 수정
    @Transactional
    public void update(
            Long memberId,
            Long studyLogId,
            StudyLogUpdateRequest request
    ) {

        StudyLog studyLog = getStudyLog(memberId, studyLogId);

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        // 변경하려는 카테고리도 본인 소유인지 확인
        if (!category.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("본인의 카테고리만 사용할 수 있습니다.");
        }

        studyLog.update(
                category,
                request.title(),
                request.content(),
                request.studyDate(),
                request.studyMinutes()
        );
    }

    // 공부 기록 삭제
    @Transactional
    public void delete(Long memberId, Long studyLogId) {

        StudyLog studyLog = getStudyLog(memberId, studyLogId);

        studyLogRepository.delete(studyLog);
    }

    // StudyLog 조회 + 소유자 확인
    public StudyLog getStudyLog(Long memberId, Long studyLogId) {

        StudyLog studyLog = studyLogRepository.findById(studyLogId)
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 공부 기록입니다."));

        if (!studyLog.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("본인의 공부 기록만 접근할 수 있습니다.");
        }

        return studyLog;
    }



    private StudyLogResponse toResponse(StudyLog studyLog) {
        return new StudyLogResponse(
                studyLog.getId(), studyLog.getCategory().getId(),
                studyLog.getCategory().getName(),
                studyLog.getTitle(), studyLog.getContent(),
                studyLog.getStudyDate(), studyLog.getStudyMinutes(),
                studyLog.getCreatedAt(), studyLog.getUpdatedAt()
        );
    }

    @Transactional(readOnly = true)
    public StudyLogResponse findOne(Long memberId, Long studyLogId) {
        StudyLog studyLog = findOwnedStudyLog(memberId,studyLogId);
        
        return toResponse(studyLog);
    }

    private StudyLog findOwnedStudyLog(Long memberId, Long studyLogId) {
        StudyLog studyLog = studyLogRepository.findById(studyLogId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공부 기록입니다."));

        if (!studyLog.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("본인의 공부 기록만 조회할 수 있습니다.");
        }
        return studyLog;
    }
}
