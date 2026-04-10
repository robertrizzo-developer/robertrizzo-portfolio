package com.jarnvilja.controller;

import com.jarnvilja.dto.TrainingClassStatsDTO;
import com.jarnvilja.model.Booking;
import com.jarnvilja.model.BookingStatus;
import com.jarnvilja.model.TrainingClass;
import com.jarnvilja.model.User;
import com.jarnvilja.service.TrainerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class TrainerControllerTest {

    @InjectMocks
    private TrainerController trainerController; // Den controller som ska testas

    @Mock
    private TrainerService trainerService; // Mock av TrainerService

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this); // Initierar mockarna innan varje test
    }

/*
    // getMyUpcomingTrainingClasses() → Testa att hämta kommande träningspass för en tränare och verifiera att rätt pass returneras (GET /trainers/{trainerId}/classes/upcoming)
    @Test
    void testGetMyUpcomingTrainingClasses() {
        Long trainerId = 1L; // Exempel på trainerId
        List<TrainingClass> mockUpcomingClasses = new ArrayList<>();

        // Skapa mockade träningspass
        TrainingClass class1 = new TrainingClass();
        class1.setId(1L);
        class1.setTitle("Yoga Class");
        class1.setDescription("A relaxing yoga session");
        class1.setTrainingDay(DayOfWeek.MONDAY); // Kommande pass

        TrainingClass class2 = new TrainingClass();
        class2.setId(2L);
        class2.setTitle("Pilates Class");
        class2.setDescription("A strengthening pilates session");
        class2.setTrainingDay(DayOfWeek.WEDNESDAY); // Kommande pass

        mockUpcomingClasses.add(class1);
        mockUpcomingClasses.add(class2);

        // Mocka beteendet för trainerService
        when(trainerService.getMyUpcomingTrainingClasses(trainerId)).thenReturn(mockUpcomingClasses);

        // Anropa metoden som ska testas
        ResponseEntity<List<TrainingClass>> response = trainerController.getMyUpcomingTrainingClasses(trainerId);

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Kontrollera att den returnerade listan med kommande träningspass är korrekt
        assertEquals(mockUpcomingClasses, response.getBody());
    }

    // getMyPastTrainingClasses() → Testa att hämta tidigare träningspass för en tränare och verifiera att rätt pass returneras (GET /trainers/{trainerId}/classes/past)
    @Test
    void testGetMyPastTrainingClasses() {
        Long trainerId = 1L; // Exempel på trainerId
        List<TrainingClass> mockPastClasses = new ArrayList<>();

        // Skapa mockade träningspass
        TrainingClass class1 = new TrainingClass();
        class1.setId(1L);
        class1.setTitle("Yoga Class"); // Använd setTitle istället för setName
        class1.setDescription("A relaxing yoga session");
        class1.setTrainingDay(DayOfWeek.MONDAY); // Tidigare pass

        TrainingClass class2 = new TrainingClass();
        class2.setId(2L);
        class2.setTitle("Pilates Class"); // Använd setTitle istället för setName
        class2.setDescription("A strengthening pilates session");
        class2.setTrainingDay(DayOfWeek.WEDNESDAY); // Tidigare pass

        mockPastClasses.add(class1);
        mockPastClasses.add(class2);

        // Mocka beteendet för trainerService
        when(trainerService.getMyPastTrainingClasses(trainerId)).thenReturn(mockPastClasses);

        // Anropa metoden som ska testas
        ResponseEntity<List<TrainingClass>> response = trainerController.getMyPastTrainingClasses(trainerId);

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Kontrollera att den returnerade listan med tidigare träningspass är korrekt
        assertEquals(mockPastClasses, response.getBody());
    }

 */

    // getTrainingClassDetails() → Testa att hämta detaljer för ett specifikt träningspass och verifiera att rätt information returneras (GET /trainers/{trainerId}/classes/{trainingClassId})
    @Test
    void testGetTrainingClassDetails() {
        Long trainerId = 1L; // Exempel på trainerId
        Long trainingClassId = 1L; // Exempel på trainingClassId

        // Skapa mockat träningspass
        TrainingClass mockTrainingClass = new TrainingClass();
        mockTrainingClass.setId(trainingClassId);
        mockTrainingClass.setTitle("Yoga Class");
        mockTrainingClass.setDescription("A relaxing yoga session");
        mockTrainingClass.setTrainingDay(DayOfWeek.MONDAY); // Kommande pass

        // Mocka beteendet för trainerService
        when(trainerService.getTrainingClassDetails(trainerId, trainingClassId)).thenReturn(mockTrainingClass);

        // Anropa metoden som ska testas
        ResponseEntity<TrainingClass> response = trainerController.getTrainingClassDetails(trainerId, trainingClassId);

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Kontrollera att den returnerade träningspasset är korrekt
        assertEquals(mockTrainingClass, response.getBody());
    }

    // getBookingsForMyTrainingClass() → Testa att hämta alla bokningar för ett träningspass och verifiera att rätt bokningar returneras (GET /trainers/{trainerId}/classes/{trainingClassId}/bookings)
    @Test
    void testGetBookingsForMyTrainingClass() {
        Long trainerId = 1L; // Exempel på trainerId
        Long trainingClassId = 1L; // Exempel på trainingClassId

        // Skapa mockade bokningar
        List<Booking> mockBookings = new ArrayList<>();

        // Skapa mockade användare
        User member1 = new User(); // Anta att User har en standardkonstruktor
        member1.setId(101L); // Sätt ID för medlem
        User member2 = new User();
        member2.setId(102L); // Sätt ID för medlem

        // Skapa mockade bokningar
        Booking booking1 = new Booking(member1, new TrainingClass()); // Skapa en ny TrainingClass för bokningen
        booking1.setId(1L);
        booking1.setBookingStatus(BookingStatus.PENDING); // Sätt status för bokningen

        Booking booking2 = new Booking(member2, new TrainingClass());
        booking2.setId(2L);
        booking2.setBookingStatus(BookingStatus.CONFIRMED); // Sätt status för bokningen

        mockBookings.add(booking1);
        mockBookings.add(booking2);

        // Mocka beteendet för trainerService
        when(trainerService.getBookingsForMyTrainingClass(trainerId, trainingClassId)).thenReturn(mockBookings);

        // Anropa metoden som ska testas
        ResponseEntity<List<Booking>> response = trainerController.getBookingsForMyTrainingClass(trainerId, trainingClassId);

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Kontrollera att den returnerade listan med bokningar är korrekt
        assertEquals(mockBookings, response.getBody());
    }

    // getMembersForMyTrainingClass() → Testa att hämta alla medlemmar som är bokade på ett träningspass och verifiera att rätt medlemmar returneras (GET /trainers/{trainerId}/classes/{trainingClassId}/members)
    @Test
    void testGetMembersForMyTrainingClass() {
        Long trainerId = 1L; // Exempel på trainerId
        Long trainingClassId = 1L; // Exempel på trainingClassId

        // Skapa mockade medlemmar
        List<User> mockMembers = new ArrayList<>();

        User member1 = new User(); // Anta att User har en standardkonstruktor
        member1.setId(101L); // Sätt ID för medlem
        member1.setUsername("Alice"); // Sätt namn för medlem

        User member2 = new User();
        member2.setId(102L); // Sätt ID för medlem
        member2.setUsername("Bob"); // Sätt namn för medlem

        mockMembers.add(member1);
        mockMembers.add(member2);

        // Mocka beteendet för trainerService
        when(trainerService.getMembersForMyTrainingClass(trainerId, trainingClassId)).thenReturn(mockMembers);

        // Anropa metoden som ska testas
        ResponseEntity<List<User>> response = trainerController.getMembersForMyTrainingClass(trainerId, trainingClassId);

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Kontrollera att den returnerade listan med medlemmar är korrekt
        assertEquals(mockMembers, response.getBody());
    }

    // removeMemberFromMyTrainingClass() → Testa att ta bort en medlem från ett träningspass och verifiera att bokningen tas bort (DELETE /trainers/{trainerId}/classes/{trainingClassId}/members/{memberId})
    @Test
    void testRemoveMemberFromMyTrainingClass() {
        Long trainerId = 1L; // Exempel på trainerId
        Long trainingClassId = 1L; // Exempel på trainingClassId
        Long memberId = 101L; // Exempel på memberId

        // Mocka beteendet för trainerService
        doNothing().when(trainerService).removeMemberFromMyTrainingClass(trainerId, trainingClassId, memberId);

        // Anropa metoden som ska testas
        ResponseEntity<Void> response = trainerController.removeMemberFromMyTrainingClass(trainerId, trainingClassId, memberId);

        // Kontrollera att svaret är 204 No Content
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

        // Verifiera att metoden i trainerService anropades med rätt parametrar
        verify(trainerService, times(1)).removeMemberFromMyTrainingClass(trainerId, trainingClassId, memberId);
    }

    // sendReminderForUpcomingClass() → Testa att skicka en påminnelse för ett kommande träningspass och verifiera att e-post skickas (POST /trainers/{trainerId}/classes/{trainingClassId}/reminder)
    @Test
    void testSendReminderForUpcomingClass() {
        Long trainerId = 1L; // Exempel på trainerId
        Long trainingClassId = 1L; // Exempel på trainingClassId

        // Mocka beteendet för trainerService
        doNothing().when(trainerService).sendReminderForUpcomingClass(trainerId, trainingClassId);

        // Anropa metoden som ska testas
        ResponseEntity<Void> response = trainerController.sendReminderForUpcomingClass(trainerId, trainingClassId);

        // Kontrollera att svaret är 204 No Content
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

        // Verifiera att metoden i trainerService anropades med rätt parametrar
        verify(trainerService, times(1)).sendReminderForUpcomingClass(trainerId, trainingClassId);
    }

    // cancelMyTrainingClass() → Testa att ställa in ett träningspass och verifiera att status ändras samt att e-post skickas till tränaren och medlemmarna (DELETE /trainers/classes/{trainingClassId})
    @Test
    void testCancelMyTrainingClass() {
        Long trainingClassId = 1L; // Exempel på trainingClassId
        String reason = "Oväntat väder"; // Exempel på anledning till avbokning

        // Mocka beteendet för trainerService
        doNothing().when(trainerService).cancelMyTrainingClass(trainingClassId, reason);

        // Anropa metoden som ska testas
        ResponseEntity<Void> response = trainerController.cancelMyTrainingClass(trainingClassId, reason);

        // Kontrollera att svaret är 204 No Content
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

        // Verifiera att metoden i trainerService anropades med rätt parametrar
        verify(trainerService, times(1)).cancelMyTrainingClass(trainingClassId, reason);
    }

    // getTrainingClassStats() → Testa att hämta statistik för ett specifikt träningspass och verifiera att rätt statistik returneras (GET /trainers/{trainerId}/classes/{trainingClassId}/stats)
    @Test
    void testGetTrainingClassStats() {
        Long trainerId = 1L; // Exempel på trainerId
        Long trainingClassId = 1L; // Exempel på trainingClassId

        // Mocka antalet bokningar
        long bookingCount = 10;

        // Mocka beteendet för trainerService
        when(trainerService.getTrainingClassStats(trainerId, trainingClassId)).thenReturn(bookingCount);

        // Anropa metoden som ska testas
        ResponseEntity<TrainingClassStatsDTO> response = trainerController.getTrainingClassStats(trainerId, trainingClassId);

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Kontrollera att den returnerade statistiken är korrekt
        TrainingClassStatsDTO expectedStats = new TrainingClassStatsDTO(trainingClassId, (int) bookingCount);
        assertEquals(expectedStats, response.getBody());
    }

    // getMostPopularOfMyTrainingClasses() → Testa att hämta det mest populära träningspasset för en tränare och verifiera att rätt pass returneras (GET /trainers/{trainerId}/classes/popular)
    @Test
    void testGetMostPopularOfMyTrainingClasses() {
        Long trainerId = 1L; // Exempel på trainerId

        // Skapa en mockad instans av TrainingClass
        TrainingClass mockPopularClass = new TrainingClass();
        mockPopularClass.setId(1L); // Sätt ID eller andra egenskaper som behövs

        // Mocka beteendet för trainerService
        when(trainerService.getMostPopularOfMyTrainingClasses(trainerId)).thenReturn(mockPopularClass);

        // Anropa metoden som ska testas
        ResponseEntity<TrainingClass> response = trainerController.getMostPopularOfMyTrainingClasses(trainerId);

        // Kontrollera att svaret är 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Kontrollera att den returnerade träningsklassen är korrekt
        assertEquals(mockPopularClass, response.getBody());
    }

}
