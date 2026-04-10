package com.jarnvilja.service;

import com.jarnvilja.model.*;
import com.jarnvilja.repository.BookingRepository;
import com.jarnvilja.repository.TrainingClassRepository;
import com.jarnvilja.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.jarnvilja.model.BookingStatus.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private EmailService emailService;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TrainingClassRepository trainingClassRepository;

    @InjectMocks
    private BookingService bookingService;

    private Booking booking;
    private Booking booking1;
    private Booking booking2;
    private Booking booking3;
    private Booking booking4;
    private User user;
    private TrainingClass trainingClass;


    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testUser");

        DayOfWeek today = LocalDate.now().getDayOfWeek();
        trainingClass = new TrainingClass("BJJ", "Brazilian Jiu-Jitsu class", today, Matta.MATTA_1, LocalTime.of(17, 0), LocalTime.of(18,0));
        trainingClass.setId(1L);
        trainingClass.setTitle("BJJ");
        trainingClass.setStartTime(LocalTime.now().plusHours(1));
        trainingClass.setMaxCapacity(20);

        LocalDateTime now = LocalDateTime.now();
        booking = new Booking(user, trainingClass);
        booking1 = new Booking(user, trainingClass);
        booking.setId(1L);
        booking.setMember(user);
        booking.setTrainingClass(trainingClass);
        booking.setBookingStatus(CONFIRMED);
        booking.setBookingTimeStamp(now);

        booking2 = new Booking(user, trainingClass);
        booking2.setId(2L);
        booking2.setMember(user);
        booking2.setBookingStatus(CONFIRMED);
        booking2.setBookingTimeStamp(now);

        booking3 = new Booking(user, trainingClass);
        booking3.setId(3L);
        booking3.setMember(user);
        booking3.setBookingStatus(CONFIRMED);
        booking3.setBookingTimeStamp(now);

        booking4 = new Booking(user, trainingClass);
        booking4.setId(4L);
        booking4.setMember(user);
        booking4.setBookingStatus(CONFIRMED);
        booking4.setBookingTimeStamp(now);

    }


    // Bokning:

    // createBooking()                        // Testar skapandet av en bokning (idag, kapacitet)
    @Test
    void testCreateBooking() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(trainingClassRepository.findById(1L)).thenReturn(Optional.of(trainingClass));
        when(bookingRepository.findByMemberIdAndTrainingClassIdAndBookingDate(1L, 1L, LocalDate.now()))
                .thenReturn(Collections.emptyList());
        when(bookingRepository.countByTrainingClassIdAndBookingDateAndBookingStatusIn(
                eq(1L), eq(LocalDate.now()), anyList())).thenReturn(0L);
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        Booking createdBooking = bookingService.createBooking(1L, 1L);

        assertNotNull(createdBooking);
        assertEquals("BJJ", createdBooking.getTrainingClass().getTitle());
        assertEquals(CONFIRMED, createdBooking.getBookingStatus());

        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    // cancelBooking()                        // Testar avbokning av en bokning
    @Test
    void testCancelBooking() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        bookingService.cancelBooking(1L);

        verify(bookingRepository, times(1)).findById(1L);
        verify(bookingRepository, times(1)).save(any(Booking.class));
        assertEquals(CANCELLED, booking.getBookingStatus(), "Bokningen ska ha status CANCELLED");
    }

    // getBookingById()                       // Testar hämtning av bokning baserat på ID
    @Test
    void testGetBookingById() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        Booking result = bookingService.getBookingById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(bookingRepository, times(1)).findById(1L);

    }

    // getAllBookings()                       // Testar hämtning av alla bokningar
    @Test
    void testGetAllBookings() {

        when(bookingRepository.findAll()).thenReturn(List.of(booking2, booking3, booking4));

        List<Booking> result = bookingService.getAllBookings();

        assertNotNull(result);
        assertEquals(3, result.size());
        verify(bookingRepository, times(1)).findAll();
    }

    // getAllBookingsByMemberId()                   // Testar hämtning av alla bokningar för en specifik användare
    @Test
    void testGetAllBookingsByMemberId() {
        List<Booking> mockBookings = List.of(booking2, booking3, booking4);

        when(bookingRepository.findBookingsByMemberId(1L)).thenReturn(mockBookings);

        List<Booking> result = bookingService.getAllBookingsByMemberId(1L);

        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals("BJJ", result.get(0).getTrainingClass().getTitle());
        verify(bookingRepository, times(1)).findBookingsByMemberId(1L);
    }


    // Verifikation och Validering:

    // isBookingValid()                       // Testar om en bokning är giltig (t.ex. om alla krav är uppfyllda)
    @Test
    void testIsBookingValid() {
        Booking validBooking = new Booking(user, trainingClass);
        validBooking.setBookingStatus(CONFIRMED);
        validBooking.setBookingTimeStamp(LocalDateTime.now());

        Booking invalidBooking = new Booking(null, trainingClass);
        invalidBooking.setBookingStatus(CONFIRMED);
        invalidBooking.setBookingTimeStamp(LocalDateTime.now());

        assertTrue(bookingService.isBookingValid(validBooking), "En giltig bokning ska returnera true");
        assertFalse(bookingService.isBookingValid(invalidBooking), "En bokning utan memberId ska returnera false");
        assertFalse(bookingService.isBookingValid(null), "Null bokning ska returnera false");
    }

    // validateBookingTime()                  // Testar om bokningstiden är korrekt (t.ex. ej för sent)
    @Test
    void testValidateBookingTime() {
        TrainingClass tc = new TrainingClass("BJJ", "desc", DayOfWeek.TUESDAY, Matta.MATTA_1, LocalTime.of(17, 0), LocalTime.of(18, 0));
        LocalDateTime beforeClassStarts = LocalDateTime.of(2025, 3, 11, 16, 59); // Tuesday
        Booking validBooking = new Booking(user, tc);
        validBooking.setBookingTimeStamp(beforeClassStarts);

        LocalDateTime afterClassStarts = LocalDateTime.of(2025, 3, 11, 17, 1);
        Booking lateBooking = new Booking(user, tc);
        lateBooking.setBookingTimeStamp(afterClassStarts);

        assertTrue(bookingService.validateBookingTime(validBooking, tc), "Bokningen borde vara giltig (gjord innan passet börjar");
        assertFalse(bookingService.validateBookingTime(lateBooking, tc), "Bokningen borde vara ogiltig (gjord efter passet har börjat");
    }


    // Bokningsstatistik:

    // getTotalBookingsForClass()             // Testar hämtning av totalantal bokningar för ett specifikt träningspass
    @Test
    void testGetTotalBookingsForClass() {
        when(bookingRepository.findByTrainingClassId(1L)).thenReturn(List.of(booking2, booking3, booking4));

        int totalBookings = bookingService.getTotalBookingsForClass(1L);

        assertEquals(3, totalBookings);

        verify(bookingRepository, times(1)).findByTrainingClassId(1L);
    }

    // getTotalBookingsForMember()               // Testar hämtning av antal bokningar för en specifik member
    @Test
    void testGetTotalBookingsForMember() {
        when(bookingRepository.findByMemberId(1L)).thenReturn(List.of(booking, booking1));

        int totalBookingsForUser = bookingService.getTotalBookingsForMember(1L);

        assertEquals(2, totalBookingsForUser);

        verify(bookingRepository, times(1)).findByMemberId(1L);
    }


    // getUpcomingBookingsForMember()           // Testar hämtning av alla kommande bokningar för en member
    @Test
    void testGetUpcomingBookingsForMember() {
        LocalDateTime now = LocalDateTime.now();

        LocalDateTime futureBookingTime = now.plusDays(1);
        Booking futureBooking = new Booking(user, trainingClass);
        futureBooking.setBookingTimeStamp(futureBookingTime);

        LocalDateTime pastBookingTime = now.minusDays(1);
        Booking pastBooking = new Booking(user, trainingClass);
        pastBooking.setBookingTimeStamp(pastBookingTime);

        when(bookingRepository.findByMemberId(1L)).thenReturn(List.of(futureBooking, pastBooking));

        List<Booking> upcomingBookings = bookingService.getUpcomingBookingsForMember(1L);

        assertNotNull(upcomingBookings);
        assertEquals(1, upcomingBookings.size());
        assertTrue(upcomingBookings.contains(futureBooking));
        assertFalse(upcomingBookings.contains(pastBooking));

        verify(bookingRepository, times(1)).findByMemberId(1L);
    }


    // getPastBookingsForMember()               // Testar hämtning av alla tidigare bokningar för en member
    @Test
    void testGetPastBookingsForMember() {
        LocalDateTime now = LocalDateTime.now();

        LocalDateTime futureBookingTime = now.plusDays(1);
        Booking futureBooking = new Booking(user, trainingClass);
        futureBooking.setBookingTimeStamp(futureBookingTime);

        LocalDateTime pastBookingTime = now.minusDays(1);
        Booking pastBooking = new Booking(user, trainingClass);
        Booking pastBooking2 = new Booking(user, trainingClass);
        pastBooking.setBookingTimeStamp(pastBookingTime);
        pastBooking2.setBookingTimeStamp(pastBookingTime);

        when(bookingRepository.findByMemberId(1L)).thenReturn(List.of(futureBooking, pastBooking, pastBooking2));

        List<Booking> pastBookings = bookingService.getPastBookingsForMember(1L);

        assertNotNull(pastBookings);
        assertEquals(2, pastBookings.size());
        assertTrue(pastBookings.contains(pastBooking));
        assertTrue(pastBookings.contains(pastBooking2));
        assertFalse(pastBookings.contains(futureBooking));

        verify(bookingRepository, times(1)).findByMemberId(1L);
    }


    // Bokningshantering:

    // updateBooking()                        // Testar uppdatering av en bokning
    @Test
    void testUpdateBooking() {
        Long bookingId = 1L;

        Booking existingBooking = new Booking(user, trainingClass);
        existingBooking.setBookingStatus(BookingStatus.CONFIRMED);
        existingBooking.setBookingTimeStamp(LocalDateTime.of(2025, 3, 11, 17, 0));

        // Mocka att vi hittar en befintlig bokning
        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(existingBooking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));


        Booking updatedBooking = new Booking(user, trainingClass);
        updatedBooking.setBookingStatus(BookingStatus.CANCELLED);
        updatedBooking.setBookingTimeStamp(LocalDateTime.of(2025, 3, 11, 17, 0));
        updatedBooking.setTrainingClass(trainingClass);

        Booking result = bookingService.updateBooking(bookingId, updatedBooking);

        assertNotNull(result, "Result should not be null");
        assertEquals(BookingStatus.CANCELLED, result.getBookingStatus());
        assertEquals(LocalDateTime.of(2025, 3, 11, 17, 0), result.getBookingTimeStamp());
        assertEquals("BJJ", result.getTrainingClass().getTitle());

        verify(bookingRepository, times(1)).save(existingBooking);
    }


    // confirmBooking()                       // Testar bekräftelse av en bokning
   @Test
    void testConfirmBooking() {
        Long bookingId = 1L;

        Booking existingBooking = new Booking(user, trainingClass);
        existingBooking.setBookingStatus(PENDING);

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(existingBooking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Booking result = bookingService.confirmBooking(bookingId);

        assertNotNull(result, "Result should not be null");
        assertEquals(CONFIRMED, result.getBookingStatus());

        verify(bookingRepository,times(1)).findById(bookingId);
        verify(bookingRepository, times(1)).save(existingBooking);

    }


    // deleteBookingsByClass()                 // Testar radering av bokningar för ett specifikt träningspass
    @Test
    void testDeleteBookingsByClassId() {
        Long trainingClassId = 1L;

        doNothing().when(bookingRepository).deleteByTrainingClassId(trainingClassId);

        bookingService.deleteBookingsByClassId(trainingClassId);

        verify(bookingRepository, times(1)).deleteByTrainingClassId(trainingClassId);
    }


    // Tillgänglighet:

    // getAvailableTrainingClasses()                  // Testar hämtning av alla tillgängliga träningspass
    @Test
    void testGetAvailableTrainingClasses() {
        TrainingClass class1 = new TrainingClass("BJJ", "Brazilian Jiu-Jitsu class", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(17, 0), LocalTime.of(18, 0));
        TrainingClass class2 = new TrainingClass("Yoga", "Relaxing yoga session", DayOfWeek.WEDNESDAY, Matta.MATTA_1, LocalTime.of(18, 0), LocalTime.of(19, 0));
        when(trainingClassRepository.findAll()).thenReturn(List.of(class1, class2));

        List<TrainingClass> availableClasses = bookingService.getAvailableTrainingClasses();

        assertNotNull(availableClasses);
        assertEquals(2, availableClasses.size());
        assertTrue(availableClasses.contains(class1));
        assertTrue(availableClasses.contains(class2));
        verify(trainingClassRepository, times(1)).findAll();
    }


    // Bokningsmeddelanden:

    // sendBookingConfirmation()              // Testar att skicka en bekräftelse på en bokning
    @Test
    void testSendBookingConfirmation() {
        Booking booking = new Booking(user, trainingClass);
        booking.setBookingStatus(CONFIRMED);
        booking.setBookingTimeStamp(LocalDateTime.of(2025, 3, 11, 17, 0));

        User member = new User();
        member.setId(1L);
        member.setEmail("test@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(member));

        bookingService.sendBookingConfirmation(booking);

        verify(emailService, times(1)).sendEmail(
                eq("test@example.com"),
                eq("Bokningsbekräftelse"),
                contains("Din bokning för BJJ är bekräftad")
        );
    }


    // Övrigt:

    // getBookingByClassAndUser()             // Testar hämtning av bokning baserat på både träningspass och användare
    @Test
    void testGetBookingByClassAndUser() {
        // Skapa användare och träningspass
        User member = new User();
        member.setId(1L);
        member.setEmail("test@example.com");

        TrainingClass trainingClass = new TrainingClass("BJJ", "Brazilian Jiu-Jitsu", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(17, 0), LocalTime.of(18, 0));
        trainingClass.setId(1L);

        // Skapa bokningen
        Booking booking = new Booking(user, trainingClass);
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        booking.setBookingTimeStamp(LocalDateTime.of(2025, 3, 11, 17, 0));

        // Mocka repository
        when(bookingRepository.findByTrainingClassIdAndMemberId(1L, 1L)).thenReturn(Optional.of(booking));

        // Debugging: Kontrollera om mockningen är korrekt
        Optional<Booking> result = bookingService.getBookingByClassAndUser(1L, 1L);
        System.out.println("Result: " + result);  // Skriv ut resultatet för att se vad det är

        // Verifiera resultatet
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getTrainingClass().getId());
        assertEquals("BJJ", result.get().getTrainingClass().getTitle());
        assertEquals(BookingStatus.CONFIRMED, result.get().getBookingStatus());

        // Verifiera att rätt metod anropades i repository
        verify(bookingRepository, times(1)).findByTrainingClassIdAndMemberId(1L, 1L);
    }

    // getUpcomingBookingsForTrainer()        // Testar hämtning av alla kommande bokningar för en specifik tränare
    @Test
    void testGetUpcomingBookingsForTrainer() {

    }

    // cancelAllBookingsForMember()             // Testar att avboka alla bokningar för en specifik användare
    @Test
    void testCancelAllBookingsForMember() {
        Long memberId = 1L;

        Booking booking1 = new Booking(user, trainingClass);
        booking1.setBookingStatus(CONFIRMED);

        Booking booking2 = new Booking(user, trainingClass);
        booking2.setBookingStatus(PENDING);

        List<Booking> userBookings = Arrays.asList(booking1, booking2);

        when(bookingRepository.findByMemberId(memberId)).thenReturn(userBookings);

        bookingService.cancelAllBookingsForMember(memberId);

        assertEquals(BookingStatus.CANCELLED, booking1.getBookingStatus());
        assertEquals(BookingStatus.CANCELLED, booking2.getBookingStatus());

        verify(bookingRepository, times(1)).findByMemberId(memberId);
    }
}
