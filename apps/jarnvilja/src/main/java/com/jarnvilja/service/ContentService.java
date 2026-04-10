package com.jarnvilja.service;

import com.jarnvilja.model.EditableContent;
import com.jarnvilja.repository.EditableContentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContentService {

    private final EditableContentRepository repository;

    public ContentService(EditableContentRepository repository) {
        this.repository = repository;
    }

    /**
     * Returns the value for the given key, or null if not found.
     */
    public String get(String key) {
        return repository.findByKey(key)
                .map(EditableContent::getValue)
                .orElse(null);
    }

    /**
     * Returns the value for the given key, or the default if not found.
     */
    public String get(String key, String defaultValue) {
        String value = get(key);
        return value != null && !value.isBlank() ? value : defaultValue;
    }

    /**
     * Saves or updates content for the given key.
     */
    @Transactional
    public EditableContent save(String key, String value) {
        EditableContent content = repository.findByKey(key)
                .orElse(new EditableContent(key, value));
        content.setValue(value);
        content.setLastModified(LocalDateTime.now());
        return repository.save(content);
    }

    /**
     * Returns all editable content entries (for admin listing).
     */
    public List<EditableContent> findAll() {
        return repository.findAll();
    }
}
