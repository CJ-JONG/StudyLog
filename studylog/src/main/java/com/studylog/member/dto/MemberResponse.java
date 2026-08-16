package com.studylog.member.dto;

import org.hibernate.dialect.function.ListaggStringAggEmulation;

public record MemberResponse(
        Long id, String email, String nickname
) {
}
