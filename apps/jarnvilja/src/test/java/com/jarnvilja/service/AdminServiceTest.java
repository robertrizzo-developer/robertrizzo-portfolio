package com.jarnvilja.service;


import com.jarnvilja.dto.BookingStatsDTO;
import com.jarnvilja.dto.MemberStatsDTO;
import com.jarnvilja.model.*;
import com.jarnvilja.repository.BookingRepository;
import com.jarnvilja.repository.TrainingClassRepository;
import com.jarnvilja.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static com.jarnvilja.model.BookingStatus.*;
import static com.jarnvilja.model.Role.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TrainingClassRepository trainingClassRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private AdminService adminService;

    private User user;
    private User user2;
    private User user3;

    private TrainingClass trainingClass;
    private User trainer4;
    private User trainer5;

    private Booking booking1;
    private Booking booking2;
    private List<Booking> bookings;
    private Booking validBooking;
    private Booking expiredBooking;

    @BeforeEach
    void setUp() {
        // Skapa användare (medlem)
        user = new User();
        user.setId(1L);
        user.setEmail("admin@example.com");
        user.setUsername("admin");
        user.setPassword("password");
        user.setRole(ROLE_ADMIN);

        user2 = new User();
        user2.setId(2L);
        user2.setEmail("user2@example.com");
        user2.setUsername("user2");
        user2.setPassword("password2");
        user2.setRole(ROLE_MEMBER);

        user3 = new User();
        user3.setId(3L);
        user3.setEmail("user3@example.com");
        user3.setUsername("user3");
        user3.setPassword("password3");
        user3.setRole(ROLE_MEMBER);

        // Skapa tränare
        trainer4 = new User(4L, "trainer4@example.com", "trainer4", "password", ROLE_TRAINER);
        trainer5 = new User(5L, "trainer5@example.com", "trainer5", "password", ROLE_TRAINER);

        // Skapa träningspass
        trainingClass = new TrainingClass("BJJ", "Brazilian Jiu-Jitsu class", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(17, 0), LocalTime.of(18, 0));
        trainingClass.setId(1L);
        trainingClass.setTrainer(trainer4);

        // Skapa bokningar (använd objekt i stället för ID:n)
        booking1 = new Booking(user, trainingClass);  // här använder vi användarobjektet 'user' och träningspassobjektet 'trainingClass'
        booking1.setId(1L);
        booking1.setBookingStatus(BookingStatus.CONFIRMED);

        booking2 = new Booking(user2, new TrainingClass("THAIBOXNING", "Thai Boxing class", DayOfWeek.TUESDAY, Matta.MATTA_1, LocalTime.of(18, 0), LocalTime.of(19, 0)));
        booking2.setId(2L);
        booking2.setBookingStatus(BookingStatus.PENDING);

        bookings = Arrays.asList(booking1, booking2);

        validBooking = new Booking(user, trainingClass);  // en giltig bokning

        // Skapa en expired bokning (mer än 30 minuter gammal)
        expiredBooking = new Booking(user3, trainingClass);  // här använder vi en annan användare
    }

    @AfterEach
    void tearDown() {
        Mockito.reset(userRepository, passwordEncoder);
    }
    // Hantera användare:

    // createUser()
    @Test
    void testCreateUser() {
        when(passwordEncoder.encode("password")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User createdUser = adminService.createUser(user);

        assertNotNull(createdUser);
        assertEquals(user.getId(), createdUser.getId());
        assertEquals(user.getEmail(), createdUser.getEmail());
        assertEquals(user.getUsername(), createdUser.getUsername());
        assertEquals(user.getPassword(), createdUser.getPassword());
        assertEquals(user.getRole(), createdUser.getRole());

        verify(passwordEncoder).encode("password");
        verify(userRepository).save(any(User.class));
    }

    // updateUser()
    @Test
    void testUpdateUser() {
        User updatedUser = new User(1L, "newadmin@example.com", "newAdmin","password",  ROLE_ADMIN);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        User result = adminService.updateUser(1L, updatedUser);

        assertNotNull(result);
        assertEquals("newadmin@example.com", result.getEmail());
        assertEquals("newAdmin", result.getUsername());

        verify(userRepository, times(1)).save(any(User.class));


    }
    // deleteUser()
    @Test
    void testDeleteUser() {
        User deleteUser = new User(4L, "bye@example.com", "byebye","password",  ROLE_MEMBER);
        when(userRepository.findById(4L)).thenReturn(Optional.of(deleteUser));
        doNothing().when(userRepository).deleteById(deleteUser.getId());

        String result = adminService.deleteUser(4L);

        assertNotNull(result);
        assertEquals("User " + deleteUser.getId() + " deleted", result);
        verify(userRepository, times(1)).deleteById(deleteUser.getId());
    }
    // getAllUsers()
    @Test
    void testGetAllUsers() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(user, user2));

        List<User> users = adminService.getAllUsers();

        assertNotNull(users);
        assertEquals(2, users.size());
        assertEquals("admin@example.com", users.get(0).getEmail());
        assertEquals("user2@example.com", users.get(1).getEmail());

        verify(userRepository, times(1)).findAll();
    }
    // getUserById()
    @Test
    void testGetUserById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = adminService.getUserById(1L);

        assertNotNull(result);
        assertEquals(user.getId(), result.getId());
        assertEquals(user.getEmail(), result.getEmail());
        assertEquals(user.getUsername(), result.getUsername());
        verify(userRepository, times(1)).findById(1L);
    }

    // getUsersByRole()
    @Test
    void testGetUsersByRole() {
        List<User> users = Arrays.asList(user2, user3);

        when(userRepository.findUsersByRole(ROLE_MEMBER)).thenReturn(users);

        List<User> result = adminService.getUsersByRole(ROLE_MEMBER);

        assertNotNull(result);

        assertEquals(2, result.size());

        verify(userRepository, times(1)).findUsersByRole(ROLE_MEMBER);

    }

    // assignRoleToUser()
    @Test
    void testAssignRoleToUser() {
        when(userRepository.findById(3L)).thenReturn(Optional.of(user3));

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setRole(ROLE_TRAINER);
            return savedUser;
        });
        User result = adminService.assignRoleToUser(3L, ROLE_TRAINER);

        assertNotNull(result);
        assertEquals(user3.getId(), result.getId());
        assertEquals("user3@example.com", result.getEmail());
        assertEquals("user3", result.getUsername());
        assertEquals(ROLE_TRAINER, result.getRole());

        // Verifiera att repository-metoderna anropades
        verify(userRepository, times(1)).findById(3L);
        verify(userRepository, times(1)).save(any(User.class));
    }

    // resetUserPassword()
    @Test
    void testResetUserPassword() {
        when(userRepository.findById(3L)).thenReturn(Optional.of(user3));

        when(passwordEncoder.encode("newSecurePassword")).thenReturn("hashedPassword");

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updatedUser = adminService.resetUserPassword(3L, "newSecurePassword");

        assertNotNull(updatedUser);
        assertEquals("hashedPassword", updatedUser.getPassword());

        verify(userRepository, times(1)).findById(3L);
        verify(passwordEncoder, times(1)).encode("newSecurePassword");
        verify(userRepository, times(1)).save(any(User.class));

    }



    // Hantera Tränare:

    // assignTrainerToClass()
    @Test
    void testAssignTrainerToClass(){
        when(trainingClassRepository.findById(1L)).thenReturn(Optional.of(trainingClass));
        when(userRepository.findById(4L)).thenReturn(Optional.of(trainer4));
        when(trainingClassRepository.save(any(TrainingClass.class))).thenReturn(trainingClass);

        TrainingClass updatedClass = adminService.assignTrainerToClass(1L, 4L);

        assertNotNull(updatedClass);
        assertEquals(trainer4, updatedClass.getTrainer());
        verify(trainingClassRepository, times(1)).save(trainingClass);
    }

    // removeTrainerFromClass()
    @Test
    void testRemoveTrainerFromClass(){
        trainingClass.getTrainer();
        when(trainingClassRepository.findById(1L)).thenReturn(Optional.of(trainingClass));
        when(userRepository.findById(4L)).thenReturn(Optional.of(trainer4));
        when(trainingClassRepository.save(any(TrainingClass.class))).thenReturn(trainingClass);

        String result = adminService.removeTrainerFromClass(1L, 4L);

        assertNotNull(result);
        assertTrue(result.contains("Trainer " + trainer4.getId() + " removed from the class: " + trainingClass.getTitle()));

        verify(trainingClassRepository, times(1)).save(trainingClass);
    }

    // getTrainerForClass()
    @Test
    void testGetTrainerForClass () {

        when(trainingClassRepository.findById(1L)).thenReturn(Optional.of(trainingClass));

        Optional<User> returnedTrainer = adminService.getTrainerFromClass(1L);

        assertNotNull(trainer4);
        assertTrue(returnedTrainer.isPresent());
        assertEquals(trainer4.getId(), returnedTrainer.get().getId());

        verify(trainingClassRepository,times(1)).findById(1L);
    }

    // getAllTrainers()
    @Test
    void testGetAllTrainers() {
        when(userRepository.findUsersByRole(ROLE_TRAINER)).thenReturn(Arrays.asList(trainer4, trainer5));

        List<User> trainers = adminService.getAllTrainers();

        assertNotNull(trainers);
        assertEquals(2, trainers.size());
        verify(userRepository, times(1)).findUsersByRole(ROLE_TRAINER);
    }

    

    // Hantera bokningar:

    // getAllBookings()
    @Test
    void testGetAllBookings() {
        when(bookingRepository.findAll()).thenReturn(bookings);

        List<Booking> result = adminService.getAllBookings();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(bookingRepository, times(1)).findAll();
    }

    // deleteBooking()
    @Test
    void testDeleteBooking() {
        Booking deleteBooking = new Booking(user, trainingClass);
        deleteBooking.setId(6L);
        when(bookingRepository.findById(deleteBooking.getId())).thenReturn(Optional.of(deleteBooking));
        doNothing().when(bookingRepository).deleteById(deleteBooking.getId());

        String result = adminService.deleteBooking(deleteBooking.getId());
        assertNotNull(result);

        assertEquals("Booking " + deleteBooking.getId() + " deleted", result);
        verify(bookingRepository, times(1)).findById(deleteBooking.getId());

    }

    // getBookingById()
    @Test
    void testGetBookingById() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking1));

        Booking result = adminService.getBookingById(1L);
        assertNotNull(result);
        assertEquals(booking1.getId(), result.getId());
        verify(bookingRepository, times(1)).findById(1L);
    }

    // cancelAllBookingsForClass()
    @Test
    void testCancelAllBookingsForClass() {
        Long trainingClassId = 5L;
        Booking booking1 = new Booking(user, trainingClass);
        Booking booking2 = new Booking(user2, trainingClass);
        List<Booking> mockBookings = Arrays.asList(booking1, booking2);

        when(bookingRepository.findByTrainingClassId(trainingClassId)).thenReturn(mockBookings);
        when(bookingRepository.saveAll(anyList())).thenReturn(mockBookings);

        List<Booking> result = adminService.cancelAllBookingsForClass(trainingClassId);

        assertEquals(BookingStatus.CANCELLED, result.get(0).getBookingStatus());
        assertEquals(BookingStatus.CANCELLED, result.get(1).getBookingStatus());

        verify(bookingRepository, times(1)).findByTrainingClassId(trainingClassId);
        verify(bookingRepository, times(1)).saveAll(mockBookings);
    }

    // getBookingsByStatus
    @Test
    void testGetBookingsByStatus() {
        BookingStatus status = CONFIRMED;

        List<Booking> mockBookings = Arrays.asList(booking1, booking2);

        mockBookings.forEach(booking -> booking.setBookingStatus(status));

        when(bookingRepository.findByBookingStatus(status)).thenReturn(mockBookings);

        List<Booking> result = adminService.getBookingsByStatus(status);

        assertNotNull(result);
        assertEquals(BookingStatus.CONFIRMED, result.get(0).getBookingStatus());
        assertEquals(BookingStatus.CONFIRMED, result.get(1).getBookingStatus());

        verify(bookingRepository, times(1)).findByBookingStatus(status);
    }

    // removeExpiredBookings()
    @Test
    void testRemoveExpiredBookings() {
        // Mocka repository för att returnera både giltig och expired bokning
        LocalDateTime expiredTime = LocalDateTime.now().minusMinutes(31);  // Mer än 30 minuter gammal
        Booking expiredBooking = new Booking(user, trainingClass);
        expiredBooking.setBookingStatus(BookingStatus.PENDING);  // Förväntad status som utlöpt
        expiredBooking.setBookingTimeStamp(expiredTime);

        Booking validBooking = new Booking(user, trainingClass);
        validBooking.setBookingStatus(BookingStatus.CONFIRMED);  // Giltig bokning, inte utlöpt
        validBooking.setBookingTimeStamp(LocalDateTime.now());  // Giltig bokning, inte utlöpt

        // Mocka repository-anrop
        when(bookingRepository.findAll()).thenReturn(Arrays.asList(validBooking, expiredBooking));

        // Kör metoden för att ta bort expired bokningar
        adminService.removeExpiredBookings();

        // Verifiera att expired bokning tas bort
        verify(bookingRepository, times(1)).deleteAll(List.of(expiredBooking));

        // Kontrollera att den expired bokningen verkligen var expired
        assertTrue(expiredBooking.isExpired(), "Expired bokning ska vara utlöpt");

        // Kontrollera att den giltiga bokningen inte togs bort
        assertFalse(validBooking.isExpired(), "Giltig bokning ska inte vara utlöpt");
    }




    // Rapportering och statistik:

    // getBookingStats()
    @Test
    void testGetBookingStats() {

        when(bookingRepository.count()).thenReturn(130L);
        when(bookingRepository.countByBookingStatus(BookingStatus.CONFIRMED)).thenReturn(80L);
        when(bookingRepository.countByBookingStatus(BookingStatus.CANCELLED)).thenReturn(15L);
        when(bookingRepository.countByBookingStatus(BookingStatus.PENDING)).thenReturn(5L);
        when(bookingRepository.countByBookingStatus(BookingStatus.EXPIRED)).thenReturn(10L);
        when(bookingRepository.countByBookingStatus(BookingStatus.CANCELLED_BY_MEMBER)).thenReturn(20L);
        when(bookingRepository.findMostPopularClass()).thenReturn("BJJ");

        BookingStatsDTO bookingStats = adminService.getBookingStats();

        assertNotNull(bookingStats);
        assertEquals(130, bookingStats.getTotalBookings());
        assertEquals(80, bookingStats.getConfirmedBookings());
        assertEquals(15, bookingStats.getCancelledBookings());
        assertEquals(5, bookingStats.getPendingBookings());
        assertEquals(10, bookingStats.getExpiredBookings());
        assertEquals(20, bookingStats.getCancelledBookingsByMember());
        assertEquals("BJJ", bookingStats.getMostPopularClass());

        verify(bookingRepository, times(1)).count();
        verify(bookingRepository, times(1)).countByBookingStatus(BookingStatus.CONFIRMED);
        verify(bookingRepository, times(1)).countByBookingStatus(BookingStatus.CANCELLED);
        verify(bookingRepository, times(1)).countByBookingStatus(BookingStatus.CANCELLED_BY_MEMBER);
        verify(bookingRepository, times(1)).countByBookingStatus(BookingStatus.PENDING);
        verify(bookingRepository, times(1)).countByBookingStatus(BookingStatus.EXPIRED);
        verify(bookingRepository, times(1)).findMostPopularClass();
    }


    // getMemberStats()
    @Test
    void testGetMemberStats(){

        when(userRepository.count()).thenReturn(50L);
        when(bookingRepository.countActiveMembers()).thenReturn(30L);
        when(bookingRepository.findMostActiveMemberId()).thenReturn(3L);

        MemberStatsDTO memberStats = adminService.getMemberStats();

        assertNotNull(memberStats);
        assertEquals(50, memberStats.getTotalMembers());
        assertEquals(30, memberStats.getActiveMembers());
        assertEquals(20,memberStats.getInactiveMembers());
        assertEquals(3L, memberStats.getMostActiveMemberId());

        verify(userRepository, times(1)).count();
        verify(bookingRepository, times(1)).countActiveMembers();
        verify(bookingRepository, times(1)).findMostActiveMemberId();

    }


    // getTotalBookingsForClass()
    @Test
    void testGetTotalBookingsForClass() {
        Long classId = 1L;
        when(bookingRepository.count()).thenReturn(10L);

        String result = adminService.getTotalBookingsForClass(classId);

        assertNotNull(result);
        assertEquals(10, bookingRepository.count());
        verify(bookingRepository, times(1)).count();
    }

    // getBookingsByDate()
    @Test
    void testGetBookingsByDate() {
        LocalDate today = LocalDate.now();
        booking1.setBookingDate(today);

        booking2.setBookingDate(today.minusDays(1));

        List<Booking> mockBookings = Arrays.asList(booking1, booking2);
        when(bookingRepository.findBookingsByDateBetween(today, today)).thenReturn(mockBookings);

        List<Booking> result = adminService.getBookingsByPeriod(today, today);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("BJJ", result.get(0).getTrainingClass().getTitle());

        verify(bookingRepository, times(1)).findBookingsByDateBetween(today, today);
    }


    // getAllBookingsForMember()
    @Test
    void testGetAllBookingsForMember() {
        Long memberId = 9L;
        List<Booking> mockBookings = Arrays.asList(
                new Booking(user, trainingClass),
                new Booking(user, trainingClass)
        );

        when(bookingRepository.findBookingsByMemberId(memberId)).thenReturn(mockBookings);
        List<Booking> result = adminService.getAllBookingsForMember(memberId);
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(bookingRepository, times(1)).findBookingsByMemberId(memberId);

    }


    // getClassStats()
    @Test
    void testGetClassStats() {
        List<Object[]> mockStats = Arrays.asList(
                new Object[]{"BJJ", 15L},
                new Object[]{"THAIBOXNING", 20L}
        );

        when(bookingRepository.getClassStats()).thenReturn(mockStats);

        Map<String, Long> result = adminService.getClassStats();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(15L, result.get("BJJ"));
        assertEquals(20L, result.get("THAIBOXNING"));

        verify(bookingRepository,times(1)).getClassStats();
    }

}
