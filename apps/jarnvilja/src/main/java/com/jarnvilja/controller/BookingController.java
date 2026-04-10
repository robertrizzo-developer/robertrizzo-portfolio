package com.jarnvilja.controller;

import com.jarnvilja.model.Booking;
import com.jarnvilja.model.TrainingClass;
import com.jarnvilja.model.User;
import com.jarnvilja.repository.UserRepository;
import com.jarnvilja.service.BookingService;
import com.jarnvilja.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    private final EmailService emailService;
    private final UserRepository userRepository;

    @Autowired
    public BookingController(BookingService bookingService, EmailService emailService, UserRepository userRepository) {
        this.bookingService = bookingService;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    @PostMapping("/members/{userId}/bookings")
    public ResponseEntity<Booking> createBooking(@PathVariable Long userId, @RequestBody Booking booking) {
        // Hämta användaren
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Returnera 404 om användaren inte finns
        }

        // Hämta träningsklassen
        TrainingClass trainingClass = booking.getTrainingClass();
        if (trainingClass == null || trainingClass.getId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Returnera 400 om träningsklassen inte är giltig
        }

        // Validera bokningen
        if (!bookingService.isBookingValid(booking)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Returnera 400 om bokningen är ogiltig
        }

        // Skapa bokningen
        Booking createdBooking = bookingService.createBooking(userId, trainingClass.getId());
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }

    public boolean validateBookingTime(Booking booking, TrainingClass trainingClass) {
        return bookingService.validateBookingTime(booking, trainingClass);
    }

    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long bookingId) {
        Booking cancelledBooking = bookingService.cancelBooking(bookingId);
        return new ResponseEntity<>(cancelledBooking, HttpStatus.OK);
    }

    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long bookingId) {
        Booking booking = bookingService.getBookingById(bookingId);
        return new ResponseEntity<>(booking, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/members/{memberId}/bookings")
    public ResponseEntity<List<Booking>> getAllBookingsByMemberId(@PathVariable Long memberId) {
        List<Booking> bookings = bookingService.getAllBookingsByMemberId(memberId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/classes/{trainingClassId}/bookings/total")
    public ResponseEntity<Integer> getTotalBookingsForClass(@PathVariable Long trainingClassId) {
        int totalBookings = bookingService.getTotalBookingsForClass(trainingClassId);
        return new ResponseEntity<>(totalBookings, HttpStatus.OK);
    }

    @GetMapping("/members/{memberId}/total")
    public ResponseEntity<Integer> getTotalBookingsForMember(@PathVariable Long memberId) {
        int totalBookings = bookingService.getTotalBookingsForMember(memberId);
        return new ResponseEntity<>(totalBookings, HttpStatus.OK);
    }

    @GetMapping("/members/{memberId}/upcoming")
    public ResponseEntity<List<Booking>> getUpcomingBookingsForMember(@PathVariable Long memberId) {
        List<Booking> upcomingBookings = bookingService.getUpcomingBookingsForMember(memberId);
        return new ResponseEntity<>(upcomingBookings, HttpStatus.OK);
    }

    @GetMapping("/members/{memberId}/past")
    public ResponseEntity<List<Booking>> getPastBookingsForMember(@PathVariable Long memberId) {
        List<Booking> pastBookings = bookingService.getPastBookingsForMember(memberId);
        return new ResponseEntity<>(pastBookings, HttpStatus.OK);
    }

    @PutMapping("/{bookingId}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long bookingId, @RequestBody Booking updatedBooking) {
        Booking booking = bookingService.updateBooking(bookingId, updatedBooking);
        if (booking == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Returnera 404 om bokningen inte hittas
        }
        return new ResponseEntity<>(booking, HttpStatus.OK); // Returnera den uppdaterade bokningen med 200 OK
    }

    @PatchMapping("/{bookingId}/confirm")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Long bookingId) {
        Booking booking = bookingService.confirmBooking(bookingId);
        if (booking == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Returnera 404 om bokningen inte hittas
        }
        return new ResponseEntity<>(booking, HttpStatus.OK); // Returnera den bekräftade bokningen med 200 OK
    }


    @DeleteMapping("/classes/{trainingClassId}/bookings")
    public ResponseEntity<Void> deleteBookingsByClassId(@PathVariable Long trainingClassId) {
        bookingService.deleteBookingsByClassId(trainingClassId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Return 204 No Content on successful deletion
    }

    @GetMapping("/classes/available")
    public ResponseEntity<List<TrainingClass>> getAvailableTrainingClasses() {
        List<TrainingClass> availableClasses = bookingService.getAvailableTrainingClasses();
        return new ResponseEntity<>(availableClasses, HttpStatus.OK); // Returnera listan med tillgängliga klasser med 200 OK
    }

    @PostMapping("/{bookingId}/confirm")
    public ResponseEntity<Void> sendBookingConfirmation(@PathVariable Long bookingId) {
        // Hämta bokningsinformation
        Booking booking = bookingService.getBookingById(bookingId);
        if (booking == null || booking.getMember() == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        String to = booking.getMember().getEmail(); // Hämta e-postadress från medlemmen
        if (to == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Returnera 400 om medlemmen inte har en e-postadress
        }

        String subject = "Bokningsbekräftelse";
        String text = "Din bokning är bekräftad!"; // Anpassa med bokningsdetaljer

        emailService.sendEmail(to, subject, text);
        return new ResponseEntity<>(HttpStatus.OK); // Returnera 200 OK efter att ha skickat e-post
    }
}
