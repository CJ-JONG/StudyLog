package com.studylog.member.repository;

import com.studylog.member.domain.Member;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class
MemberRepositoryTest {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void savesAndFindsMemberWithMysql() {
        Member member = new Member(
                "member-" + UUID.randomUUID() + "@test.com",
                "password",
                "tester"
        );

        Member savedMember = memberRepository.saveAndFlush(member);
        Long savedId = (Long) ReflectionTestUtils.getField(savedMember, "id");

        entityManager.clear();

        assertThat(savedId).isNotNull();
        assertThat(memberRepository.findById(savedId)).isPresent();
    }
}
