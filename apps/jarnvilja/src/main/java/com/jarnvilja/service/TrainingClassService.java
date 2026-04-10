package com.jarnvilja.service;

import com.jarnvilja.dto.TrainingClassStatsDTO;
import com.jarnvilja.model.Booking;
import com.jarnvilja.model.BookingStatus;
import com.jarnvilja.model.TrainingClass;
import com.jarnvilja.model.User;
import com.jarnvilja.repository.BookingRepository;
import com.jarnvilja.repository.TrainingClassRepository;
import com.jarnvilja.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainingClassService {
    private final TrainingClassRepository trainingClassRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public TrainingClassService(TrainingClassRepository trainingClassRepository,
                                UserRepository userRepository,
                                BookingRepository bookingRepository) {
        this.trainingClassRepository = trainingClassRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    // Hantera träningspass:

    // ✅ Skapa ett nytt träningspass
    public TrainingClass createTrainingClass(TrainingClass trainingClass) {
        return trainingClassRepository.save(trainingClass);
    }

    // ✅ Uppdatera ett befintligt träningspass
    public TrainingClass updateTrainingClass(Long trainingClassId, TrainingClass updatedClass) {
        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Träningspass ej hittat"));

        trainingClass.setTitle(updatedClass.getTitle());
        trainingClass.setDescription(updatedClass.getDescription());
        trainingClass.setTrainingDay(updatedClass.getTrainingDay());
        trainingClass.setStartTime(updatedClass.getStartTime());
        trainingClass.setEndTime(updatedClass.getEndTime());

        return trainingClassRepository.save(trainingClass);
    }

    // ✅ Ta bort ett träningspass
    public void deleteTrainingClass(Long trainingClassId) {
        trainingClassRepository.deleteById(trainingClassId);
    }

    // ✅ Hämta träningspass baserat på ID
    public TrainingClass getTrainingClassById(Long trainingClassId) {
        return trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Träningspass ej hittat"));
    }

    // ✅ Hämta alla träningspass
    public List<TrainingClass> getAllTrainingClasses() {
        return trainingClassRepository.findAvailableClasses();
    }


    // ✅ Hämta alla träningspass för en specifik tränare
    public List<TrainingClass> getTrainingClassesForTrainer(Long trainerId) {
        return trainingClassRepository.findByTrainerId(trainerId);
    }

    public List<TrainingClass> getTrainingClassesForMember(Long memberId) {
        return trainingClassRepository.findTrainingClassesForMember(memberId);
    }


    // Schemaläggning och tillgänglighet:

    public TrainingClass scheduleTrainingClass(TrainingClass trainingClass) {
        return trainingClassRepository.save(trainingClass);
    }

    public void updateTrainingClassSchedule(Long trainingClassId, DayOfWeek newDay, LocalTime newStartTime, LocalTime newEndTime) {
        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Träningspass ej hittat"));

        trainingClass.setTrainingDay(newDay);
        trainingClass.setStartTime(newStartTime);
        trainingClass.setEndTime(newEndTime);

        trainingClassRepository.save(trainingClass);
    }


    // Tränare och deltagare:

    public void assignTrainerToTrainingClass(Long trainingClassId, Long trainerId) {
        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Träningspass ej hittat"));

        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Tränare ej hittad"));

        trainingClass.setTrainer(trainer);

        trainingClassRepository.save(trainingClass);
    }

    public void removeTrainerFromTrainingClass(Long trainingClassId) {
        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Träningspass ej hittat"));

        trainingClass.setTrainer(null);

        trainingClassRepository.save(trainingClass);
    }

    public void addMemberToTrainingClass(Long trainingClassId, Long memberId) {
        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Träningspass ej hittat"));

        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Medlem ej hittad"));

        Booking booking = new Booking();
        booking.setTrainingClass(trainingClass);
        booking.setMember(member);
        booking.setBookingStatus(BookingStatus.CONFIRMED);

        bookingRepository.save(booking);
    }

    public void removeMemberFromTrainingClass(Long trainingClassId, Long memberId) {
        Booking booking = bookingRepository.findByTrainingClassIdAndMemberId(trainingClassId, memberId)
                .orElseThrow(() -> new RuntimeException("Bokning ej hittad"));

        bookingRepository.delete(booking);
    }


    // Statistik:

    public TrainingClassStatsDTO getTrainingClassStats(Long trainingClassId) {
        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Träningspass ej hittat"));

        int bookingCount = trainingClass.getBookings().size();

        return new TrainingClassStatsDTO(trainingClassId, bookingCount);
    }

    public List<TrainingClass> getUpcomingTrainingClasses() {
        return trainingClassRepository.findUpcomingTrainingClasses(LocalDate.now());
    }

    public List<TrainingClass> getPastTrainingClasses() {
        return trainingClassRepository.findPastTrainingClasses(LocalDate.now());
    }


    // Övrigt:

    public List<TrainingClass> getTrainingClassByType(String type) {
        return trainingClassRepository.findByTitleContainingIgnoreCase(type);
    }

    public List<TrainingClass> getMemberTrainingClassHistory(Long memberId) {
        // Hämta alla bokningar för medlemmen
        List<Booking> bookings = bookingRepository.findByMemberId(memberId);

        // Extrahera alla träningspass från bokningarna
        return bookings.stream()
                .map(Booking::getTrainingClass)
                .collect(Collectors.toList());
    }

}
