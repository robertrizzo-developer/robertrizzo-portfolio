package com.jarnvilja.service;

import com.jarnvilja.dto.MemberProfileDTO;
import com.jarnvilja.dto.MemberStatsDTO;
import com.jarnvilja.dto.MembershipStatsDTO;
import com.jarnvilja.model.*;
import com.jarnvilja.repository.BookingRepository;
import com.jarnvilja.repository.TrainingClassRepository;
import com.jarnvilja.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static com.jarnvilja.model.Role.ROLE_MEMBER;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
public class MemberServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TrainingClassRepository trainingClassRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private DemoGuard demoGuard;

    @Mock
    private BookingService bookingService;

    @InjectMocks
    private MemberService memberService;

    private User member;
    private TrainingClass trainingClass;
    private Booking booking;
    private User trainer;
    @BeforeEach
    void setUp() {
        member = new User();
        member.setId(1L);
        member.setEmail("member@example.com");
        member.setUsername("member1");
        member.setPassword("password");
        member.setRole(ROLE_MEMBER);

        trainingClass = new TrainingClass();
        trainingClass.setId(1L);
        trainingClass.setTitle("BJJ Class");
        trainingClass.setTrainingDay(DayOfWeek.MONDAY);
        trainingClass.setStartTime(LocalTime.of(17, 0));
        trainingClass.setEndTime(LocalTime.of(18, 0));

        booking = new Booking(member, trainingClass);
        booking.setId(1L);
        booking.setBookingStatus(BookingStatus.PENDING);
        booking.setBookingDate(LocalDate.now());

        lenient().when(demoGuard.isDemoUser()).thenReturn(false);
        lenient().when(passwordEncoder.encode(any(String.class))).thenAnswer(i -> i.getArgument(0));
    }

    // Hantera medlem:

    // createMember()                // Skapa en ny medlem
    @Test
    void testCreateMember() {
        when(userRepository.save(any(User.class))).thenReturn(member);

        User createdMember = memberService.createMember(member);

        assertNotNull(createdMember);
        assertEquals(member.getEmail(), createdMember.getEmail());
        verify(userRepository, times(1)).save(member);
    }

    // updateMember()                // Uppdatera medlemmens information
    @Test
    void testUpdateMember() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(member));
        when(userRepository.save(any(User.class))).thenReturn(member);

        User updatedMember = new User();
        updatedMember.setUsername("updatedMember");

        User result = memberService.updateMember(1L, updatedMember);

        assertNotNull(result);
        assertEquals("updatedMember", result.getUsername());
        verify(userRepository, times(1)).save(member);
    }

    // deleteMember()                // Ta bort en medlem
    @Test
    void testDeleteMember() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(member));

        memberService.deleteMember(1L);

        verify(userRepository, times(1)).delete(member);
    }

    // getMemberById()               // Hämta medlem baserat på ID
    @Test
    void testGetMemberById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(member));

        User result = memberService.getMemberById(1L);

        assertNotNull(result);
        assertEquals(member.getId(), result.getId());
    }

    // getAllMembers()               // Hämta alla medlemmar
    @Test
    void testGetAllMembers() {
        List<User> members = List.of(member, new User());
        when(userRepository.findAll()).thenReturn(members);

        List<User> result = memberService.getAllMembers();

        assertNotNull(result);
        assertEquals(2, result.size());
    }

    // getMemberByEmail()            // Hämta medlem baserat på email
    @Test
    void testGetMemberByEmail() {
        when(userRepository.findByEmail("member@example.com")).thenReturn(Optional.of(member));

        User result = memberService.getMemberByEmail("member@example.com");

        assertNotNull(result);
        assertEquals("member@example.com", result.getEmail());
    }

    @Test
    void testUpdateMemberPassword() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(member));
        when(userRepository.save(any(User.class))).thenReturn(member);

        memberService.updateMemberPassword(1L, "newPassword");

        assertEquals("newPassword", member.getPassword());
        verify(userRepository, times(1)).save(member);
    }

    // Bokningar:

    // createBooking()               // Skapa en ny bokning för medlem (delegerar till BookingService)
    @Test
    void testCreateBooking() {
        when(demoGuard.isDemoUser()).thenReturn(false);
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        when(bookingService.createBooking(1L, 1L)).thenReturn(booking);

        Booking createdBooking = memberService.createBooking(1L, 1L);

        assertNotNull(createdBooking);
        assertEquals(member, createdBooking.getMember());
        assertEquals(trainingClass, createdBooking.getTrainingClass());
        assertEquals(BookingStatus.CONFIRMED, createdBooking.getBookingStatus());

        verify(bookingService, times(1)).createBooking(1L, 1L);
        verify(emailService, times(1)).sendEmail(anyString(), anyString(), anyString());
    }

    // confirmBooking()              // Kollar att PENDING bokning blir CONFIRMED
    @Test
    void testConfirmBooking() {
        booking.setBookingStatus(BookingStatus.PENDING);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        Booking confirmedBooking = memberService.confirmBooking(1L);

        assertNotNull(confirmedBooking);
        assertEquals(BookingStatus.CONFIRMED, confirmedBooking.getBookingStatus());

        verify(bookingRepository, times(1)).save(booking);
    }

    // expirePendingBookings()       // Sätter bokningsstatus till EXPIRED om PENDING har varit längre än 30 min
    @Test
    void testExpirePendingBookings() {
        // Simulera att en bokning är PENDING och äldre än 30 minuter
        Booking pendingBooking = new Booking(member, trainingClass);
        pendingBooking.setId(10L);
        pendingBooking.setBookingStatus(BookingStatus.PENDING);
        pendingBooking.setBookingTimeStamp(LocalDateTime.now().minusMinutes(40)); // Mer än 30 minuter gammal

        // Simulera att en bokning är PENDING men inte för gammal
        Booking validBooking = new Booking(member, trainingClass);
        validBooking.setBookingStatus(BookingStatus.PENDING);
        validBooking.setBookingTimeStamp(LocalDateTime.now().minusMinutes(10)); // Mindre än 30 minuter gammal
        validBooking.setId(11L);

        // Mocka repository metoder
        when(bookingRepository.findPendingBookingsBefore(ArgumentMatchers.any(LocalDateTime.class)))
                .thenReturn(List.of(pendingBooking)); // Endast den gamla bokningen ska hittas

        when(bookingRepository.save(any(Booking.class))).thenReturn(pendingBooking);

        // Anropa metoden för att hantera utgångna bokningar
        memberService.expirePendingBookings();

        // Kontrollera att den gamla bokningen nu är EXPIRED
        assertEquals(BookingStatus.EXPIRED, pendingBooking.getBookingStatus());

        // Kontrollera att den giltiga bokningen inte har förändrats
        assertEquals(BookingStatus.PENDING, validBooking.getBookingStatus());

        // Verifiera att save metoden anropades för den gamla bokningen
        verify(bookingRepository, times(1)).save(pendingBooking);
    }

    // cancelBooking()               // Avboka en bokning för medlem (delegerar till BookingService, skickar e-post)
    @Test
    void testCancelBooking() {
        when(demoGuard.isDemoUser()).thenReturn(false);
        when(bookingService.cancelBooking(1L)).thenReturn(booking);

        memberService.cancelBooking(1L);

        verify(bookingService, times(1)).cancelBooking(1L);
        verify(emailService, times(1)).sendEmail(anyString(), anyString(), anyString());
    }

    // getBookingsForMember()        // Hämta alla bokningar för medlem
    @Test
    void testGetBookingsForMember() {
        List<Booking> bookings = List.of(booking);
        when(bookingRepository.findByMemberId(1L)).thenReturn(bookings);

        List<Booking> result = memberService.getBookingsForMember(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    // getUpcomingBookingsForMember()           // Hämta medlemmens kommande bokningar
    @Test
    void testGetUpcomingBookingsForMember() {
        List<Booking> upcomingBookings = List.of(booking);
        when(bookingRepository.findUpcomingBookingsForMember(1L, LocalDate.now())).thenReturn(upcomingBookings);

        List<Booking> result = memberService.getUpcomingBookingsForMember(1L);

        assertNotNull(result);
        assertFalse(result.isEmpty());
    }

    // getPastBookingsForMember()    // Hämta medlemmens tidigare bokningar
    @Test
    void testGetPastBookingsForMember() {
        List<Booking> pastBookings = List.of(booking);
        when(bookingRepository.findPastBookingsForMember(1L, LocalDate.now())).thenReturn(pastBookings);

        List<Booking> result = memberService.getPastBookingsForMember(1L);

        assertNotNull(result);
        assertFalse(result.isEmpty());
    }

    // getBookingById()              // Hämta bokning baserat på ID
    @Test
    void testGetBookingById() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        Booking result = memberService.getBookingById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    // Träningspass:

    // getAvailableClasses()         // Hämta tillgängliga träningspass för medlem
    @Test
    void testGetAvailableClasses() {
        // Skapa några träningspass
        TrainingClass availableClass1 = new TrainingClass("BJJ", "Grappling", DayOfWeek.MONDAY, Matta.MATTA_1,LocalTime.of(18, 0), LocalTime.of(19, 0));
        availableClass1.setId(1L);
        availableClass1.setTrainer(trainer);

        TrainingClass availableClass2 = new TrainingClass("Boxing", "Striking", DayOfWeek.WEDNESDAY, Matta.MATTA_1, LocalTime.of(19, 0), LocalTime.of(20, 0));
        availableClass2.setId(2L);
        availableClass2.setTrainer(trainer);

        List<TrainingClass> availableClasses = Arrays.asList(availableClass1, availableClass2);

        // Mocka repository
        when(trainingClassRepository.findAll()).thenReturn(availableClasses);

        // Kör metoden
        List<TrainingClass> result = memberService.getAvailableClasses();

        // Verifiera resultatet
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(availableClass1));
        assertTrue(result.contains(availableClass2));

        // Verifiera att repository-metoden anropades en gång
        verify(trainingClassRepository, times(1)).findAll();
    }

    // getAllClassesForMember()      // Hämta alla träningspass för en medlem (både kommande och historik)
    @Test
    void testGetAllClassesForMember() {
        // Skapa en medlem
        User member = new User();
        member.setId(1L);

        // Skapa träningspass
        TrainingClass pastClass = new TrainingClass("Past Class", "Old Session", DayOfWeek.MONDAY, Matta.MATTA_1,LocalTime.of(17, 0), LocalTime.of(18, 0));
        TrainingClass futureClass = new TrainingClass("Future Class", "Upcoming Session", DayOfWeek.FRIDAY, Matta.MATTA_1, LocalTime.of(19, 0), LocalTime.of(20, 0));

        // Skapa bokningar
        Booking pastBooking = new Booking(member, pastClass);
        pastBooking.setBookingStatus(BookingStatus.CONFIRMED);
        pastBooking.setBookingTimeStamp(LocalDateTime.now().minusDays(10));

        Booking futureBooking = new Booking(member, futureClass);
        futureBooking.setBookingStatus(BookingStatus.CONFIRMED);
        futureBooking.setBookingTimeStamp(LocalDateTime.now().plusDays(5));

        List<Booking> bookings = Arrays.asList(pastBooking, futureBooking);

        // Mocka repository
        when(bookingRepository.findByMemberId(member.getId())).thenReturn(bookings);

        // Kör metoden
        List<TrainingClass> result = memberService.getAllClassesForMember(member.getId());

        // Verifiera resultatet
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(pastClass));
        assertTrue(result.contains(futureClass));

        // Verifiera att repository-metoden anropades en gång
        verify(bookingRepository, times(1)).findByMemberId(member.getId());
    }


    // Medlemsstatistik och profil:

    // getMemberProfile()            // Hämta medlemsprofilinformation
    @Test
    void testGetMemberProfile() {
        Long memberId = 1L;
        User member = new User(memberId, "user@example.com", "username", "password", ROLE_MEMBER);

        when(userRepository.findById(memberId)).thenReturn(Optional.of(member));

        MemberProfileDTO profile = memberService.getMemberProfile(memberId);

        assertNotNull(profile);
        assertEquals("username", profile.getUsername());
        assertEquals("user@example.com", profile.getEmail());

        verify(userRepository, times(1)).findById(memberId);
    }

    @Test
    void testGetMembershipStats() {
        Long memberId = 1L;
        User member = new User(memberId, "user@example.com", "username", "password", ROLE_MEMBER);

        Booking b1 = new Booking(member, new TrainingClass("BJJ", "BJJ class", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(17, 0), LocalTime.of(18, 0)));
        b1.setBookingStatus(BookingStatus.CONFIRMED);
        Booking b2 = new Booking(member, new TrainingClass("Thaiboxning", "Muay Thai class", DayOfWeek.WEDNESDAY, Matta.MATTA_1, LocalTime.of(18, 0), LocalTime.of(19, 0)));
        b2.setBookingStatus(BookingStatus.CONFIRMED);

        List<Booking> bookings = Arrays.asList(b1, b2);

        when(userRepository.findById(memberId)).thenReturn(Optional.of(member));
        when(bookingRepository.findByMemberId(memberId)).thenReturn(bookings);

        MembershipStatsDTO stats = memberService.getMembershipStats(memberId);

        assertNotNull(stats);
        assertEquals(2, stats.getTotalBookings());

        verify(bookingRepository, times(1)).findByMemberId(memberId);
    }


}
