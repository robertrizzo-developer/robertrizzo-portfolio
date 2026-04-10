package com.jarnvilja.controller;

import com.jarnvilja.model.*;
import com.jarnvilja.repository.TrainingClassRepository;
import com.jarnvilja.repository.UserRepository;
import com.jarnvilja.service.BookingService;
import com.jarnvilja.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class BookingControllerTest {

    @Mock
    private BookingService bookingService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private TrainingClassRepository trainingClassRepository;

    @InjectMocks
    private BookingController bookingController;

    private User member;
    private TrainingClass trainingClass;

    @BeforeEach
    public void setup() {

        MockitoAnnotations.openMocks(this);

        member = new User();
        member.setId(1L);

        trainingClass = new TrainingClass();
        trainingClass.setId(1L);
    }

    // createBooking() → Testa att skapa en bokning för en medlem och verifiera att den sparas korrekt (POST /members/{userId}/bookings)
    @Test
    void testCreateBooking() {
        Long userId = 1L;
        Long trainingClassId = 1L;

        // Mocka användare och träningsklass
        User user = new User();
        user.setId(userId);

        TrainingClass trainingClass = new TrainingClass();
        trainingClass.setId(trainingClassId);
        trainingClass.setTitle("Yoga");

        // Mocka bokning
        Booking booking = new Booking();
        booking.setTrainingClass(trainingClass);
        booking.setMember(user); // Sätt medlemmen i bokningen

        // Mocka tjänsten för att returnera den skapade bokningen
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass));
        when(bookingService.isBookingValid(any(Booking.class))).thenReturn(true);
        when(bookingService.createBooking(userId, trainingClassId)).thenReturn(booking);

        // Anropa createBooking-metoden i controller
        ResponseEntity<Booking> response = bookingController.createBooking(userId, booking);

        // Verifiera att svaret är korrekt
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(trainingClass.getTitle(), response.getBody().getTrainingClass().getTitle());

        // Testa ogiltig bokning
        when(bookingService.isBookingValid(any(Booking.class))).thenReturn(false);
        ResponseEntity<Booking> invalidResponse = bookingController.createBooking(userId, booking);

        // Verifiera att svaret är 400 BAD REQUEST för ogiltig bokning
        assertEquals(HttpStatus.BAD_REQUEST, invalidResponse.getStatusCode());
    }

    // cancelBooking() → Testa att avboka en bokning och verifiera att status ändras (DELETE /bookings/{bookingId})
    @Test
    void testCancelBooking() {
        // Anta att vi har en bokning med ett specifikt ID
        Long bookingId = 1L;
        Booking booking = new Booking();
        booking.setId(bookingId);
        booking.setBookingStatus(BookingStatus.CONFIRMED); // Initial status

        Booking cancelledBooking = new Booking();
        cancelledBooking.setBookingStatus(BookingStatus.CANCELLED);

        // Mocka tjänsten för att returnera bokningen när cancelBooking anropas
        when(bookingService.cancelBooking(bookingId)).thenReturn(cancelledBooking);

        // Anropa cancelBooking-metoden i controller
        ResponseEntity<Booking> response = bookingController.cancelBooking(bookingId);

        // Verifiera att svaret är korrekt
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(BookingStatus.CANCELLED, response.getBody().getBookingStatus());
    }

    // getBookingById() → Testa att hämta en bokning med giltigt ID och verifiera att rätt bokning returneras (GET /bookings/{bookingId})
    @Test
    void testGetBookingById() {
        // Anta att vi har en bokning med ett specifikt ID
        Long bookingId = 1L;
        Booking booking = new Booking();
        booking.setId(bookingId);
        booking.setBookingStatus(BookingStatus.CONFIRMED); // Sätt status

        // Mocka tjänsten för att returnera bokningen när getBookingById anropas
        when(bookingService.getBookingById(bookingId)).thenReturn(booking);

        // Anropa getBookingById-metoden i controller
        ResponseEntity<Booking> response = bookingController.getBookingById(bookingId);

        // Verifiera att svaret är korrekt
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(bookingId, response.getBody().getId());
        assertEquals(BookingStatus.CONFIRMED, response.getBody().getBookingStatus());
    }

    // getAllBookings() → Testa att hämta alla bokningar och verifiera att listan är korrekt (GET /bookings)
    @Test
    void testGetAllBookings() {
        // Skapa en lista med exempelbokningar
        Booking booking1 = new Booking();
        booking1.setId(1L);
        booking1.setBookingStatus(BookingStatus.CONFIRMED);

        Booking booking2 = new Booking();
        booking2.setId(2L);
        booking2.setBookingStatus(BookingStatus.PENDING);

        List<Booking> bookings = Arrays.asList(booking1, booking2);

        // Mocka tjänsten för att returnera listan med bokningar
        when(bookingService.getAllBookings()).thenReturn(bookings);

        // Anropa getAllBookings-metoden i controller
        ResponseEntity<List<Booking>> response = bookingController.getAllBookings();

        // Verifiera att svaret är korrekt
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size()); // Kontrollera storleken på listan
        assertEquals(booking1.getId(), response.getBody().get(0).getId());
        assertEquals(booking2.getId(), response.getBody().get(1).getId());
    }

    // getAllBookingsByMemberId() → Testa att hämta alla bokningar för en specifik medlem och verifiera att rätt bokningar returneras (GET /members/{memberId}/bookings)
    @Test
    void testGetAllBookingsByMemberId() {
        Long memberId = 1L;

        // Skapa exempelbokningar för medlemmen
        Booking booking1 = new Booking();
        booking1.setId(1L);
        booking1.setMember(new User(memberId)); // Sätt medlemmen
        booking1.setBookingStatus(BookingStatus.CONFIRMED);

        Booking booking2 = new Booking();
        booking2.setId(2L);
        booking2.setMember(new User(memberId)); // Sätt medlemmen
        booking2.setBookingStatus(BookingStatus.PENDING);

        List<Booking> bookings = Arrays.asList(booking1, booking2);

        // Mocka tjänsten för att returnera listan med bokningar för medlemmen
        when(bookingService.getAllBookingsByMemberId(memberId)).thenReturn(bookings);

        // Anropa getAllBookingsByMemberId-metoden i controller
        ResponseEntity<List<Booking>> response = bookingController.getAllBookingsByMemberId(memberId);

        // Verifiera att svaret är korrekt
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size()); // Kontrollera storleken på listan
        assertEquals(booking1.getId(), response.getBody().get(0).getId());
        assertEquals(booking2.getId(), response.getBody().get(1).getId());
    }

    // isBookingValid() → Testa att verifiera om en bokning är giltig (kan vara en intern metod, men kan testas om den exponeras) (kan vara en del av POST /members/{userId}/bookings)
    @Test
    void testIsBookingValid() {
        // Skapa en giltig bokning
        TrainingClass trainingClass = new TrainingClass();
        trainingClass.setId(1L);

        Booking validBooking = new Booking();
        validBooking.setId(1L);
        validBooking.setBookingStatus(BookingStatus.CONFIRMED);
        validBooking.setTrainingClass(trainingClass);
        validBooking.setMember(new User(1L)); // Sätt en medlem
        validBooking.setBookingTimeStamp(LocalDateTime.now());
        validBooking.setBookingDate(LocalDate.now());

        // Mocka beteendet för bookingService
        when(bookingService.isBookingValid(validBooking)).thenReturn(true); // Mocka isBookingValid för att returnera true
        when(bookingService.createBooking(any(Long.class), any(Long.class))).thenReturn(validBooking);
        when(bookingService.validateBookingTime(any(Booking.class), any(TrainingClass.class))).thenReturn(true); // Mocka validateBookingTime

        // Mocka användare
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User(1L)));

        // Anropa createBooking och verifiera resultatet
        ResponseEntity<Booking> response = bookingController.createBooking(1L, validBooking);

        // Kontrollera att svaret är 201 CREATED
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(validBooking, response.getBody());
    }

    // validateBookingTime() → Testa att validera bokningens tid i förhållande till träningspasset (kan vara en intern metod, men kan testas om den exponeras)
    @Test
    void testValidateBookingTime() {
        // Skapa en giltig träningsklass
        TrainingClass trainingClass = new TrainingClass(
                "Yoga",
                "En avslappnande klass",
                DayOfWeek.MONDAY,
                Matta.MATTA_1,
                LocalTime.of(17, 0), // Starttid
                LocalTime.of(18, 0)  // Sluttid
        );

        // Skapa en giltig bokning
        Booking validBooking = new Booking(
                new User(1L), // Skapa en medlem
                trainingClass
        );
        validBooking.setBookingTimeStamp(LocalDateTime.of(2023, 10, 1, 16, 30)); // Bokningstid innan träningspasset

        // Mocka beteendet för bookingService
        when(bookingService.validateBookingTime(any(Booking.class), any(TrainingClass.class))).thenReturn(true);

        // Anropa validateBookingTime och verifiera resultatet
        boolean isValid = bookingController.validateBookingTime(validBooking, trainingClass);

        // Kontrollera att tiden är giltig
        assertTrue(isValid);
    }

    // getTotalBookingsForClass() → Testa att hämta totala bokningar för en klass och verifiera att rätt antal returneras (GET /classes/{trainingClassId}/bookings/total)
    @Test
    void testGetTotalBookingsForClass() {
        Long trainingClassId = 1L;
        int expectedTotalBookings = 5;

        // Mocka beteendet för bookingService
        when(bookingService.getTotalBookingsForClass(trainingClassId)).thenReturn(expectedTotalBookings);

        // Anropa getTotalBookingsForClass och verifiera resultatet
        ResponseEntity<Integer> response = bookingController.getTotalBookingsForClass(trainingClassId);

        // Kontrollera att svaret är 200 OK och att det totala antalet bokningar är korrekt
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedTotalBookings, response.getBody());
    }

    // getTotalBookingsForMember() → Testa att hämta totala bokningar för en medlem och verifiera att rätt antal returneras (GET /members/{memberId}/bookings/total)
    @Test
    void testGetTotalBookingsForMember() {
        Long memberId = 1L;
        int expectedTotalBookings = 3;

        // Mocka beteendet för bookingService
        when(bookingService.getTotalBookingsForMember(memberId)).thenReturn(expectedTotalBookings);

        // Anropa getTotalBookingsForMember och verifiera resultatet
        ResponseEntity<Integer> response = bookingController.getTotalBookingsForMember(memberId);

        // Kontrollera att svaret är 200 OK och att det totala antalet bokningar är korrekt
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedTotalBookings, response.getBody());
    }

    // getUpcomingBookingsForMember() → Testa att hämta kommande bokningar för en medlem och verifiera att rätt bokningar returneras (GET /members/{memberId}/bookings/upcoming)
    @Test
    void testGetUpcomingBookingsForMember() {
        Long memberId = 1L;

        // Skapa en lista med kommande bokningar
        Booking booking1 = new Booking(/* initiera med nödvändiga parametrar */);
        booking1.setBookingTimeStamp(LocalDateTime.now().plusDays(1)); // Kommande bokning
        Booking booking2 = new Booking(/* initiera med nödvändiga parametrar */);
        booking2.setBookingTimeStamp(LocalDateTime.now().plusDays(2)); // Kommande bokning

        List<Booking> expectedUpcomingBookings = Arrays.asList(booking1, booking2);

        // Mocka beteendet för bookingService
        when(bookingService.getUpcomingBookingsForMember(memberId)).thenReturn(expectedUpcomingBookings);

        // Anropa getUpcomingBookingsForMember och verifiera resultatet
        ResponseEntity<List<Booking>> response = bookingController.getUpcomingBookingsForMember(memberId);

        // Kontrollera att svaret är 200 OK och att de kommande bokningarna är korrekta
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedUpcomingBookings, response.getBody());
    }

    // getPastBookingsForMember() → Testa att hämta tidigare bokningar för en medlem och verifiera att rätt bokningar returneras (GET /members/{memberId}/bookings/past)
    @Test
    void testGetPastBookingsForMember() {
        Long memberId = 1L;

        // Skapa en lista med tidigare bokningar
        Booking booking1 = new Booking(/* initiera med nödvändiga parametrar */);
        booking1.setBookingTimeStamp(LocalDateTime.now().minusDays(1)); // Tidigare bokning
        Booking booking2 = new Booking(/* initiera med nödvändiga parametrar */);
        booking2.setBookingTimeStamp(LocalDateTime.now().minusDays(2)); // Tidigare bokning

        List<Booking> expectedPastBookings = Arrays.asList(booking1, booking2);

        // Mocka beteendet för bookingService
        when(bookingService.getPastBookingsForMember(memberId)).thenReturn(expectedPastBookings);

        // Anropa getPastBookingsForMember och verifiera resultatet
        ResponseEntity<List<Booking>> response = bookingController.getPastBookingsForMember(memberId);

        // Kontrollera att svaret är 200 OK och att de tidigare bokningarna är korrekta
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedPastBookings, response.getBody());
    }

    // updateBooking() → Testa att uppdatera en bokning och verifiera att ändringarna sparas (PUT /bookings/{bookingId})
    @Test
    void testUpdateBooking() {
        Long bookingId = 1L;
        Booking updatedBooking = new Booking(/* initiera med nödvändiga parametrar */);
        Booking existingBooking = new Booking(/* initiera med nödvändiga parametrar */);

        // Mocka beteendet för bookingService
        when(bookingService.updateBooking(bookingId, updatedBooking)).thenReturn(existingBooking);

        // Anropa updateBooking och verifiera resultatet
        ResponseEntity<Booking> response = bookingController.updateBooking(bookingId, updatedBooking);

        // Kontrollera att svaret är 200 OK och att den uppdaterade bokningen är korrekt
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(existingBooking, response.getBody());
    }

    @Test
    void testUpdateBookingNotFound() {
        Long bookingId = 1L;
        Booking updatedBooking = new Booking(/* initiera med nödvändiga parametrar */);

        // Mocka beteendet för bookingService så att den returnerar null
        when(bookingService.updateBooking(bookingId, updatedBooking)).thenReturn(null);

        // Anropa updateBooking och verifiera resultatet
        ResponseEntity<Booking> response = bookingController.updateBooking(bookingId, updatedBooking);

        // Kontrollera att svaret är 404 NOT FOUND
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    // confirmBooking() → Testa att bekräfta en bokning och verifiera att status ändras (PATCH /bookings/{bookingId}/confirm)
    @Test
    void testConfirmBooking() {
        Long bookingId = 1L;
        Booking confirmedBooking = new Booking(/* initiera med nödvändiga parametrar */);

        // Mocka beteendet för bookingService
        when(bookingService.confirmBooking(bookingId)).thenReturn(confirmedBooking);

        // Anropa confirmBooking och verifiera resultatet
        ResponseEntity<Booking> response = bookingController.confirmBooking(bookingId);

        // Kontrollera att svaret är 200 OK och att den bekräftade bokningen är korrekt
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(confirmedBooking, response.getBody());
    }

    @Test
    void testConfirmBookingNotFound() {
        Long bookingId = 1L;

        // Mocka beteendet för bookingService så att den returnerar null
        when(bookingService.confirmBooking(bookingId)).thenReturn(null);

        // Anropa confirmBooking och verifiera resultatet
        ResponseEntity<Booking> response = bookingController.confirmBooking(bookingId);

        // Kontrollera att svaret är 404 NOT FOUND
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    // deleteBookingsByClassId() → Testa att ta bort alla bokningar för en klass och verifiera att de tas bort (DELETE /classes/{trainingClassId}/bookings)
    @Test
    void testDeleteBookingsByClassId() {
        Long trainingClassId = 1L;

        // Call the delete method
        ResponseEntity<Void> response = bookingController.deleteBookingsByClassId(trainingClassId);

        // Verify that the service method was called
        verify(bookingService, times(1)).deleteBookingsByClassId(trainingClassId);

        // Check that the response is 204 NO CONTENT
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    // getAvailableTrainingClasses() → Testa att hämta tillgängliga träningspass och verifiera att listan är korrekt (GET /classes/available)
    @Test
    void testGetAvailableTrainingClasses() {
        // Skapa en lista med tillgängliga träningspass
        TrainingClass class1 = new TrainingClass(/* initiera med nödvändiga parametrar */);
        TrainingClass class2 = new TrainingClass(/* initiera med nödvändiga parametrar */);
        List<TrainingClass> expectedAvailableClasses = Arrays.asList(class1, class2);

        // Mocka beteendet för bookingService
        when(bookingService.getAvailableTrainingClasses()).thenReturn(expectedAvailableClasses);

        // Anropa getAvailableTrainingClasses och verifiera resultatet
        ResponseEntity<List<TrainingClass>> response = bookingController.getAvailableTrainingClasses();

        // Kontrollera att svaret är 200 OK och att listan med tillgängliga klasser är korrekt
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedAvailableClasses, response.getBody());
    }

    // sendBookingConfirmation() → Testa att skicka en bokningsbekräftelse via e-post (kan vara en intern metod, men kan testas om den exponeras)
    @Test
    void testSendBookingConfirmation() {
        Long bookingId = 1L;
        User member = new User();
        member.setEmail("test@example.com"); // Sätt e-postadress för medlemmen

        Booking booking = new Booking();
        booking.setMember(member); // Sätt medlemmen i bokningen

        // Mocka beteendet för bookingService
        when(bookingService.getBookingById(bookingId)).thenReturn(booking);

        // Anropa sendBookingConfirmation och verifiera resultatet
        ResponseEntity<Void> response = bookingController.sendBookingConfirmation(bookingId);

        // Kontrollera att e-posttjänsten anropades
        verify(emailService, times(1)).sendEmail("test@example.com", "Bokningsbekräftelse", "Din bokning är bekräftad!");

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testSendBookingConfirmationNotFound() {
        Long bookingId = 1L;

        // Mocka beteendet för bookingService så att den returnerar null
        when(bookingService.getBookingById(bookingId)).thenReturn(null);

        // Anropa sendBookingConfirmation och verifiera resultatet
        ResponseEntity<Void> response = bookingController.sendBookingConfirmation(bookingId);

        // Kontrollera att svaret är 404 NOT FOUND
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testSendBookingConfirmationMemberNotFound() {
        Long bookingId = 1L;
        Booking booking = new Booking();
        booking.setMember(null); // Ingen medlem

        // Mocka beteendet för bookingService
        when(bookingService.getBookingById(bookingId)).thenReturn(booking);

        // Anropa sendBookingConfirmation och verifiera resultatet
        ResponseEntity<Void> response = bookingController.sendBookingConfirmation(bookingId);

        // Kontrollera att svaret är 404 NOT FOUND
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testSendBookingConfirmationEmailNotFound() {
        Long bookingId = 1L;
        User member = new User();
        member.setEmail(null); // Ingen e-postadress

        Booking booking = new Booking();
        booking.setMember(member); // Sätt medlemmen i bokningen

        // Mocka beteendet för bookingService
        when(bookingService.getBookingById(bookingId)).thenReturn(booking);

        // Anropa sendBookingConfirmation och verifiera resultatet
        ResponseEntity<Void> response = bookingController.sendBookingConfirmation(bookingId);

        // Kontrollera att svaret är 400 BAD REQUEST
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
