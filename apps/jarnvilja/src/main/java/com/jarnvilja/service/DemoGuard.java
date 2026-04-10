package com.jarnvilja.service;

import com.jarnvilja.model.User;
import com.jarnvilja.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class DemoGuard {

    private final UserRepository userRepository;

    public DemoGuard(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean isDemoUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return false;
        User user = userRepository.findByUsername(auth.getName()).orElse(null);
        return user != null && user.isDemo();
    }
}
