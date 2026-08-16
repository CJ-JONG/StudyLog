package com.studylog.category.controller;

import com.studylog.category.dto.CategoryCreateRequest;
import com.studylog.category.dto.CategoryResponse;
import com.studylog.category.dto.CategoryUpdateRequest;
import com.studylog.category.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public Long create(
           @AuthenticationPrincipal Long memberId,
           @Valid @RequestBody CategoryCreateRequest request
            ) {
        return categoryService.create(memberId, request);
    }

    @GetMapping
    public List<CategoryResponse> findAll (
            @AuthenticationPrincipal Long memberId) {
        return categoryService.findAll(memberId);
    }

    @PatchMapping("/{categoryId}")
    public void update (@AuthenticationPrincipal Long memberId,
                        @PathVariable Long categoryId,
                        @Valid @RequestBody CategoryUpdateRequest request) {
        categoryService.update(memberId,categoryId, request);
    }

    @DeleteMapping("/{categoryId}")
    public void delete (
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long categoryId){
        categoryService.delete(memberId, categoryId);
    }

}
