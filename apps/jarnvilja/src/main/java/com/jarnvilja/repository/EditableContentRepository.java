package com.jarnvilja.repository;

import com.jarnvilja.model.EditableContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EditableContentRepository extends JpaRepository<EditableContent, Long> {

    Optional<EditableContent> findByKey(String key);

    boolean existsByKey(String key);
}
