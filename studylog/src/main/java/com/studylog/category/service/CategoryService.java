package com.studylog.category.service;

import com.studylog.category.domain.Category;
import com.studylog.category.domain.repository.CategoryRepository;
import com.studylog.category.dto.CategoryCreateRequest;
import com.studylog.category.dto.CategoryResponse;
import com.studylog.category.dto.CategoryUpdateRequest;
import com.studylog.member.domain.Member;
import com.studylog.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional()
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public Long create(Long memberId,
                       CategoryCreateRequest request) {

      Member member = memberRepository.findById(memberId)
              .orElseThrow(() ->
                      new IllegalArgumentException("존재하지 않는 회원입니다."));

      Category category = new Category(member, request.name());
      return categoryRepository.save(category).getId();
    }

    public List<CategoryResponse> findAll (Long memberId) {
        return categoryRepository.findAllByMemberId(memberId)
                .stream().map(category ->
                        new CategoryResponse(category.getId(),category.getName())).toList();
    }

    @Transactional
    public void update(Long memberId, Long categoryId, CategoryUpdateRequest request) {
       Category category = findOwnedCategory(memberId, categoryId);
       category.updateName(request.name());
    }

    @Transactional
    public void delete(Long memberId, Long categoryId) {
        Category category = findOwnedCategory(memberId, categoryId);
        categoryRepository.delete(category);
    }

    private Category findOwnedCategory(Long memberId, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        if (!category.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("본인의 카테고리만 접근할 수 있습니다.");
        }
        return category;
    }
}
