package com.jarnvilja.service;

import com.jarnvilja.model.Booking;
import com.jarnvilja.model.BookingStatus;
import com.jarnvilja.model.ClassStatus;
import com.jarnvilja.model.TrainingClass;
import com.jarnvilja.model.User;
import com.jarnvilja.repository.BookingRepository;
import com.jarnvilja.repository.TrainingClassRepository;
import com.jarnvilja.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Slf4j
@Service
public class TrainerService {

    @Autowired
    private TrainingClassRepository trainingClassRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EmailService emailService;


    // Hämta detaljer för ett specifikt träningspass som tränaren håller
    public TrainingClass getTrainingClassDetails(Long trainerId, Long trainingClassId) {
        Optional<TrainingClass> trainingClass = trainingClassRepository.findById(trainingClassId);
        if (trainingClass.isPresent() && trainingClass.get().getTrainer().getId().equals(trainerId)) {
            return trainingClass.get();
        }
        throw new RuntimeException("Träningspasset finns inte eller du har inte behörighet att se det.");
    }


    // Deltagarhantering:

    // Hämta alla bokningar för tränarens pass
    public List<Booking> getBookingsForMyTrainingClass(Long trainerId, Long trainingClassId) {
        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Training class not found"));

        if (!trainingClass.getTrainer().getId().equals(trainerId)) {
            throw new RuntimeException("Trainer does not have access to this class");
        }

        return bookingRepository.findByTrainingClassId(trainingClassId);
    }

    // Hämta alla medlemmar som är bokade på tränarens pass
    public List<User> getMembersForMyTrainingClass(Long trainerId, Long trainingClassId) {
        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Training class not found"));

        if (!trainingClass.getTrainer().getId().equals(trainerId)) {
            throw new RuntimeException("Trainer does not have access to this class");
        }

        List<Booking> bookings = bookingRepository.findByTrainingClassId(trainingClassId);
        return bookings.stream().map(Booking::getMember).collect(Collectors.toList());
    }

    // Ta bort en medlem från tränarens pass
    @Transactional
    public void removeMemberFromMyTrainingClass(Long trainerId, Long trainingClassId, Long memberId) {
        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Training class not found"));

        if (!trainingClass.getTrainer().getId().equals(trainerId)) {
            throw new RuntimeException("Trainer does not have access to this class");
        }

        Booking booking = bookingRepository.findByTrainingClassIdAndMemberId(trainingClassId, memberId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        bookingRepository.delete(booking);
    }

    // Påminnelse och frånvaro:

    public void sendReminderForUpcomingClass(Long trainingClassId, Long trainerId) {
        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Träningspass ej hittat"));

        // Säkerställ att tränaren endast får påminnelse om sina egna pass
        if (!trainingClass.getTrainer().getId().equals(trainerId)) {
            throw new RuntimeException("Du har inte behörighet att skicka påminnelser för detta pass");
        }

        try {
            emailService.sendEmail(
                    trainingClass.getTrainer().getEmail(),
                    "Påminnelse: " + trainingClass.getTitle(),
                    "Ditt pass: '" + trainingClass.getTitle() + "' startar snart!"
            );
        } catch (Exception e) {
            log.warn("Failed to send email: {}", e.getMessage());
        }
    }

    @Transactional
    public void cancelMyTrainingClass(Long trainingClassId, String reason) {
        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Träningspass ej hittat"));

        // Markera passet som inställt
        trainingClass.setStatus(ClassStatus.CANCELLED);

        try {
            emailService.sendEmail(
                    trainingClass.getTrainer().getEmail(),
                    "Träningspass inställt",
                    "Du har ställt in passet '" + trainingClass.getTitle() + "'."
            );
        } catch (Exception e) {
            log.warn("Failed to send email: {}", e.getMessage());
        }

        if (trainingClass.getBookings() != null) {
            for (Booking booking : trainingClass.getBookings()) {
                booking.setBookingStatus(BookingStatus.CANCELLED);

                try {
                    emailService.sendEmail(
                            booking.getMember().getEmail(),
                            "Träningspass inställt",
                            "Hej, ditt pass '" + trainingClass.getTitle() + "' har blivit inställt. Anledning: " + reason
                    );
                } catch (Exception e) {
                    log.warn("Failed to send email: {}", e.getMessage());
                }
            }
        }

        // Spara ändringarna i databasen
        trainingClassRepository.save(trainingClass);
    }

    // Statistik för tränarens pass:

    // Hämta statistik för ett specifikt pass (antal bokningar)
    public long getTrainingClassStats(Long trainerId, Long trainingClassId) {
        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Träningspass ej hittat"));

        // Kontrollera att tränaren äger passet
        if (!trainingClass.getTrainer().getId().equals(trainerId)) {
            throw new RuntimeException("Du har inte behörighet att se detta pass.");
        }

        return bookingRepository.countByTrainingClassId(trainingClassId);
    }

    // Hämta tränarens mest populära pass
    public TrainingClass getMostPopularOfMyTrainingClasses(Long trainerId) {
        return trainingClassRepository.findMostPopularTrainingClassByTrainer(trainerId)
                .orElseThrow(() -> new RuntimeException("Inga träningspass hittades för denna tränare."));
    }

}
