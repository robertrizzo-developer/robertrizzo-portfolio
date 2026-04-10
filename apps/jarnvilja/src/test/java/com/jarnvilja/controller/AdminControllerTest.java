package com.jarnvilja.controller;

import com.jarnvilja.dto.BookingStatsDTO;
import com.jarnvilja.dto.MemberStatsDTO;
import com.jarnvilja.dto.TrainingClassStatsDTO;
import com.jarnvilja.model.*;

import com.jarnvilja.service.AdminService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.view.RedirectView;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import static org.mockito.Mockito.*;

public class AdminControllerTest {

    @InjectMocks
    private AdminController adminController;

    @Mock
    private AdminService adminService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    // createUser () → Testa att skapa en ny användare och verifiera att den sparas korrekt (POST /users)
    @Test
    void createUser () {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        when(adminService.createUser (any(User.class))).thenReturn(user);

        ResponseEntity<User> createdUser  = adminController.createUser (user);

        assertNotNull(createdUser );
        assertEquals("testuser", Objects.requireNonNull(createdUser.getBody()).getUsername());
        assertEquals(HttpStatus.CREATED, createdUser.getStatusCode());
        verify(adminService, times(1)).createUser (user);
    }

    // updateUser () → Testa att uppdatera en befintlig användares information och verifiera att ändringarna sparas (PUT /users/{id})
    @Test
    void testUpdateUser () {
        User existingUser  = new User();
        existingUser .setId(1L);
        existingUser .setUsername("oldusername");
        existingUser .setEmail("old@example.com");

        User updatedUser  = new User();
        updatedUser .setId(1L);
        updatedUser .setUsername("updatedusername");
        updatedUser .setEmail("updated@example.com");

        when(adminService.updateUser (1L, updatedUser )).thenReturn(updatedUser );

        String response = adminController.updateUser (1L, updatedUser );

        assertEquals("redirect:/adminPage", response);

        verify(adminService, times(1)).updateUser (1L, updatedUser );
    }

    // deleteUser () → Testa att ta bort en användare och verifiera att den inte längre finns (DELETE /users/{id})
    @Test
    void testDeleteUser() {
        Long userId = 1L;
        String expectedResponse = "User  " + userId + " deleted";
        when(adminService.deleteUser (userId)).thenReturn(expectedResponse); // Simulera att tjänsten returnerar bekräftelsemeddelandet

        // Act
        String response = adminController.deleteUser (userId);

        // Assert
        assertEquals(expectedResponse, response);
        verify(adminService, times(1)).deleteUser (userId);
    }

    /*
    // getAllUsers() → Testa att hämta alla användare och verifiera att listan är korrekt (GET /users)
    @Test
    void testGetAllUsers() {
        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("user1");
        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("user2");

        List<User> users = Arrays.asList(user1, user2);
        when(adminService.getAllUsers()).thenReturn(users);

        ResponseEntity<List<User>> response = adminController.getAllUsers();

        assertNotNull(response);
        assertEquals(2, response.getBody().size());
        assertEquals(user1, response.getBody().get(0));
        assertEquals(user2, response.getBody().get(1));

        verify(adminService, times(1)).getAllUsers();
    }

     */

    // getUser ById() → Testa att hämta en användare med giltigt ID och verifiera att rätt användare returneras (GET /users/{id})
    @Test
    void testGetUserById() {
        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("user1");

        when(adminService.getUserById(anyLong())).thenReturn(user1);

        ResponseEntity<User> response = adminController.getUserId(user1.getId());

        assertNotNull(response);
        assertEquals(user1, response.getBody());
        verify(adminService, times(1)).getUserById(anyLong());
    }

    // getUsersByRole() → Testa att hämta användare baserat på roll och verifiera att rätt användare returneras (GET /users/role/{role})
    @Test
    void testGetUserByRole() {
        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("user1");
        user1.setRole(Role.ROLE_MEMBER);
        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("user2");
        user2.setRole(Role.ROLE_MEMBER);
        User user3 = new User();
        user3.setId(3L);
        user3.setUsername("user3");
        user3.setRole(Role.ROLE_MEMBER);

        List<User> users = Arrays.asList(user1, user2, user3);

        when(adminService.getUsersByRole(Role.ROLE_MEMBER)).thenReturn(users);

        ResponseEntity<List<User>> response = adminController.getUsersByRole(Role.ROLE_MEMBER);

        assertNotNull(response);
        assertEquals(3, Objects.requireNonNull(response.getBody()).size());
        assertEquals(user1, response.getBody().get(0));
        assertEquals(user2, response.getBody().get(1));
        assertEquals(user3, response.getBody().get(2));

        verify(adminService, times(1)).getUsersByRole(Role.ROLE_MEMBER);

    }

    // assignRoleToUser () → Testa att tilldela en roll till en användare och verifiera att ändringen sparas (PATCH /users/{id}/role)
    @Test
    void testAssignRoleToUser() {
        // Arrange
        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("user2");
        user2.setRole(Role.ROLE_MEMBER); // Initial roll
        Role newRole = Role.ROLE_TRAINER; // Ny roll

        User updatedUser = new User();
        updatedUser.setId(user2.getId());
        updatedUser.setUsername(user2.getUsername());
        updatedUser.setRole(newRole);

        // Mocka tjänsten så att den returnerar den uppdaterade användaren
        when(adminService.assignRoleToUser(user2.getId(), newRole)).thenReturn(updatedUser);

        // Act
        ResponseEntity<User> response = adminController.assignRoleToUser(user2.getId(), newRole);

        // Assert
        Assertions.assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode()); // Förväntar oss 200 OK
        Assertions.assertNotNull(response.getBody());
        assertEquals("user2", response.getBody().getUsername());
        assertEquals(Role.ROLE_TRAINER, response.getBody().getRole()); // Kontrollera att rollen är uppdaterad

        verify(adminService, times(1)).assignRoleToUser(user2.getId(), newRole);
    }

    // resetUserPassword() → Testa att återställa en användares lösenord och verifiera att det uppdateras korrekt (PATCH /users/{id}/password)
    @Test
    void testResetUserPassword() {
        Long userId = 1L;
        String newPassword = "newpassword123";

        User user = new User();
        user.setId(userId);
        user.setUsername("user");
        user.setPassword("oldpassword123");

        User updatedUser = new User();
        updatedUser.setId(userId);
        updatedUser.setPassword(newPassword);
        updatedUser.setUsername("user");

        when(adminService.resetUserPassword(userId, newPassword)).thenReturn(updatedUser);

        ResponseEntity<User> response = adminController.resetUserPassword(userId, newPassword);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertNotNull(response.getBody());
        assertEquals("user", response.getBody().getUsername());
        assertEquals(newPassword, response.getBody().getPassword());


        verify(adminService, times(1)).resetUserPassword(userId, newPassword);
    }


    // assignTrainerToClass() → Testa att tilldela en tränare till en klass och verifiera att tränaren sparas korrekt (POST /classes/{classId}/trainer/{trainerId})
    @Test
    void testAssignTrainerToClass() {
        Long classId = 1L;
        Long trainerId = 2L;

        TrainingClass trainingClass = new TrainingClass();
        trainingClass.setId(classId);
        trainingClass.setTitle("BJJ");

        User trainer = new User();
        trainer.setId(trainerId);
        trainer.setUsername("trainer");

        TrainingClass updatedTrainingClass = new TrainingClass();
        updatedTrainingClass.setId(classId);
        updatedTrainingClass.setTitle("BJJ");
        updatedTrainingClass.setTrainer(trainer);

        when(adminService.assignTrainerToClass(classId, trainerId)).thenReturn(updatedTrainingClass);

        ResponseEntity<TrainingClass> response = adminController.assignTrainerToClass(classId, trainerId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertNotNull(response.getBody());
        assertEquals("trainer", response.getBody().getTrainer().getUsername());
        assertEquals(trainerId, response.getBody().getTrainer().getId());
        assertEquals("BJJ", response.getBody().getTitle());

        verify(adminService, times(1)).assignTrainerToClass(classId, trainerId);
    }

    // removeTrainerFromClass() → Testa att ta bort en tränare från en klass och verifiera att tränaren tas bort (DELETE /classes/{classId}/trainer/{trainerId})
    @Test
    void testRemoveTrainerFromClass() {
        // Arrange
        Long classId = 1L;
        Long trainerId = 2L;

        TrainingClass trainingClass = new TrainingClass();
        trainingClass.setId(classId);
        trainingClass.setTitle("Yoga Class");

        User trainer = new User();
        trainer.setId(trainerId);
        trainer.setUsername("John Doe");

        trainingClass.setTrainer(trainer); // Tilldela tränaren till klassen

        // Mocka tjänsten så att den returnerar en bekräftelse på att tränaren har tagits bort
        when(adminService.removeTrainerFromClass(classId, trainerId)).thenReturn("Trainer " + trainerId + " removed from the class: " + trainingClass.getTitle());

        // Act
        ResponseEntity<String> response = adminController.removeTrainerFromClass(classId, trainerId);

        // Assert
        Assertions.assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode()); // Förväntar oss 204 No Content
        assertEquals("Trainer " + trainerId + " removed from the class: " + trainingClass.getTitle(), response.getBody());

        verify(adminService, times(1)).removeTrainerFromClass(classId, trainerId);
    }

    // getTrainerFromClass() → Testa att hämta tränaren för en klass och verifiera att rätt tränare returneras (GET /classes/{classId}/trainer)
    @Test
    void testGetTrainerFromClass() {
        // Arrange
        Long classId = 1L;
        User expectedTrainer = new User(2L, "jane.doe@example.com", "JaneDoe", "password123", Role.ROLE_TRAINER);

        TrainingClass trainingClass = new TrainingClass();
        trainingClass.setId(classId);
        trainingClass.setTrainer(expectedTrainer); // Tilldela tränaren till klassen

        // Mocka tjänsten så att den returnerar tränaren
        when(adminService.getTrainerFromClass(classId)).thenReturn(Optional.of(expectedTrainer));

        // Act
        ResponseEntity<User> response = adminController.getTrainerFromClass(classId);

        // Assert
        Assertions.assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode()); // Förväntar oss 200 OK
        assertEquals(expectedTrainer, response.getBody()); // Kontrollera att rätt tränare returneras

        verify(adminService, times(1)).getTrainerFromClass(classId);
    }

    // getAllTrainers() → Testa att hämta alla tränare och verifiera att listan är korrekt (GET /trainers)
    @Test
    void testGetAllTrainers() {
        // Arrange
        User trainer1 = new User(1L, "john.doe@example.com", "JohnDoe", "password123", Role.ROLE_TRAINER);
        User trainer2 = new User(2L, "jane.doe@example.com", "JaneDoe", "password123", Role.ROLE_TRAINER);
        List<User> expectedTrainers = Arrays.asList(trainer1, trainer2);

        // Mocka tjänsten så att den returnerar listan med tränare
        when(adminService.getAllTrainers()).thenReturn(expectedTrainers);

        // Act
        ResponseEntity<List<User>> response = adminController.getAllTrainers();

        // Assert
        Assertions.assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode()); // Förväntar oss 200 OK
        assertEquals(expectedTrainers, response.getBody()); // Kontrollera att listan av tränare är korrekt

        verify(adminService, times(1)).getAllTrainers();
    }



    // getAllBookings() → Testa att hämta alla bokningar och verifiera att listan är korrekt (GET /bookings)
    @Test
    void testGetAllBookings() {
        // Arrange
        User member = new User(1L, "john.doe@example.com", "JohnDoe", "password123", Role.ROLE_MEMBER);
        TrainingClass trainingClass = new TrainingClass();
        trainingClass.setId(1L);
        trainingClass.setTitle("Yoga Class");

        Booking booking1 = new Booking(member, trainingClass);
        Booking booking2 = new Booking(member, trainingClass);

        List<Booking> expectedBookings = Arrays.asList(booking1, booking2);

        when(adminService.getAllBookings()).thenReturn(expectedBookings);

        ResponseEntity<List<Booking>> response = adminController.getAllBookings();

        Assertions.assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedBookings.size(), Objects.requireNonNull(response.getBody()).size());

        // Kontrollera att varje bokning har rätt attribut
        for (int i = 0; i < expectedBookings.size(); i++) {
            Booking expectedBooking = expectedBookings.get(i);
            Booking actualBooking = response.getBody().get(i);

            assertEquals(expectedBooking.getMember(), actualBooking.getMember());
            assertEquals(expectedBooking.getTrainingClass(), actualBooking.getTrainingClass());
            assertEquals(expectedBooking.getBookingDate(), actualBooking.getBookingDate());
            assertEquals(expectedBooking.getBookingTimeStamp(), actualBooking.getBookingTimeStamp());
            assertEquals(expectedBooking.getBookingStatus(), actualBooking.getBookingStatus());
        }

        verify(adminService, times(1)).getAllBookings();
    }

    // deleteBooking() → Testa att ta bort en bokning och verifiera att den inte längre finns (DELETE /bookings/{bookingId})
    @Test
    void testDeleteBooking() {
        Long bookingId = 1L;

        when(adminService.deleteBooking(bookingId)).thenReturn("Booking " + bookingId + " deleted");

        RedirectView redirectView = adminController.deleteBooking(bookingId, "delete");

        assertEquals("/adminPage?success=deleted", redirectView.getUrl());
        verify(adminService, times(1)).deleteBooking(bookingId);
    }

    // getBookingById() → Testa att hämta en bokning med giltigt ID och verifiera att rätt bokning returneras (GET /bookings/{id})
    @Test
    void testGetBookingById() {
        // Arrange
        Long bookingId = 1L;
        User member = new User(1L, "john.doe@example.com", "JohnDoe", "password123", Role.ROLE_MEMBER);
        TrainingClass trainingClass = new TrainingClass();
        trainingClass.setId(1L);
        trainingClass.setTitle("Yoga Class");

        Booking expectedBooking = new Booking(member, trainingClass);

        when(adminService.getBookingById(bookingId)).thenReturn(expectedBooking);

        ResponseEntity<Booking> response = adminController.getBookingById(bookingId);

        Assertions.assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedBooking, response.getBody());

        verify(adminService, times(1)).getBookingById(bookingId);
    }

    // cancelAllBookingsForClass() → Testa att avboka alla bokningar för en klass och verifiera att status ändras (DELETE /classes/{trainingClassId}/bookings)
    @Test
    void testCancelAllBookingsForClass() {
        // Arrange
        Long trainingClassId = 1L;
        User member = new User(1L, "john.doe@example.com", "JohnDoe", "password123", Role.ROLE_MEMBER);
        TrainingClass trainingClass = new TrainingClass();
        trainingClass.setId(trainingClassId);
        trainingClass.setTitle("Yoga Class");

        // Skapa bokningar med status PENDING
        Booking booking1 = new Booking(member, trainingClass);
        Booking booking2 = new Booking(member, trainingClass);

        booking1.setBookingStatus(BookingStatus.PENDING);
        booking2.setBookingStatus(BookingStatus.PENDING);

        List<Booking> bookings = Arrays.asList(booking1, booking2);

        // Mocka tjänsten så att den returnerar de avbokade bokningarna med status CANCELLED
        Booking cancelledBooking1 = new Booking(member, trainingClass);
        Booking cancelledBooking2 = new Booking(member, trainingClass);

        cancelledBooking1.setBookingStatus(BookingStatus.CANCELLED);
        cancelledBooking2.setBookingStatus(BookingStatus.CANCELLED);

        List<Booking> cancelledBookings = Arrays.asList(cancelledBooking1, cancelledBooking2);

        // Mocka tjänsten så att den returnerar de avbokade bokningarna
        when(adminService.cancelAllBookingsForClass(trainingClassId)).thenReturn(cancelledBookings);

        // Act
        ResponseEntity<List<Booking>> response = adminController.cancelAllBookingsForClass(trainingClassId);

        // Assert
        Assertions.assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode()); // Förväntar oss 200 OK
        assertEquals(2, response.getBody().size()); // Kontrollera att vi har två avbokade bokningar

        // Kontrollera att statusen för varje bokning har ändrats till CANCELLED
        for (Booking booking : response.getBody()) {
            assertEquals(BookingStatus.CANCELLED, booking.getBookingStatus()); // Här ska vi kontrollera att statusen är CANCELLED
        }

        verify(adminService, times(1)).cancelAllBookingsForClass(trainingClassId);
    }

    // getBookingsByStatus() → Testa att hämta bokningar baserat på status och verifiera att rätt bokningar returneras (GET /bookings/status/{status})
    @Test
    void testGetBookingsByStatus() {
        // Arrange
        BookingStatus status = BookingStatus.CANCELLED;
        User member = new User(1L, "john.doe@example.com", "JohnDoe", "password123", Role.ROLE_MEMBER);
        TrainingClass trainingClass = new TrainingClass();
        trainingClass.setId(1L);
        trainingClass.setTitle("Yoga Class");

        // Skapa bokningar med status CANCELLED
        Booking booking1 = new Booking(member, trainingClass);
        Booking booking2 = new Booking(member, trainingClass);

        booking1.setBookingStatus(status);
        booking2.setBookingStatus(status);

        List<Booking> expectedBookings = Arrays.asList(booking1, booking2);

        // Mocka tjänsten så att den returnerar bokningar med den angivna statusen
        when(adminService.getBookingsByStatus(status)).thenReturn(expectedBookings);

        // Act
        ResponseEntity<List<Booking>> response = adminController.getBookingsByStatus(status);

        // Assert
        Assertions.assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode()); // Förväntar oss 200 OK
        assertEquals(expectedBookings.size(), response.getBody().size()); // Kontrollera att vi har rätt antal bokningar

        // Kontrollera att varje bokning har rätt status
        for (Booking booking : response.getBody()) {
            assertEquals(status, booking.getBookingStatus()); // Kontrollera att statusen är korrekt
        }

        verify(adminService, times(1)).getBookingsByStatus(status);
    }

    // removeExpiredBookings() → Testa att ta bort utlöpta bokningar och verifiera att de tas bort korrekt (DELETE /bookings/expired)
    @Test
    void testRemoveExpiredBookings() {
        // Arrange
        // Mocka tjänsten så att den inte gör något när removeExpiredBookings anropas
        doNothing().when(adminService).removeExpiredBookings();

        // Act
        ResponseEntity<String> response = adminController.removeExpiredBookings();

        // Assert
        Assertions.assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode()); // Förväntar oss 200 OK
        assertEquals("Expired bookings removed", response.getBody()); // Kontrollera att meddelandet är korrekt

        // Verifiera att tjänstens removeExpiredBookings-metod anropades en gång
        verify(adminService, times(1)).removeExpiredBookings();
    }

    // getBookingStats() → Testa att hämta bokningsstatistik och verifiera att statistiken är korrekt (GET /bookings/stats)
    @Test
    void testGetBookingStats() {
        // Arrange
        BookingStatsDTO expectedStats = new BookingStatsDTO(100, 70, 20, 5, 3, 2, "Yoga Class");
        when(adminService.getBookingStats()).thenReturn(expectedStats);

        // Act
        ResponseEntity<BookingStatsDTO> actualStats = adminController.getBookingStats();

        // Assert
        assertEquals(expectedStats.getTotalBookings(), Objects.requireNonNull(actualStats.getBody()).getTotalBookings());
        assertEquals(expectedStats.getConfirmedBookings(), actualStats.getBody().getConfirmedBookings());
        assertEquals(expectedStats.getCancelledBookings(), actualStats.getBody().getCancelledBookings());
        assertEquals(expectedStats.getPendingBookings(), actualStats.getBody().getPendingBookings());
        assertEquals(expectedStats.getCancelledBookingsByMember(), actualStats.getBody().getCancelledBookingsByMember());
        assertEquals(expectedStats.getExpiredBookings(), actualStats.getBody().getExpiredBookings());
        assertEquals(expectedStats.getMostPopularClass(), actualStats.getBody().getMostPopularClass());
    }

    // getMemberStats() → Testa att hämta medlemsstatistik och verifiera att statistiken är korrekt (GET /members/stats)
    @Test
    void testGetMemberStats() {
        // Arrange
        MemberStatsDTO expectedStats = new MemberStatsDTO(150, 120, 30, 1); // Exempelvärden
        when(adminService.getMemberStats()).thenReturn(expectedStats);

        // Act
        MemberStatsDTO actualStats = adminController.getMemberStats().getBody(); // Hämta body från ResponseEntity

        // Assert
        assertEquals(expectedStats.getTotalMembers(), actualStats.getTotalMembers());
        assertEquals(expectedStats.getActiveMembers(), actualStats.getActiveMembers());
        assertEquals(expectedStats.getInactiveMembers(), actualStats.getInactiveMembers());
        assertEquals(expectedStats.getMostActiveMemberId(), actualStats.getMostActiveMemberId());
    }

    // getTotalBookingsForClass() → Testa att hämta totala bokningar för en klass och verifiera att rätt antal returneras (GET /classes/{classId}/bookings/total)
    @Test
    void testGetTotalBookingsForClass() {
        // Arrange
        Long classId = 1L; // Exempel på klass-ID
        Long expectedTotalBookings = 50L; // Exempel på förväntat antal bokningar
        when(adminService.getTotalBookingsForClass(classId)).thenReturn(String.valueOf(expectedTotalBookings));

        // Act
        Long actualTotalBookings = adminController.getTotalBookingsForClass(classId).getBody(); // Hämta body från ResponseEntity

        // Assert
        assertEquals(expectedTotalBookings, actualTotalBookings);
    }

    // getBookingsByPeriod() → Testa att hämta bokningar inom en viss period och verifiera att rätt bokningar returneras (GET /bookings/period?startDate={startDate}&endDate={endDate})
    @Test
    void testGetBookingsByPeriod() {
        // Arrange
        LocalDate startDate = LocalDate.of(2023, 1, 1);
        LocalDate endDate = LocalDate.of(2023, 1, 31);

        // Skapa exempelbokningar
        Booking booking1 = new Booking();
        booking1.setId(1L);
        booking1.setBookingDate(startDate);

        Booking booking2 = new Booking();
        booking2.setId(2L);
        booking2.setBookingDate(startDate.plusDays(5));

        List<Booking> expectedBookings = Arrays.asList(booking1, booking2);

        // Mocka tjänsten
        when(adminService.getBookingsByPeriod(startDate, endDate)).thenReturn(expectedBookings);

        // Act
        List<Booking> actualBookings = adminController.getBookingsByPeriod(startDate, endDate).getBody(); // Hämta body från ResponseEntity

        // Assert
        assertNotNull(actualBookings);
        assertEquals(expectedBookings.size(), actualBookings.size());
        assertEquals(expectedBookings.get(0).getId(), actualBookings.get(0).getId());
        assertEquals(expectedBookings.get(1).getId(), actualBookings.get(1).getId());
    }

    // getAllBookingsForMember() → Testa att hämta alla bokningar för en medlem och verifiera att rätt bokningar returneras (GET /members/{memberId}/bookings)
    @Test
    void testGetAllBookingsForMember() {
        // Arrange
        Long memberId = 1L; // Exempel på medlem-ID
        Booking booking1 = new Booking();
        booking1.setId(1L);
        booking1.setMember(new User()); // Sätt en användare om det behövs
        booking1.setBookingDate(LocalDate.now());

        Booking booking2 = new Booking();
        booking2.setId(2L);
        booking2.setMember(new User()); // Sätt en användare om det behövs
        booking2.setBookingDate(LocalDate.now().plusDays(1));

        List<Booking> expectedBookings = Arrays.asList(booking1, booking2);

        // Mocka tjänsten
        when(adminService.getAllBookingsForMember(memberId)).thenReturn(expectedBookings);

        // Act
        List<Booking> actualBookings = adminController.getAllBookingsForMember(memberId).getBody(); // Hämta body från ResponseEntity

        // Assert
        assertNotNull(actualBookings);
        assertEquals(expectedBookings.size(), actualBookings.size());
        assertEquals(expectedBookings.get(0).getId(), actualBookings.get(0).getId());
        assertEquals(expectedBookings.get(1).getId(), actualBookings.get(1).getId());
    }

    // getClassStats() → Testa att hämta statistik för klasser och verifiera att statistiken är korrekt (GET /classes/stats)
    @Test
    void testGetClassStats() {
        // Arrange
        Map<String, Long> expectedStatsMap = new HashMap<>();
        expectedStatsMap.put("1", 5L); // Träningsklass med ID 1 har 5 bokningar
        expectedStatsMap.put("2", 3L); // Träningsklass med ID 2 har 3 bokningar

        // Mocka tjänsten
        when(adminService.getClassStats()).thenReturn(expectedStatsMap);

        // Act
        ResponseEntity<List<TrainingClassStatsDTO>> response = adminController.getClassStats();
        List<TrainingClassStatsDTO> actualStats = response.getBody(); // Hämta body från ResponseEntity

        // Assert
        assertNotNull(actualStats);
        assertEquals(expectedStatsMap.size(), actualStats.size());
        assertEquals(Long.valueOf(1), actualStats.get(0).getTrainingClassId());
        assertEquals(5, actualStats.get(0).getBookingCount());
        assertEquals(Long.valueOf(2), actualStats.get(1).getTrainingClassId());
        assertEquals(3, actualStats.get(1).getBookingCount());
    }
}
