package com.studylog.member.dto;

public record MemberSignupRequest(
        String email,
        String password,
        String nickname
) {
}
