package com.studylog.studylog.domain;

import com.studylog.category.domain.Category;
import com.studylog.member.domain.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "studylog")
public class StudyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDate studyDate;

    @Column(nullable = false)
    private Integer studyMinutes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public StudyLog(
            Member member,
            Category category,
            String title,
            String content,
            LocalDate studyDate,
            Integer studyMinutes
    ) {
        this.member = member;
        this.category = category;
        this.title = title;
        this.content = content;
        this.studyDate = studyDate;
        this.studyMinutes = studyMinutes;
    }

    public void update(
            Category category,
            String title,
            String content,
            LocalDate studyDate,
            Integer studyMinutes
    ) {
        this.category = category;
        this.title = title;
        this.content = content;
        this.studyDate = studyDate;
        this.studyMinutes = studyMinutes;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
