package com.studylog.member.dto;

public record MemberLoginResponse(
        String accessToken,
        String tokenType,
        MemberResponse member
) {
}
