package com.studylog.member.controller;

import com.studylog.member.dto.MemberLoginRequest;
import com.studylog.member.dto.MemberLoginResponse;
import com.studylog.member.dto.MemberResponse;
import com.studylog.member.dto.MemberSignupRequest;
import com.studylog.member.repository.MemberRepository;
import com.studylog.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {

    private final MemberRepository memberRepository;
    private final MemberService memberService;

    @PostMapping
    public MemberResponse signUp (
            @RequestBody MemberSignupRequest request
            ) {
        return memberService.signUp(request);
    }

    @PostMapping("/login")
    public ResponseEntity<MemberLoginResponse> login (
            @Valid @RequestBody MemberLoginRequest request
            ) {
        return ResponseEntity.ok(
                memberService.login(request)
        );
    }

    @GetMapping("/me")
    public MemberResponse getMe(@AuthenticationPrincipal Long memberId) {
        return memberService.findMe(memberId);
    }
}
