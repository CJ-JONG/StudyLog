package com.studylog.category.service;

import com.studylog.category.domain.Category;
import com.studylog.category.domain.repository.CategoryRepository;
import com.studylog.category.dto.CategoryCreateRequest;
import com.studylog.category.dto.CategoryResponse;
import com.studylog.member.domain.Member;
import com.studylog.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.w3c.dom.stylesheets.LinkStyle;
import tools.jackson.databind.annotation.JsonAppend;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class CategoryServiceTest {

    @Autowired
    private CategoryService categoryService;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void create() {

        // given
        Member member = new Member("test@test.com", "password", "member1");

        memberRepository.save(member);

        CategoryCreateRequest request = new CategoryCreateRequest("java");

        //when
        Long categoryId = categoryService.create(member.getId(), request);

        // then
        Category findCategory = categoryRepository.findById(categoryId).orElseThrow();

        Assertions.assertThat(findCategory.getName()).isEqualTo("java");

        Assertions.assertThat(findCategory.getMember().getId()).isEqualTo(member.getId());
    }

    @Test
    void findAll() {
        // given
        Member member = new Member("test1@test.com", "password", "member1");
        memberRepository.save(member);

        Category category1 = new Category(member, "Java");
        Category category2 = new Category(member, "Spring");
        Category category3 = new Category(member, "JPA");

        categoryRepository.save(category1);
        categoryRepository.save(category2);
        categoryRepository.save(category3);

        // when
        List<CategoryResponse> categories = categoryService.findAll(member.getId());

        // then
        Assertions.assertThat(categories).hasSize(3);

        Assertions.assertThat(categories).extracting(CategoryResponse::name)
                .containsExactlyInAnyOrder("Java","Spring","JPA");

    }

    @Test
    void update() {
        // given
        Member member = new Member("test2@test.com", "password", "member1");
        memberRepository.save(member);

        Category category1 = new Category(member, "Java");
        categoryRepository.save(category1);

        // when
        category1.updateName("c++");

        // then
        Assertions.assertThat(category1.getName()).isEqualTo("c++");

    }

    @Test
    void delete() {
        Member member = new Member("test2@test.com", "password", "member1");
        memberRepository.save(member);

        Category category1 = new Category(member, "Java");
        categoryRepository.save(category1);

        categoryService.delete(member.getId(), category1.getId());

        Assertions.assertThat(categoryRepository.findById(category1.getId()))
                .isEmpty();

    }
}