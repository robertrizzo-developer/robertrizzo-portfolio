package com.jarnvilja.controller;


import com.jarnvilja.model.User;
import com.jarnvilja.service.MemberService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import static com.jarnvilja.model.Role.ROLE_MEMBER;

@Controller
public class RegistrationController {

    private final MemberService memberService;
    private final PasswordEncoder passwordEncoder;

    public RegistrationController(MemberService memberService, PasswordEncoder passwordEncoder) {
        this.memberService = memberService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public String register(@ModelAttribute User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(ROLE_MEMBER);
        memberService.registerUser(user);
        return "redirect:/login?success";
    }
}
