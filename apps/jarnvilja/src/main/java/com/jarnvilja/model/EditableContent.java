package com.jarnvilja.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "editable_content", uniqueConstraints = @UniqueConstraint(columnNames = "content_key"))
public class EditableContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content_key", nullable = false, unique = true, length = 255)
    private String key;

    @Column(name = "content_value", columnDefinition = "TEXT")
    private String value;

    @Column(name = "last_modified")
    private LocalDateTime lastModified;

    public EditableContent(String key, String value) {
        this.key = key;
        this.value = value;
        this.lastModified = LocalDateTime.now();
    }
}
