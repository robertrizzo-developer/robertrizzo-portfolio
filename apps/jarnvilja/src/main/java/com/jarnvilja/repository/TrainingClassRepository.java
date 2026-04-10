package com.jarnvilja.repository;

import com.jarnvilja.model.TrainingClass;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingClassRepository extends JpaRepository<TrainingClass, Long> {

    // Hämta alla träningspass
    List<TrainingClass> findAll();

    List<TrainingClass> findByTrainerId(Long trainerId);


    // Hämta alla tillgängliga träningspass som har en tränare och inte har startat än
    @Query("SELECT tc FROM TrainingClass tc WHERE tc.trainer IS NOT NULL AND tc.startTime > CURRENT_TIME")
    List<TrainingClass> findAvailableClasses();

    // Hämta träningspass som en specifik medlem har bokat
    @Query("SELECT b.trainingClass FROM Booking b WHERE b.member.id = :memberId")
    List<TrainingClass> findTrainingClassesForMember(@Param("memberId") Long memberId);

    // Hämta det mest populära träningspasset för en tränare (baserat på flest bokningar)
    @Query("SELECT t FROM TrainingClass t WHERE t.trainer.id = :trainerId ORDER BY (SELECT COUNT(b) FROM Booking b WHERE b.trainingClass = t) DESC")
    Optional<TrainingClass> findMostPopularTrainingClassByTrainer(@Param("trainerId") Long trainerId);


    @Query("SELECT tc FROM TrainingClass tc WHERE tc.trainingDay >= :currentDate")
    List<TrainingClass> findUpcomingTrainingClasses(@Param("currentDate") LocalDate currentDate);

    List<TrainingClass> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    List<TrainingClass> findAll(Sort sort);

    Optional<TrainingClass> findByTitleAndTrainingDayAndStartTime(String title, DayOfWeek trainingDay, LocalTime startTime);

    @Query("SELECT tc FROM TrainingClass tc WHERE tc.trainingDay < :currentDate")
    List<TrainingClass> findPastTrainingClasses(@Param("currentDate") LocalDate currentDate);

    List<TrainingClass> findByTitleContainingIgnoreCase(String title);



}

