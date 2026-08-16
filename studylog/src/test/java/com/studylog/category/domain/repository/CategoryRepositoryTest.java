package com.studylog.category.domain.repository;

import com.studylog.category.domain.Category;
import com.studylog.member.domain.Member;
import com.studylog.member.repository.MemberRepository;
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
class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void savesAndFindsCategoryWithMysql() {
        Member member = memberRepository.saveAndFlush(new Member(
                "category-member-" + UUID.randomUUID() + "@test.com",
                "password",
                "tester"
        ));
        Category category = new Category(member, "category-" + UUID.randomUUID());

        Category savedCategory = categoryRepository.saveAndFlush(category);
        Long savedId = (Long) ReflectionTestUtils.getField(savedCategory, "id");

        entityManager.clear();

        assertThat(savedId).isNotNull();
        assertThat(categoryRepository.findById(savedId)).isPresent();
    }
}
