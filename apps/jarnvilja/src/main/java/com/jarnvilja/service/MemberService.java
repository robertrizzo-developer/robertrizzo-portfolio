package com.jarnvilja.service;

import com.jarnvilja.dto.MemberProfileDTO;
import com.jarnvilja.dto.MembershipStatsDTO;
import com.jarnvilja.model.Booking;
import com.jarnvilja.model.BookingStatus;
import com.jarnvilja.model.TrainingClass;
import com.jarnvilja.model.User;
import com.jarnvilja.repository.BookingRepository;
import com.jarnvilja.repository.TrainingClassRepository;
import com.jarnvilja.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MemberService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final TrainingClassRepository trainingClassRepository;
    private final BookingService bookingService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final DemoGuard demoGuard;

    @Autowired
    public MemberService(UserRepository userRepository, BookingRepository bookingRepository,
                         TrainingClassRepository trainingClassRepository, BookingService bookingService,
                         EmailService emailService, PasswordEncoder passwordEncoder, DemoGuard demoGuard) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.trainingClassRepository = trainingClassRepository;
        this.bookingService = bookingService;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.demoGuard = demoGuard;
    }

    // Hantera medlem:
    public void registerUser (User user) {
        createMember(user);
    }

    @Transactional
    public User createMember(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public User updateMember(Long memberId, User updatedMember) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        if (demoGuard.isDemoUser()) {
            log.info("Demo profile update simulated: userId={}", memberId);
            return member;
        }
        member.setUsername(updatedMember.getUsername());
        member.setEmail(updatedMember.getEmail());
        return userRepository.save(member);
    }

    @Transactional
    public void deleteMember(Long memberId) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        userRepository.delete(member);
    }

    public User getMemberById(Long memberId) {
        return userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    public List<User> getAllMembers() {
        return userRepository.findAll();
    }

    public User getMemberByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    @Transactional
    public User updateMemberPassword(Long memberId, String newPassword) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        if (demoGuard.isDemoUser()) {
            log.info("Demo password change simulated: userId={}", memberId);
            return member;
        }
        member.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(member);
    }

    public User getMemberByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }


    // Bokningar:


    public String checkBookingStatus(Long memberId, Long trainingClassId) {
        // Kontrollera om passet har startat
        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Training class not found"));

        if (trainingClass.getTrainingDay().equals(DayOfWeek.from(LocalDate.now())) &&
                trainingClass.getStartTime().isBefore(LocalTime.now())) {
            return "This training class has already started.";
        }

        // Kontrollera om medlemmen redan har bokat samma pass för dagen
        List<Booking> existingBookings = bookingRepository.findByMemberIdAndTrainingClassIdAndBookingDate(
                memberId, trainingClassId, LocalDate.now());

        // Filtrera bort avbokade bokningar
        existingBookings = existingBookings.stream()
                .filter(booking -> !booking.getBookingStatus().equals(BookingStatus.CANCELLED))
                .toList();

        if (!existingBookings.isEmpty()) {
            return "You have already booked this training class for today.";
        }

        return null;
    }

    @Transactional
    public Booking createBooking(Long memberId, Long trainingClassId) {
        if (demoGuard.isDemoUser()) {
            log.info("Demo booking simulated: userId={}, classId={}", memberId, trainingClassId);
            User user = userRepository.findById(memberId).orElse(null);
            TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId).orElse(null);
            if (user != null && trainingClass != null) {
                Booking simulated = new Booking(user, trainingClass);
                simulated.setBookingStatus(BookingStatus.CONFIRMED);
                simulated.setBookingTimeStamp(LocalDateTime.now());
                return simulated;
            }
        }

        Booking booking = bookingService.createBooking(memberId, trainingClassId);

        if (booking.getBookingStatus() == BookingStatus.CONFIRMED) {
            User user = booking.getMember();
            TrainingClass trainingClass = booking.getTrainingClass();
            try {
                emailService.sendEmail(user.getEmail(), "Bokning bekräftad",
                        "Hej " + user.getUsername() + ",\n\n" +
                                "Din bokning för träningspasset " + trainingClass.getTitle() +
                                " den " + trainingClass.getTrainingDay() + " kl. " +
                                trainingClass.getStartTime() + " har bekräftats.\n\n" +
                                "Vänliga hälsningar,\n" +
                                "Järnvilja");
            } catch (Exception e) {
                log.warn("Failed to send booking email to {}: {}", user.getEmail(), e.getMessage());
            }
        }

        return booking;
    }


    @Transactional
    public Booking confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getBookingStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not pending and cannot be confirmed");
        }

        booking.setBookingStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    @Transactional
    public void expirePendingBookings() {
        List<Booking> pendingBookings = bookingRepository.findPendingBookingsBefore(LocalDateTime.now().minusMinutes(30));

        for (Booking booking : pendingBookings) {
            booking.setBookingStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
        }
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        if (demoGuard.isDemoUser()) {
            log.info("Demo cancellation simulated: bookingId={}", bookingId);
            return;
        }

        Booking booking = bookingService.cancelBooking(bookingId);
        User user = booking.getMember();
        TrainingClass trainingClass = booking.getTrainingClass();

        try {
            emailService.sendEmail(
                    user.getEmail(),
                    "Bekräftelse på avbokning",
                    "Hej " + user.getUsername() + ",\n\n" +
                            "Du har nu avbokat din plats till träningspasset \"" + trainingClass.getTitle() + "\" " +
                            trainingClass.getTrainingDay() + " kl. " + trainingClass.getStartTime() + ".\n\n" +
                            "Vi hoppas få se dig en annan gång!\n\n" +
                            "Vänliga hälsningar,\n" +
                            "Järnvilja"
            );
        } catch (Exception e) {
            log.warn("Failed to send cancellation email to {}: {}", user.getEmail(), e.getMessage());
        }
    }


    public List<Booking> getBookingsForMember(Long userId) {
        return bookingRepository.findByMemberId(userId);
    }


    public List<Booking> getUpcomingBookingsForMember(Long userId) {
        return bookingRepository.findUpcomingBookingsForMember(userId, LocalDate.now());
    }

    public List<Booking> getPastBookingsForMember(Long userId) {
        return bookingRepository.findPastBookingsForMember(userId, LocalDate.now());
    }

    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }


    // Träningspass:

    public List<TrainingClass> getAvailableClasses() {
        return trainingClassRepository.findAll();
    }

    public List<TrainingClass> searchAvailableClasses(String search) {
        return trainingClassRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search);
    }

    public List<TrainingClass> sortClasses(List<TrainingClass> classes, String sort) {
        switch (sort) {
            case "title":
                classes.sort(Comparator.comparing(TrainingClass::getTitle));
                break;
            case "description":
                classes.sort(Comparator.comparing(TrainingClass::getDescription));
                break;
            case "trainingDay":
                classes.sort(Comparator.comparing(TrainingClass::getTrainingDay));
                break;
            case "startTime":
                classes.sort(Comparator.comparing(TrainingClass::getStartTime));
                break;
            case "endTime":
                classes.sort(Comparator.comparing(TrainingClass::getEndTime));
                break;
            default:
                break;
        }
        return classes;
    }

    public List<TrainingClass> getAllClassesForMember(Long memberId) {
        List<Booking> bookings = bookingRepository.findByMemberId(memberId);
        return bookings.stream()
                .map(Booking::getTrainingClass)
                .collect(Collectors.toList());
    }

    public MemberProfileDTO getMemberProfile(Long memberId) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        return new MemberProfileDTO(member.getId(), member.getUsername(), member.getEmail());
    }

    public MembershipStatsDTO getMembershipStats(Long memberId) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        List<Booking> bookings = bookingRepository.findByMemberId(memberId);
        List<Booking> confirmed = bookings.stream()
                .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED)
                .toList();

        int totalBookings = confirmed.size();

        String mostBooked = confirmed.stream()
                .filter(b -> b.getTrainingClass() != null)
                .collect(Collectors.groupingBy(b -> b.getTrainingClass().getTitle(), Collectors.counting()))
                .entrySet().stream()
                .max(java.util.Map.Entry.comparingByValue())
                .map(java.util.Map.Entry::getKey)
                .orElse("–");

        MembershipStatsDTO stats = new MembershipStatsDTO(member.getId(), totalBookings, mostBooked, member.getCreatedAt());

        if (member.getCreatedAt() != null) {
            long weeks = java.time.temporal.ChronoUnit.WEEKS.between(member.getCreatedAt(), LocalDate.now());
            stats.setAvgSessionsPerWeek(weeks > 0 ? (double) totalBookings / weeks : totalBookings);
        }

        java.util.Map<Integer, Long> weeklyMap = confirmed.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getBookingDate().get(java.time.temporal.IsoFields.WEEK_OF_WEEK_BASED_YEAR),
                        Collectors.counting()));
        int streak = 0;
        int currentWeek = LocalDate.now().get(java.time.temporal.IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        for (int w = currentWeek; w > 0; w--) {
            if (weeklyMap.containsKey(w)) {
                streak++;
            } else {
                break;
            }
        }
        stats.setCurrentStreak(streak);

        confirmed.stream()
                .filter(b -> b.getTrainingClass() != null && b.getTrainingClass().getCategory() != null)
                .collect(Collectors.groupingBy(b -> b.getTrainingClass().getCategory().name(), Collectors.counting()))
                .forEach((cat, count) -> stats.getCategoryBreakdown().put(cat, count.intValue()));

        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        confirmed.stream()
                .filter(b -> b.getBookingDate().isAfter(sixMonthsAgo))
                .collect(Collectors.groupingBy(
                        b -> b.getBookingDate().getYear() + "-" + String.format("%02d", b.getBookingDate().getMonthValue()),
                        Collectors.counting()))
                .entrySet().stream()
                .sorted(java.util.Map.Entry.comparingByKey())
                .forEach(e -> stats.getMonthlyTrend().put(e.getKey(), e.getValue().intValue()));

        return stats;
    }


}
