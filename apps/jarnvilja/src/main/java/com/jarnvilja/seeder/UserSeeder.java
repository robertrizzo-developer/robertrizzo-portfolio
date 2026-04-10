package com.jarnvilja.seeder;

import com.jarnvilja.model.User;
import com.jarnvilja.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import static com.jarnvilja.model.Role.*;

@Slf4j
@Component
@Order(1)
public class UserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(ROLE_ADMIN);

            User member = new User();
            member.setUsername("member");
            member.setEmail("member@example.com");
            member.setPassword(passwordEncoder.encode("member123"));
            member.setRole(ROLE_MEMBER);

            User trainer = new User();
            trainer.setUsername("trainer");
            trainer.setEmail("trainer@example.com");
            trainer.setPassword(passwordEncoder.encode("trainer123"));
            trainer.setRole(ROLE_TRAINER);

            User demoMember = new User();
            demoMember.setUsername("demo");
            demoMember.setEmail("demo_member@example.com");
            demoMember.setPassword(passwordEncoder.encode("demo123"));
            demoMember.setRole(ROLE_MEMBER);
            demoMember.setDemo(true);

            User demoAdmin = new User();
            demoAdmin.setUsername("demo_admin");
            demoAdmin.setEmail("demo_admin@example.com");
            demoAdmin.setPassword(passwordEncoder.encode("demo123"));
            demoAdmin.setRole(ROLE_ADMIN);
            demoAdmin.setDemo(true);

            User demoTrainer = new User();
            demoTrainer.setUsername("demo_trainer");
            demoTrainer.setEmail("demo_trainer@example.com");
            demoTrainer.setPassword(passwordEncoder.encode("demo123"));
            demoTrainer.setRole(ROLE_TRAINER);
            demoTrainer.setDemo(true);

            userRepository.save(admin);
            userRepository.save(member);
            userRepository.save(trainer);
            userRepository.save(demoMember);
            userRepository.save(demoAdmin);
            userRepository.save(demoTrainer);

            log.info("Seeded 6 users (3 base + 3 demo accounts)");
        } else {
            log.info("Users already exist, skipping seed");
        }
    }
}
