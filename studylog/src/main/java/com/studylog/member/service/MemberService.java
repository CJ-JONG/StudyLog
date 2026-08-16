package com.studylog.member.service;

import com.studylog.global.security.jwt.JwtProvider;
import com.studylog.member.domain.Member;
import com.studylog.member.dto.MemberLoginRequest;
import com.studylog.member.dto.MemberLoginResponse;
import com.studylog.member.dto.MemberResponse;
import com.studylog.member.dto.MemberSignupRequest;
import com.studylog.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository  memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Transactional
    public MemberResponse signUp(MemberSignupRequest request) {

        // 이메일 중복 검사
        if (memberRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(request.password());
        // 회원 생성
        Member member = new Member(
                request.email(), encodedPassword, request.nickname()
        );

        //DB 저장
        Member savedMember = memberRepository.save(member);


        // 응답 DTO 반환
        return toResponse(savedMember);
    }

   public MemberLoginResponse login (MemberLoginRequest request) {
        Member member = memberRepository.findByEmail((request.email()))
                .orElseThrow( () -> new IllegalArgumentException(
                        "이메일 또는 비밀번호가 올바르지 않습니다."
                ));

       if (!passwordEncoder.matches(
               request.password(), member.getPassword()
       )) {
           throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");

       }
       String accessToken = jwtProvider.createToken(member.getId());

       return new MemberLoginResponse(accessToken,"Bearer", toResponse(member));
   }

   public MemberResponse findMe(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "존재하지 않는 회원입니다."
                ));
        return toResponse(member);
   }

    private MemberResponse toResponse(Member member) {
        return new MemberResponse(
                member.getId(), member.getEmail(), member.getNickname()
        );
    }
}
