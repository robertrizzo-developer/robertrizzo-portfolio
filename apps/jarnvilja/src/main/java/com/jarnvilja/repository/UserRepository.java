package com.jarnvilja.repository;

import com.jarnvilja.model.Role;
import com.jarnvilja.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    List<User> findUsersByRole(Role role);
    Page<User> findUsersByRole(Role role, Pageable pageable);
    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
    Page<User> findUsersByRoleAndUsernameContainingIgnoreCase(Role role, String username, Pageable pageable);
    long count();
}
