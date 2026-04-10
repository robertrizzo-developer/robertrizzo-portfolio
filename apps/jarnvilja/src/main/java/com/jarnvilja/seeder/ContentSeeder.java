package com.jarnvilja.seeder;

import com.jarnvilja.repository.EditableContentRepository;
import com.jarnvilja.service.ContentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Order(0)
@ConditionalOnProperty(name = "app.seed.content", havingValue = "true", matchIfMissing = true)
public class ContentSeeder implements CommandLineRunner {

    private final ContentService contentService;
    private final EditableContentRepository repository;

    public ContentSeeder(ContentService contentService, EditableContentRepository repository) {
        this.contentService = contentService;
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        seedIfMissing("homepage.hero.title",
                "Det är inte de starkaste som vinner -- det är de som aldrig slutar kämpa.");
        seedIfMissing("homepage.hero.subtitle", "Bli Medlem idag!");
        seedIfMissing("about.intro", "Järnvilja Kampsport erbjuder träning i BJJ, thaiboxning, boxning och fys.");
        seedIfMissing("contact.info", "Kontakt: info@jarnvilja.se | Telefon: 012-345 67 89");
    }

    private void seedIfMissing(String key, String value) {
        if (!repository.existsByKey(key)) {
            contentService.save(key, value);
            log.info("Seeded editable content: {}", key);
        }
    }
}
