package com.jarnvilja.controller;

import org.springframework.ui.Model;

import com.jarnvilja.dto.MemberProfileDTO;
import com.jarnvilja.dto.MembershipStatsDTO;
import com.jarnvilja.model.*;
import com.jarnvilja.service.MemberService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;


import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class MemberControllerTest {

    @InjectMocks
    private MemberController memberController;

    @Mock
    private MemberService memberService;

    @Mock
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // createMember() → Testa att skapa en ny medlem och verifiera att den sparas korrekt (POST /members)
    @Test
    void testCreateMember() {
        // Skapa en ny medlem
        User newMember = new User();
        newMember.setId(1L);
        newMember.setEmail("test@example.com");
        newMember.setUsername("testuser");
        newMember.setPassword("password");
        newMember.setRole(Role.ROLE_MEMBER); // Anta att Role är en enum

        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(memberService.createMember(any(User.class))).thenReturn(newMember);

        ResponseEntity<User> response = memberController.createMember(newMember);

        // Kontrollera att svaret är 201 CREATED
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(newMember, response.getBody());
    }

    // updateMember() → Testa att uppdatera en befintlig medlemsinformation och verifiera att ändringarna sparas (PUT /members/{memberId})
    @Test
    void testUpdateMember() {
        // Skapa en befintlig medlem
        User existingMember = new User();
        existingMember.setId(1L);
        existingMember.setEmail("test@example.com");
        existingMember.setUsername("testuser");
        existingMember.setPassword("password");
        existingMember.setRole(Role.ROLE_MEMBER);

        // Mocka beteendet för memberService
        when(memberService.updateMember(any(Long.class), any(User.class))).thenReturn(existingMember);

        // Anropa updateMember och verifiera resultatet
        ResponseEntity<User> response = memberController.updateMember(1L, existingMember);

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(existingMember, response.getBody());
    }

    // deleteMember() → Testa att ta bort en medlem och verifiera att den inte längre finns (DELETE /members/{memberId})
    @Test
    void testDeleteMember() {
        // Mocka beteendet för memberService
        doNothing().when(memberService).deleteMember(1L);

        // Anropa deleteMember och verifiera resultatet
        ResponseEntity<Void> response = memberController.deleteMember(1L);

        // Kontrollera att svaret är 204 NO CONTENT
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    // getMemberById() → Testa att hämta en medlem med giltigt ID och verifiera att rätt medlem returneras (GET /members/{memberId})
    @Test
    void testGetMemberById() {
        // Skapa en befintlig medlem
        User existingMember = new User();
        existingMember.setId(1L);
        existingMember.setEmail("test@example.com");
        existingMember.setUsername("testuser");
        existingMember.setPassword("password");
        existingMember.setRole(Role.ROLE_MEMBER);

        // Mocka beteendet för memberService
        when(memberService.getMemberById(1L)).thenReturn(existingMember); // Detta orsakar felet

        // Anropa getMemberById och verifiera resultatet
        ResponseEntity<User> response = memberController.getMemberById(1L);

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(existingMember, response.getBody());
    }

    // getAllMembers() → Testa att hämta alla medlemmar och verifiera att listan är korrekt (GET /members)
    @Test
    void testGetAllMembers() {
        // Mocka beteendet för memberService
        when(memberService.getAllMembers()).thenReturn(List.of(new User(), new User()));

        // Anropa getAllMembers och verifiera resultatet
        ResponseEntity<List<User>> response = memberController.getAllMembers();

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    // getMemberByEmail() → Testa att hämta en medlem med giltig e-postadress och verifiera att rätt medlem returneras (GET /members/email/{email})
    @Test
    void testGetMemberByEmail() {
        // Skapa en befintlig medlem
        User existingMember = new User();
        existingMember.setId(1L);
        existingMember.setEmail("test@example.com");
        existingMember.setUsername("testuser");
        existingMember.setPassword("password");
        existingMember.setRole(Role.ROLE_MEMBER);

        // Mocka beteendet för memberService
        when(memberService.getMemberByEmail("test@example.com")).thenReturn((existingMember));

        // Anropa getMemberByEmail och verifiera resultatet
        ResponseEntity<User> response = memberController.getMemberByEmail("test@example.com");

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(existingMember, response.getBody());
    }

    // updateMemberPassword() → Testa att uppdatera en medlems lösenord och verifiera att det uppdateras korrekt (PATCH /members/{memberId}/password)
    @Test
    void testUpdateMemberPassword() {
        // Skapa en befintlig medlem
        User existingMember = new User();
        existingMember.setId(1L);
        existingMember.setEmail("test@example.com");
        existingMember.setUsername("testuser");
        existingMember.setPassword("oldPassword");
        existingMember.setRole(Role.ROLE_MEMBER);

        // Mocka beteendet för memberService
        when(memberService.updateMemberPassword(1L, "newPassword")).thenAnswer(invocation -> {
            // Uppdatera lösenordet i den mockade instansen
            existingMember.setPassword("newPassword");
            return existingMember; // Returnera den uppdaterade instansen
        });

        // Anropa updateMemberPassword och verifiera resultatet
        ResponseEntity<User> response = memberController.updateMemberPassword(1L, "newPassword");

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("newPassword", response.getBody().getPassword()); // Kontrollera att lösenordet har uppdaterats
    }

    // createBooking() → Testa att skapa en bokning för en medlem och verifiera att den sparas korrekt (POST /members/{userId}/bookings)
    @Test
    void testCreateBooking_withBookingMessage() {
        // Arrange: skapa testdata
        User member = new User();
        member.setId(1L);

        Model model = mock(Model.class);  // Modell används inte längre för att hålla meddelandet vid omdirigering
        RedirectAttributes redirectAttributes = mock(RedirectAttributes.class);  // Mocka RedirectAttributes
        String message = "You have already booked this training class for today."; // Meddelande som vi förväntar oss

        TrainingClass trainingClass = new TrainingClass();
        trainingClass.setId(1L);

        trainingClass.setTrainingDay(DayOfWeek.MONDAY);
        trainingClass.setStartTime(LocalTime.now().minusHours(1));

        // Mocka memberService och simulera att passet redan är bokat
        when(memberService.checkBookingStatus(member.getId(), trainingClass.getId())).thenReturn(message);

        // Act: anropa controller
        String result = memberController.createBooking(member.getId(), trainingClass.getId(), model, redirectAttributes);

        // Assert: kontrollera att vi omdirigerar till medlemssidan
        assertEquals("redirect:/memberPage", result);  // Förväntar oss en omdirigering till medlemssidan

        // Verifiera att redirectAttributes.addFlashAttribute anropas med rätt bokningsmeddelande
        verify(redirectAttributes).addFlashAttribute("bookingMessage", message);

        // Verifiera att createBooking metoden inte anropades, eftersom passet redan är bokat
        verify(memberService, never()).createBooking(anyLong(), anyLong());
    }


    // confirmBooking() → Testa att bekräfta en bokning och verifiera att status ändras (PATCH /bookings/{bookingId}/confirm)
    @Test
    void testConfirmBooking() {
        // Skapa en mockad bokning
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setBookingStatus(BookingStatus.PENDING); // Initial status

        // Mocka beteendet för memberService
        when(memberService.confirmBooking(anyLong())).thenReturn(booking);

        // Anropa confirmBooking och verifiera resultatet
        ResponseEntity<Booking> response = memberController.confirmBooking(booking.getId());

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(booking, response.getBody());
    }

    // cancelBooking() → Testa att avboka en bokning och verifiera att status ändras (DELETE /bookings/{bookingId})
    @Test
    void testCancelBooking() {
        // Skapa en mockad bokning
        Long bookingId = 1L;

        // Mocka beteendet för memberService
        doNothing().when(memberService).cancelBooking(anyLong());

        // Anropa cancelBooking och verifiera resultatet
        RedirectView redirectView = memberController.cancelBooking(bookingId, "delete");

        // Kontrollera att omdirigeringen är korrekt
        assertEquals("/memberPage", redirectView.getUrl()); // Kontrollera att omdirigeringen går till memberPage
    }

    // getBookingsForMember() → Testa att hämta alla bokningar för en specifik medlem och verifiera att rätt bokningar returneras (GET /members/{userId}/bookings)
    @Test
    void testGetBookingsForMember() {
        // Skapa en medlem
        Long userId = 1L;

        // Skapa en lista med mockade bokningar
        List<Booking> mockBookings = new ArrayList<>();
        Booking booking1 = new Booking();
        booking1.setId(1L);
        booking1.setBookingStatus(BookingStatus.CONFIRMED);
        mockBookings.add(booking1);

        Booking booking2 = new Booking();
        booking2.setId(2L);
        booking2.setBookingStatus(BookingStatus.PENDING);
        mockBookings.add(booking2);

        // Mocka beteendet för memberService
        when(memberService.getBookingsForMember(anyLong())).thenReturn(mockBookings);

        // Anropa getBookingsForMember och verifiera resultatet
        ResponseEntity<List<Booking>> response = memberController.getBookingsForMember(userId);

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockBookings, response.getBody());
    }

    // getUpcomingBookingsForMember() → Testa att hämta kommande bokningar för en medlem och verifiera att rätt bokningar returneras (GET /members/{userId}/bookings/upcoming)
    @Test
    void testGetUpcomingBookingsForMember() {
        // Skapa en medlem
        User member = new User();
        member.setId(1L);
        member.setEmail("test@example.com");
        member.setUsername("testuser");
        member.setPassword("password");
        member.setRole(Role.ROLE_MEMBER);

        // Skapa en träningsklass
        TrainingClass trainingClass = new TrainingClass();
        trainingClass.setId(1L);
        trainingClass.setTitle("Yoga Class");

        // Skapa en lista med mockade kommande bokningar
        List<Booking> mockUpcomingBookings = new ArrayList<>();
        Booking upcomingBooking1 = new Booking(member, trainingClass);
        upcomingBooking1.setId(1L);
        upcomingBooking1.setBookingStatus(BookingStatus.CONFIRMED);
        upcomingBooking1.setBookingDate(LocalDate.now().plusDays(1)); // Sätt ett framtida datum

        Booking upcomingBooking2 = new Booking(member, trainingClass);
        upcomingBooking2.setId(2L);
        upcomingBooking2.setBookingStatus(BookingStatus.PENDING);
        upcomingBooking2.setBookingDate(LocalDate.now().plusDays(2)); // Sätt ett framtida datum

        mockUpcomingBookings.add(upcomingBooking1);
        mockUpcomingBookings.add(upcomingBooking2);

        // Mocka beteendet för memberService
        when(memberService.getUpcomingBookingsForMember(anyLong())).thenReturn(mockUpcomingBookings);

        // Anropa getUpcomingBookingsForMember och verifiera resultatet
        ResponseEntity<List<Booking>> response = memberController.getUpcomingBookingsForMember(member.getId());

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockUpcomingBookings, response.getBody());
    }

    // getPastBookingsForMember() → Testa att hämta tidigare bokningar för en medlem och verifiera att rätt bokningar returneras (GET /members/{userId}/bookings/past)
    @Test
    void testGetPastBookingsForMember() {
        // Skapa en medlem
        User member = new User();
        member.setId(1L);
        member.setEmail("test@example.com");
        member.setUsername("testuser");
        member.setPassword("password");
        member.setRole(Role.ROLE_MEMBER);

        // Skapa en träningsklass
        TrainingClass trainingClass = new TrainingClass();
        trainingClass.setId(1L);
        trainingClass.setTitle("Yoga Class");

        // Skapa en lista med mockade tidigare bokningar
        List<Booking> mockPastBookings = new ArrayList<>();
        Booking pastBooking1 = new Booking(member, trainingClass);
        pastBooking1.setId(1L);
        pastBooking1.setBookingStatus(BookingStatus.CONFIRMED);
        pastBooking1.setBookingDate(LocalDate.now().minusDays(1)); // Sätt ett datum i det förflutna

        Booking pastBooking2 = new Booking(member, trainingClass);
        pastBooking2.setId(2L);
        pastBooking2.setBookingStatus(BookingStatus.CANCELLED);
        pastBooking2.setBookingDate(LocalDate.now().minusDays(2)); // Sätt ett datum i det förflutna

        mockPastBookings.add(pastBooking1);
        mockPastBookings.add(pastBooking2);

        // Mocka beteendet för memberService
        when(memberService.getPastBookingsForMember(anyLong())).thenReturn(mockPastBookings);

        // Anropa getPastBookingsForMember och verifiera resultatet
        ResponseEntity<List<Booking>> response = memberController.getPastBookingsForMember(member.getId());

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockPastBookings, response.getBody());
    }

    // getBookingById() → Testa att hämta en bokning med giltigt ID och verifiera att rätt bokning returneras (GET /bookings/{bookingId})
    @Test
    void testGetBookingById() {
        // Skapa en medlem
        User member = new User();
        member.setId(1L);
        member.setEmail("test@example.com");
        member.setUsername("testuser");
        member.setPassword("password");
        member.setRole(Role.ROLE_MEMBER);

        // Skapa en träningsklass
        TrainingClass trainingClass = new TrainingClass();
        trainingClass.setId(1L);
        trainingClass.setTitle("Yoga Class");

        // Skapa en mockad bokning
        Booking mockBooking = new Booking(member, trainingClass);
        mockBooking.setId(1L);
        mockBooking.setBookingStatus(BookingStatus.CONFIRMED);

        // Mocka beteendet för memberService
        when(memberService.getBookingById(anyLong())).thenReturn(mockBooking);

        // Anropa getBookingById och verifiera resultatet
        ResponseEntity<Booking> response = memberController.getBookingById(mockBooking.getId());

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockBooking, response.getBody());
    }

    // getAvailableClasses() → Testa att hämta tillgängliga träningspass och verifiera att listan är korrekt (GET /classes/available)
    @Test
    void testGetAvailableClasses() {
        // Skapa en lista med mockade träningsklasser
        List<TrainingClass> mockAvailableClasses = new ArrayList<>();

        TrainingClass class1 = new TrainingClass("Yoga Class", "A relaxing yoga session", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(17, 0), LocalTime.of(18, 0));
        class1.setId(1L);

        TrainingClass class2 = new TrainingClass("Pilates Class", "A strengthening pilates session", DayOfWeek.WEDNESDAY, Matta.MATTA_1, LocalTime.of(18, 0), LocalTime.of(19, 0));
        class2.setId(2L);

        mockAvailableClasses.add(class1);
        mockAvailableClasses.add(class2);

        // Mocka beteendet för memberService
        when(memberService.getAvailableClasses()).thenReturn(mockAvailableClasses);

        // Anropa getAvailableClasses och verifiera resultatet
        ResponseEntity<List<TrainingClass>> response = memberController.getAvailableClasses();

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        // Kontrollera att listan med träningsklasser i svaret är densamma som de mockade träningsklasserna
        assertEquals(mockAvailableClasses, response.getBody());
    }

    // getAllClassesForMember() → Testa att hämta alla klasser för en medlem och verifiera att rätt klasser returneras (GET /members/{memberId}/classes)
    @Test
    void testGetAllClassesForMember() {
        // Skapa en lista med mockade träningsklasser
        List<TrainingClass> mockMemberClasses = new ArrayList<>();

        TrainingClass class1 = new TrainingClass("Yoga Class", "A relaxing yoga session", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(17, 0), LocalTime.of(18, 0));
        class1.setId(1L);

        TrainingClass class2 = new TrainingClass("Pilates Class", "A strengthening pilates session", DayOfWeek.WEDNESDAY, Matta.MATTA_1, LocalTime.of(18, 0), LocalTime.of(19, 0));
        class2.setId(2L);

        mockMemberClasses.add(class1);
        mockMemberClasses.add(class2);

        Long memberId = 1L; // Exempel på memberId

        // Mocka beteendet för memberService
        when(memberService.getAllClassesForMember(memberId)).thenReturn(mockMemberClasses);

        // Anropa getAllClassesForMember och verifiera resultatet
        ResponseEntity<List<TrainingClass>> response = memberController.getAllClassesForMember(memberId);

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        // Kontrollera att listan med träningsklasser i svaret är densamma som de mockade träningsklasserna
        assertEquals(mockMemberClasses, response.getBody());
    }

    // getMemberProfile() → Testa att hämta medlemsprofil och verifiera att rätt information returneras (GET /members/{memberId}/profile)
    @Test
    void testGetMemberProfile() {
        // Skapa en mockad medlemsprofil DTO
        MemberProfileDTO mockMemberProfile = new MemberProfileDTO(1L, "John Doe", "john.doe@example.com");

        Long memberId = 1L; // Exempel på memberId

        // Mocka beteendet för memberService
        when(memberService.getMemberProfile(memberId)).thenReturn(mockMemberProfile);

        // Anropa getMemberProfile och verifiera resultatet
        ResponseEntity<MemberProfileDTO> response = memberController.getMemberProfile(memberId);

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        // Kontrollera att den returnerade medlemsprofilen är densamma som den mockade profilen
        assertEquals(mockMemberProfile, response.getBody());
    }

    // getMembershipStats() → Testa att hämta medlemsstatistik och verifiera att statistiken är korrekt (GET /members/{memberId}/stats)
    @Test
    void testGetMembershipStats() {
        // Skapa en mockad medlemsstatistik DTO
        Long memberId = 1L; // Exempel på memberId
        MembershipStatsDTO mockMembershipStats = new MembershipStatsDTO(memberId, 5, "Boxning", java.time.LocalDate.of(2025, 1, 15));

        // Mocka beteendet för memberService
        when(memberService.getMembershipStats(memberId)).thenReturn(mockMembershipStats);

        // Anropa getMembershipStats och verifiera resultatet
        ResponseEntity<MembershipStatsDTO> response = memberController.getMembershipStats(memberId);

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        // Kontrollera att den returnerade medlemsstatistiken är densamma som den mockade statistiken
        assertEquals(mockMembershipStats, response.getBody());
    }

}
