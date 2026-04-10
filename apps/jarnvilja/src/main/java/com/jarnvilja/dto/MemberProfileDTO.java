package com.jarnvilja.dto;

import java.time.LocalDate;

public class MemberProfileDTO {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private boolean profileVisible;
    private String createdAt;
    private boolean demo;

    public MemberProfileDTO(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public MemberProfileDTO(Long id, String username, String email, String firstName, String lastName,
                            String role, boolean profileVisible, LocalDate createdAt, boolean demo) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.profileVisible = profileVisible;
        this.createdAt = createdAt != null ? createdAt.toString() : null;
        this.demo = demo;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getRole() { return role; }
    public boolean isProfileVisible() { return profileVisible; }
    public String getCreatedAt() { return createdAt; }
    public boolean isDemo() { return demo; }
}
