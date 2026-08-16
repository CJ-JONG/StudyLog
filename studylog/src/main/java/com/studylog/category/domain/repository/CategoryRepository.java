package com.studylog.category.domain.repository;

import com.studylog.category.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByMemberId(Long memberId);
}
