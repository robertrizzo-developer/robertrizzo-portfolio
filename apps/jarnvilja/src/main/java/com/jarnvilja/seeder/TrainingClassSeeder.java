package com.jarnvilja.seeder;

import com.jarnvilja.model.*;
import com.jarnvilja.repository.TrainingClassRepository;
import com.jarnvilja.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Optional;

import static com.jarnvilja.model.Role.ROLE_TRAINER;

@Slf4j
@Component
@Order(2)
public class TrainingClassSeeder implements CommandLineRunner {

    private final TrainingClassRepository trainingClassRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TrainingClassSeeder(TrainingClassRepository trainingClassRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.trainingClassRepository = trainingClassRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private TrainingCategory inferCategory(String title) {
        String lower = title.toLowerCase();
        if (lower.contains("bjj")) return TrainingCategory.BJJ;
        if (lower.contains("thaiboxning")) return TrainingCategory.THAIBOXNING;
        if (lower.contains("boxning")) return TrainingCategory.BOXNING;
        if (lower.contains("fys")) return TrainingCategory.FYS;
        if (lower.contains("sparring")) return TrainingCategory.SPARRING;
        return TrainingCategory.BJJ;
    }

    private void createOrUpdateTrainingClass(String title, String description, DayOfWeek day, Matta matta, LocalTime startTime, LocalTime endTime, User trainer) {
        Optional<TrainingClass> existingClass = trainingClassRepository.findByTitleAndTrainingDayAndStartTime(title, day, startTime);

        if (existingClass.isEmpty()) {
            TrainingClass trainingClass = new TrainingClass();
            trainingClass.setTitle(title);
            trainingClass.setDescription(description);
            trainingClass.setTrainingDay(day);
            trainingClass.setMatta(matta);
            trainingClass.setStartTime(startTime);
            trainingClass.setEndTime(endTime);
            trainingClass.setTrainer(trainer);
            trainingClass.setCategory(inferCategory(title));
            trainingClass.setMaxCapacity(20);
            trainingClassRepository.save(trainingClass);
            log.debug("Created training class '{}' for {} at {}", title, day, startTime);
        } else {
            log.debug("Training class '{}' for {} at {} already exists", title, day, startTime);
        }
    }

    @Override
    public void run(String... args) throws Exception {
        String defaultPw = passwordEncoder.encode("trainer123");

        User trainer1 = new User();
        trainer1.setUsername("Göran");
        trainer1.setEmail("goran@example.com");
        trainer1.setPassword(defaultPw);
        trainer1.setRole(ROLE_TRAINER);

        User trainer2 = new User();
        trainer2.setUsername("Hanna Karlsson");
        trainer2.setEmail("hanna@example.com");
        trainer2.setPassword(defaultPw);
        trainer2.setRole(ROLE_TRAINER);

        User trainer3 = new User();
        trainer3.setUsername("Fanny Berg");
        trainer3.setEmail("fanny@example.com");
        trainer3.setPassword(defaultPw);
        trainer3.setRole(ROLE_TRAINER);

        User trainer4 = new User();
        trainer4.setUsername("Micke Andersson");
        trainer4.setEmail("micke@example.com");
        trainer4.setPassword(defaultPw);
        trainer4.setRole(ROLE_TRAINER);

        User trainer5 = new User();
        trainer5.setUsername("Tony McClinch");
        trainer5.setEmail("tony@example.com");
        trainer5.setPassword(defaultPw);
        trainer5.setRole(ROLE_TRAINER);

        User trainer6 = new User();
        trainer6.setUsername("Kettlebell-Kajsa");
        trainer6.setEmail("kajsa@example.com");
        trainer6.setPassword(defaultPw);
        trainer6.setRole(Role.ROLE_TRAINER);

        User trainer7 = new User();
        trainer7.setUsername("Bella Johansson");
        trainer7.setEmail("bella@example.com");
        trainer7.setPassword(defaultPw);
        trainer7.setRole(Role.ROLE_TRAINER);

        User trainer8 = new User();
        trainer8.setUsername("Leif Benlåset");
        trainer8.setEmail("leif@example.com");
        trainer8.setPassword(defaultPw);
        trainer8.setRole(Role.ROLE_TRAINER);



        trainer1 = userRepository.save(trainer1);
        trainer2 = userRepository.save(trainer2);
        trainer3 = userRepository.save(trainer3);
        trainer4 = userRepository.save(trainer4);
        trainer5 = userRepository.save(trainer5);
        trainer6 = userRepository.save(trainer6);
        trainer7 = userRepository.save(trainer7);
        trainer8 = userRepository.save(trainer8);

        // Kontrollera om träningsklasserna redan finns
        if (trainingClassRepository.count() == 0) {
            // Skapa träningsklasser enligt schemat
            createOrUpdateTrainingClass("Thaiboxning", "Thaiboxning", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(12, 0), LocalTime.of(13, 15), trainer1);
            createOrUpdateTrainingClass("Barn Thaiboxning", "Barn Thaiboxning", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(16, 0), LocalTime.of(17, 15), trainer3);
            createOrUpdateTrainingClass("Nybörjare Thaiboxning", "Nybörjare Thaiboxning", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(17, 30), LocalTime.of(18, 55), trainer3);
            createOrUpdateTrainingClass("Forts/Avanc Thaiboxning", "Forts/Avanc Thaiboxning", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(19, 0), LocalTime.of(20, 15), trainer5);
            createOrUpdateTrainingClass("Sparring Thaiboxning", "Sparring Thaiboxning", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(20, 15), LocalTime.of(21, 15), trainer5);

            // Skapa träningsklasser enligt schemat för Matta 2 – BJJ & Fys
            createOrUpdateTrainingClass("Fys – Morgonpass", "Fys – Morgonpass", DayOfWeek.MONDAY, Matta.MATTA_2,LocalTime.of(6, 30), LocalTime.of(7, 30), trainer6);
            createOrUpdateTrainingClass("BJJ Lunchpass", "BJJ Lunchpass", DayOfWeek.MONDAY, Matta.MATTA_2, LocalTime.of(12, 0), LocalTime.of(13, 15), trainer7);
            createOrUpdateTrainingClass("Barn BJJ", "Barn BJJ", DayOfWeek.MONDAY, Matta.MATTA_2, LocalTime.of(16, 0), LocalTime.of(17, 15), trainer7);
            createOrUpdateTrainingClass("Nybörjare BJJ", "Nybörjare BJJ", DayOfWeek.MONDAY, Matta.MATTA_2,LocalTime.of(17, 30), LocalTime.of(18, 45), trainer7);
            createOrUpdateTrainingClass("Forts/Avanc BJJ", "Forts/Avanc BJJ", DayOfWeek.MONDAY, Matta.MATTA_2,LocalTime.of(19, 0), LocalTime.of(20, 15), trainer7);
            createOrUpdateTrainingClass("Sparring BJJ", "Sparring BJJ", DayOfWeek.MONDAY, Matta.MATTA_2,LocalTime.of(20, 15), LocalTime.of(21, 15), trainer8);

            // Tisdag
            createOrUpdateTrainingClass("Boxning", "Boxning", DayOfWeek.TUESDAY, Matta.MATTA_1,LocalTime.of(12, 0), LocalTime.of(13, 15), trainer2);
            createOrUpdateTrainingClass("Barn Boxning", "Barn Boxning", DayOfWeek.TUESDAY, Matta.MATTA_1,LocalTime.of(16, 0), LocalTime.of(17, 15), trainer4);
            createOrUpdateTrainingClass("Nybörjare Boxning", "Nybörjare Boxning", DayOfWeek.TUESDAY, Matta.MATTA_1,LocalTime.of(17, 30), LocalTime.of(18, 45), trainer4);
            createOrUpdateTrainingClass("Forts/Avanc Boxning", "Forts/Avanc Boxning", DayOfWeek.TUESDAY, Matta.MATTA_1,LocalTime.of(19, 0), LocalTime.of(20, 15), trainer2);
            createOrUpdateTrainingClass("Sparring Boxning", "Sparring Boxning", DayOfWeek.TUESDAY, Matta.MATTA_1,LocalTime.of(20, 15), LocalTime.of(21, 15), null);

            createOrUpdateTrainingClass("BJJ Lunchpass", "BJJ Lunchpass", DayOfWeek.TUESDAY, Matta.MATTA_2,LocalTime.of(12, 0), LocalTime.of(13, 15), trainer7);
            createOrUpdateTrainingClass("Barn BJJ", "Barn BJJ", DayOfWeek.TUESDAY, Matta.MATTA_2,LocalTime.of(16, 0), LocalTime.of(17, 15), trainer7);
            createOrUpdateTrainingClass("Nybörjare BJJ", "Nybörjare BJJ", DayOfWeek.TUESDAY, Matta.MATTA_2,LocalTime.of(17, 30), LocalTime.of(18, 45), trainer7);
            createOrUpdateTrainingClass("Forts/Avanc BJJ", "Forts/Avanc BJJ", DayOfWeek.TUESDAY, Matta.MATTA_2,LocalTime.of(19, 0), LocalTime.of(20, 15), trainer7);
            createOrUpdateTrainingClass("Sparring BJJ", "Sparring BJJ", DayOfWeek.TUESDAY, Matta.MATTA_2,LocalTime.of(20, 15), LocalTime.of(21, 15), trainer8);

            // Onsdag
            createOrUpdateTrainingClass("Thaiboxning", "Thaiboxning", DayOfWeek.WEDNESDAY, Matta.MATTA_1,LocalTime.of(12, 0), LocalTime.of(13, 15), trainer1);
            createOrUpdateTrainingClass("Barn Thaiboxning", "Barn Thaiboxning", DayOfWeek.WEDNESDAY, Matta.MATTA_1,LocalTime.of(16, 0), LocalTime.of(17, 15), trainer3);
            createOrUpdateTrainingClass("Nybörjare Thaiboxning", "Nybörjare Thaiboxning", DayOfWeek.WEDNESDAY, Matta.MATTA_1,LocalTime.of(17, 30), LocalTime.of(18, 45), trainer3);
            createOrUpdateTrainingClass("Forts/Avanc Thaiboxning", "Forts/Avanc Thaiboxning", DayOfWeek.WEDNESDAY, Matta.MATTA_1,LocalTime.of(19, 0), LocalTime.of(20, 15), trainer5);
            createOrUpdateTrainingClass("Sparring Thaiboxning", "Sparring Thaiboxning", DayOfWeek.WEDNESDAY, Matta.MATTA_1,LocalTime.of(20, 15), LocalTime.of(21, 15), null);

            createOrUpdateTrainingClass("Fys – Morgonpass", "Fys – Morgonpass", DayOfWeek.WEDNESDAY, Matta.MATTA_2,LocalTime.of(6, 30), LocalTime.of(7, 30), trainer6);
            createOrUpdateTrainingClass("BJJ Lunchpass", "BJJ Lunchpass", DayOfWeek.WEDNESDAY, Matta.MATTA_2,LocalTime.of(12, 0), LocalTime.of(13, 15), trainer7);
            createOrUpdateTrainingClass("Barn BJJ", "Barn BJJ", DayOfWeek.WEDNESDAY, Matta.MATTA_2,LocalTime.of(16, 0), LocalTime.of(17, 15), trainer7);
            createOrUpdateTrainingClass("Nybörjare BJJ", "Nybörjare BJJ", DayOfWeek.WEDNESDAY, Matta.MATTA_2,LocalTime.of(17, 30), LocalTime.of(18, 45), trainer7);
            createOrUpdateTrainingClass("Forts/Avanc BJJ", "Forts/Avanc BJJ", DayOfWeek.WEDNESDAY, Matta.MATTA_2,LocalTime.of(19, 0), LocalTime.of(20, 15), trainer7);
            createOrUpdateTrainingClass("Sparring BJJ", "Sparring BJJ", DayOfWeek.WEDNESDAY, Matta.MATTA_2,LocalTime.of(20, 15), LocalTime.of(21, 15), trainer8);

            // Torsdag
            createOrUpdateTrainingClass("Boxning", "Boxning", DayOfWeek.THURSDAY, Matta.MATTA_1,LocalTime.of(12, 0), LocalTime.of(13, 15), trainer2);
            createOrUpdateTrainingClass("Barn Boxning", "Barn Boxning", DayOfWeek.THURSDAY, Matta.MATTA_1,LocalTime.of(16, 0), LocalTime.of(17, 15), trainer4);
            createOrUpdateTrainingClass("Nybörjare Boxning", "Nybörjare Boxning", DayOfWeek.THURSDAY, Matta.MATTA_1,LocalTime.of(17, 30), LocalTime.of(18, 45), trainer4);
            createOrUpdateTrainingClass("Forts/Avanc Boxning", "Forts/Avanc Boxning", DayOfWeek.THURSDAY, Matta.MATTA_1,LocalTime.of(19, 0), LocalTime.of(20, 15), trainer2);
            createOrUpdateTrainingClass("Sparring Boxning", "Sparring Boxning", DayOfWeek.THURSDAY, Matta.MATTA_1,LocalTime.of(20, 15), LocalTime.of(21, 15), null);

            createOrUpdateTrainingClass("BJJ Lunchpass", "BJJ Lunchpass", DayOfWeek.THURSDAY, Matta.MATTA_2,LocalTime.of(12, 0), LocalTime.of(13, 15), trainer7);
            createOrUpdateTrainingClass("Barn BJJ", "Barn BJJ", DayOfWeek.THURSDAY, Matta.MATTA_2,LocalTime.of(16, 0), LocalTime.of(17, 15), trainer7);
            createOrUpdateTrainingClass("Nybörjare BJJ", "Nybörjare BJJ", DayOfWeek.THURSDAY, Matta.MATTA_2,LocalTime.of(17, 30), LocalTime.of(18, 45), trainer7);
            createOrUpdateTrainingClass("Forts/Avanc BJJ", "Forts/Avanc BJJ", DayOfWeek.THURSDAY, Matta.MATTA_2,LocalTime.of(19, 0), LocalTime.of(20, 15), trainer7);
            createOrUpdateTrainingClass("Sparring BJJ", "Sparring BJJ", DayOfWeek.THURSDAY, Matta.MATTA_2,LocalTime.of(20, 15), LocalTime.of(21, 15), trainer8);

            // Fredag
            createOrUpdateTrainingClass("Thaiboxning", "Thaiboxning", DayOfWeek.FRIDAY, Matta.MATTA_1,LocalTime.of(12, 0), LocalTime.of(13, 15), trainer1);
            createOrUpdateTrainingClass("Barn Thaiboxning", "Barn Thaiboxning", DayOfWeek.FRIDAY, Matta.MATTA_1,LocalTime.of(16, 0), LocalTime.of(17, 15), trainer3);
            createOrUpdateTrainingClass("Nybörjare Thaiboxning", "Nybörjare Thaiboxning", DayOfWeek.FRIDAY, Matta.MATTA_1,LocalTime.of(17, 30), LocalTime.of(18, 45), trainer3);
            createOrUpdateTrainingClass("Forts/Avanc Thaiboxning", "Forts/Avanc Thaiboxning", DayOfWeek.FRIDAY, Matta.MATTA_1,LocalTime.of(19, 0), LocalTime.of(20, 15), trainer5);
            createOrUpdateTrainingClass("Sparring Thaiboxning", "Sparring Thaiboxning", DayOfWeek.FRIDAY, Matta.MATTA_1,LocalTime.of(20, 15), LocalTime.of(21, 15), null);

            createOrUpdateTrainingClass("Fys – Morgonpass", "Fys – Morgonpass", DayOfWeek.FRIDAY, Matta.MATTA_2,LocalTime.of(6, 30), LocalTime.of(7, 30), trainer6);
            createOrUpdateTrainingClass("BJJ Lunchpass", "BJJ Lunchpass", DayOfWeek.FRIDAY, Matta.MATTA_2,LocalTime.of(12, 0), LocalTime.of(13, 15), trainer7);
            createOrUpdateTrainingClass("Barn BJJ", "Barn BJJ", DayOfWeek.FRIDAY, Matta.MATTA_2,LocalTime.of(16, 0), LocalTime.of(17, 15), trainer7);
            createOrUpdateTrainingClass("Nybörjare BJJ", "Nybörjare BJJ", DayOfWeek.FRIDAY, Matta.MATTA_2,LocalTime.of(17, 30), LocalTime.of(18, 45), trainer7);
            createOrUpdateTrainingClass("Forts/Avanc BJJ", "Forts/Avanc BJJ", DayOfWeek.FRIDAY, Matta.MATTA_2,LocalTime.of(19, 0), LocalTime.of(20, 15), trainer7);
            createOrUpdateTrainingClass("Sparring BJJ", "Sparring BJJ", DayOfWeek.FRIDAY, Matta.MATTA_2,LocalTime.of(20, 15), LocalTime.of(21, 15), trainer8);

            // Lördag
            createOrUpdateTrainingClass("Boxning", "Boxning - Alla nivåer", DayOfWeek.SATURDAY, Matta.MATTA_1,LocalTime.of(8, 0), LocalTime.of(9, 30), trainer2);
            createOrUpdateTrainingClass("Thaiboxning", "Thaiboxning - Alla nivåer", DayOfWeek.SATURDAY, Matta.MATTA_1,LocalTime.of(10, 0), LocalTime.of(12, 0), trainer1);


            createOrUpdateTrainingClass("BJJ", "BJJ - Alla nivåer", DayOfWeek.SATURDAY, Matta.MATTA_2,LocalTime.of(8, 0), LocalTime.of(9, 30), trainer7);
            createOrUpdateTrainingClass("BJJ", "BJJ - Alla nivåer", DayOfWeek.SATURDAY, Matta.MATTA_2,LocalTime.of(10, 0), LocalTime.of(12, 0), trainer8);

            // Söndag
            createOrUpdateTrainingClass("Boxning", "Boxning - Alla nivåer", DayOfWeek.SUNDAY, Matta.MATTA_1,LocalTime.of(8, 0), LocalTime.of(9, 30), trainer4);
            createOrUpdateTrainingClass("Thaiboxning", "Thaiboxning - Alla nivåer", DayOfWeek.SUNDAY, Matta.MATTA_1,LocalTime.of(10, 0), LocalTime.of(12, 0), trainer1);


            createOrUpdateTrainingClass("BJJ", "BJJ - Alla nivåer", DayOfWeek.SUNDAY, Matta.MATTA_2,LocalTime.of(8, 0), LocalTime.of(9, 30), trainer7);
            createOrUpdateTrainingClass("BJJ", "BJJ - Alla nivåer", DayOfWeek.SUNDAY, Matta.MATTA_2,LocalTime.of(10, 0), LocalTime.of(12, 0), trainer8);


            log.info("Seeded training classes");
        } else {
            log.info("Training classes already exist, skipping seed");
        }
    }

}
