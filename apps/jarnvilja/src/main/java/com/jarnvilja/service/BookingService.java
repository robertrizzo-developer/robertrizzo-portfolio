package com.jarnvilja.service;

import com.jarnvilja.dto.BookingStatsDTO;
import com.jarnvilja.model.Booking;
import com.jarnvilja.model.BookingStatus;
import com.jarnvilja.model.TrainingClass;
import com.jarnvilja.model.User;
import com.jarnvilja.repository.BookingRepository;
import com.jarnvilja.repository.TrainingClassRepository;
import com.jarnvilja.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {
    private final EmailService emailService;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TrainingClassRepository trainingClassRepository;
    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, TrainingClassRepository trainingClassRepository, EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.trainingClassRepository = trainingClassRepository;
        this.emailService = emailService;
    }

    public BookingStatsDTO getBookingStats() {
        List<Booking> allBookings = bookingRepository.findAll();

        long totalBookings = allBookings.size();
        long confirmedBookings = allBookings.stream().filter(booking -> booking.getBookingStatus() == BookingStatus.CONFIRMED).count();
        long cancelledBookings = allBookings.stream().filter(booking -> booking.getBookingStatus() == BookingStatus.CANCELLED).count();
        long pendingBookings = allBookings.stream().filter(booking -> booking.getBookingStatus() == BookingStatus.PENDING).count();
        long cancelledBookingsByMember = allBookings.stream().filter(booking -> booking.getBookingStatus() == BookingStatus.CANCELLED && booking.isCancelledByMember()).count();
        long expiredBookings = allBookings.stream().filter(Booking::isExpired).count();
        String mostPopularClass = getMostPopularClass(allBookings); // Implementera logik för att hämta den mest populära klassen

        return new BookingStatsDTO(totalBookings, confirmedBookings, cancelledBookings, pendingBookings, cancelledBookingsByMember, expiredBookings, mostPopularClass);
    }

    // Bokning

    /**
     * Creates a booking for the given member and class. Validates: class not started,
     * member not already booked for today, and enforces max capacity (waitlist if full).
     */
    @Transactional
    public Booking createBooking(Long userId, Long trainingClassId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TrainingClass trainingClass = trainingClassRepository.findById(trainingClassId)
                .orElseThrow(() -> new RuntimeException("Training class not found"));

        LocalDate today = LocalDate.now();
        DayOfWeek todayDay = today.getDayOfWeek();

        if (!trainingClass.getTrainingDay().equals(todayDay)) {
            throw new RuntimeException("Passet är inte idag.");
        }
        if (trainingClass.getStartTime().isBefore(LocalTime.now())) {
            throw new RuntimeException("Passet har redan startat.");
        }

        List<Booking> existing = bookingRepository.findByMemberIdAndTrainingClassIdAndBookingDate(
                userId, trainingClassId, today);
        boolean alreadyBooked = existing.stream()
                .anyMatch(b -> b.getBookingStatus() != BookingStatus.CANCELLED
                        && b.getBookingStatus() != BookingStatus.CANCELLED_BY_MEMBER
                        && b.getBookingStatus() != BookingStatus.EXPIRED);
        if (alreadyBooked) {
            throw new RuntimeException("Du har redan bokat detta pass idag.");
        }

        List<BookingStatus> countedStatuses = Arrays.asList(BookingStatus.CONFIRMED, BookingStatus.WAITLISTED);
        long currentCount = bookingRepository.countByTrainingClassIdAndBookingDateAndBookingStatusIn(
                trainingClassId, today, countedStatuses);
        int maxCapacity = trainingClass.getMaxCapacity() > 0 ? trainingClass.getMaxCapacity() : 20;
        BookingStatus status = (currentCount >= maxCapacity) ? BookingStatus.WAITLISTED : BookingStatus.CONFIRMED;

        Booking booking = new Booking();
        booking.setMember(user);
        booking.setTrainingClass(trainingClass);
        booking.setBookingStatus(status);
        booking.setBookingTimeStamp(LocalDateTime.now());
        booking.setBookingDate(today);

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);

        if (bookingOptional.isPresent()) {
            Booking booking = bookingOptional.get();
            booking.setBookingStatus(BookingStatus.CANCELLED);
            return bookingRepository.save(booking); // Returnera den avbokade bokningen
        } else {
            throw new RuntimeException("Booking with ID " + bookingId + " not found");
        }
    }

    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking with ID " + bookingId + " not found"));
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getAllBookingsByMemberId(Long memberId) {
        return bookingRepository.findBookingsByMemberId(memberId);
    }

    public boolean isBookingValid(Booking booking) {
        return booking != null &&
                booking.getBookingStatus() == BookingStatus.CONFIRMED &&
                Objects.nonNull(booking.getMember()) &&
                Objects.nonNull(booking.getTrainingClass()) &&
                Objects.nonNull(booking.getTrainingClass().getTitle()) &&
                Objects.nonNull(booking.getBookingTimeStamp()) &&
                Objects.nonNull(booking.getBookingDate());
    }

    public boolean validateBookingTime(Booking booking, TrainingClass trainingClass) {
        if (booking == null || trainingClass == null) return false;

        return booking.getBookingTimeStamp().getDayOfWeek() == trainingClass.getTrainingDay() &&
                booking.getBookingTimeStamp().isBefore(
                        LocalDateTime.of(booking.getBookingTimeStamp().toLocalDate(), trainingClass.getStartTime())
                );
    }


    // Bokningsstatistik:

    public int getTotalBookingsForClass(Long trainingClassId) {
       List<Booking> totalBookingsForClass = bookingRepository.findByTrainingClassId(trainingClassId);
       return totalBookingsForClass.size();
    }

    /**
     * Count of CONFIRMED + WAITLISTED bookings for the given class on the given date (for capacity display).
     */
    public int getConfirmedCountForClassOnDate(Long trainingClassId, LocalDate date) {
        List<BookingStatus> statuses = Arrays.asList(BookingStatus.CONFIRMED, BookingStatus.WAITLISTED);
        return (int) bookingRepository.countByTrainingClassIdAndBookingDateAndBookingStatusIn(
                trainingClassId, date, statuses);
    }

    public int getTotalBookingsForMember(Long memberId) {
        List<Booking> totalBookingsForMember = bookingRepository.findByMemberId(memberId);
        return totalBookingsForMember.size();
    }

    public List<Booking> getUpcomingBookingsForMember(Long memberId) {
        List<Booking> allBookingsForMember = bookingRepository.findByMemberId(memberId);
        LocalDateTime now = LocalDateTime.now();
        return allBookingsForMember.stream()
                .filter(booking -> booking.getBookingTimeStamp().isAfter(now))
                .collect(Collectors.toList());
    }

    public List<Booking> getPastBookingsForMember(Long memberId) {
        List<Booking> allBookingsForMember = bookingRepository.findByMemberId(memberId);
        LocalDateTime now = LocalDateTime.now();
        return allBookingsForMember.stream()
                .filter(booking -> booking.getBookingTimeStamp().isBefore(now))
                .collect(Collectors.toList());
    }

    // Bokningshantering:

    @Transactional
    public Booking updateBooking(Long bookingId, Booking updatedBooking) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);

        if (bookingOptional.isEmpty()) {
            throw new RuntimeException("Booking with ID " + bookingId + " not found");
        }

        Booking existingBooking = bookingOptional.get();
        existingBooking.setBookingStatus(updatedBooking.getBookingStatus());
        existingBooking.setBookingTimeStamp(updatedBooking.getBookingTimeStamp());
        existingBooking.setMember(updatedBooking.getMember());
        existingBooking.setTrainingClass(updatedBooking.getTrainingClass());

        return bookingRepository.save(existingBooking);
    }

    @Transactional
    public Booking confirmBooking(Long bookingId) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
        if (bookingOptional.isEmpty()) {
            throw new RuntimeException("Booking with ID " + bookingId + " not found");
        }
        Booking booking = bookingOptional.get();
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    @Transactional
    public void deleteBookingsByClassId(Long trainingClassId) {
        bookingRepository.deleteByTrainingClassId(trainingClassId);
    }

    // Tillgänglighet:

    public List<TrainingClass> getAvailableTrainingClasses() {
        return trainingClassRepository.findAll();
    }

    public void sendBookingConfirmation(Booking booking) {
        if (booking == null || booking.getMember() == null) return;

        Optional<User> memberOptional = userRepository.findById(booking.getMember().getId());
        if (memberOptional.isPresent()) {
            User member = memberOptional.get();
            String email = member.getEmail();
            String subject = "Bokningsbekräftelse";
            String message = "Din bokning för " + booking.getTrainingClass().getTitle() + " är bekräftad.";

            emailService.sendEmail(email, subject, message);
        }
    }


    // Övrigt:

    public Optional<Booking> getBookingByClassAndUser(Long classId, Long memberId) {
        return bookingRepository.findByTrainingClassIdAndMemberId(classId, memberId);
    }

    @Transactional
    public void cancelAllBookingsForMember(Long memberId) {
        List<Booking> bookings = bookingRepository.findByMemberId(memberId);
        for (Booking booking : bookings) {
            booking.setBookingStatus(BookingStatus.CANCELLED);
        }
        bookingRepository.saveAll(bookings);
    }

    private String getMostPopularClass(List<Booking> bookings) {
        Map<String, Long> classCount = new HashMap<>();

        // Räkna antalet bokningar per klass
        for (Booking booking : bookings) {
            String className = booking.getTrainingClass().getTitle(); // Anta att du har en metod för att hämta klassens namn
            classCount.put(className, classCount.getOrDefault(className, 0L) + 1);
        }

        // Hitta den mest populära klassen
        String mostPopularClass = null;
        long maxCount = 0;

        for (Map.Entry<String, Long> entry : classCount.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                mostPopularClass = entry.getKey();
            }
        }

        return mostPopularClass != null ? mostPopularClass : "No classes booked"; // Hantera fallet där inga klasser har bokats
    }


}
