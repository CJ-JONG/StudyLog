package com.studylog.studylog.repository;

import com.studylog.category.domain.Category;
import com.studylog.category.domain.repository.CategoryRepository;
import com.studylog.member.domain.Member;
import com.studylog.member.repository.MemberRepository;
import com.studylog.studylog.domain.StudyLog;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class StudyLogRepositoryTest {

    @Autowired
    private StudyLogRepository studyLogRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void savesAndFindsStudyLogWithMysql() {
        Member member = memberRepository.saveAndFlush(new Member(
                "studylog-member-" + UUID.randomUUID() + "@test.com",
                "password",
                "tester"
        ));
        Category category = categoryRepository.saveAndFlush(
                new Category(member, "study-" + UUID.randomUUID())
        );
        StudyLog studyLog = new StudyLog(
                member,
                category,
                "study title",
                "study content",
                LocalDate.now(),
                60
        );

        StudyLog savedStudyLog = studyLogRepository.saveAndFlush(studyLog);
        Long savedId = (Long) ReflectionTestUtils.getField(savedStudyLog, "id");

        entityManager.clear();

        assertThat(savedId).isNotNull();
        assertThat(studyLogRepository.findById(savedId)).isPresent();
    }
}
