package com.studylog.studylog.repository;

import com.studylog.studylog.domain.StudyLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyLogRepository extends JpaRepository<StudyLog,Long> {

    List<StudyLog> findAllByMemberId(Long memberId);
}
