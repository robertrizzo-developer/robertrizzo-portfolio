package com.jarnvilja.service;

import com.jarnvilja.dto.TrainingClassStatsDTO;
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
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TrainingClassServiceTest {

    @Mock
    private TrainingClassRepository trainingClassRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private TrainingClassService trainingClassService;

    private TrainingClass trainingClass;
    private Long trainingClassId;
    private TrainingClass futureClass;
    private Long trainerId;
    private Long memberId;
    private User trainer;
    private User member;
    private Booking booking1;
    private Booking booking2;

    @BeforeEach
    void setUp() {
        trainerId = 1L;
        memberId = 2L;

        member = new User();
        member.setId(memberId);
        trainingClassId = 1L;

        trainer = new User();
        trainer.setId(trainerId);

        trainingClass = new TrainingClass();
        trainingClass.setId(trainingClassId);
        trainingClass.setTitle("BJJ");
        trainingClass.setDescription("Jiu-Jitsu teknik");
        trainingClass.setTrainingDay(DayOfWeek.MONDAY);
        trainingClass.setStartTime(LocalTime.of(18, 0));
        trainingClass.setEndTime(LocalTime.of(19, 0));
        trainingClass.setTrainer(trainer);

        futureClass = new TrainingClass();
        futureClass.setId(2L);
        futureClass.setTitle("THAIBOXNING");
        futureClass.setDescription("CLINCH");
        futureClass.setTrainingDay(DayOfWeek.TUESDAY);
        futureClass.setStartTime(LocalTime.of(18, 0));
        futureClass.setEndTime(LocalTime.of(19, 0));
        futureClass.setTrainer(trainer);

        booking1 = new Booking();
        booking1.setMember(member);
        booking1.setTrainingClass(trainingClass);

        booking2 = new Booking();
        booking2.setMember(member);
        booking2.setTrainingClass(futureClass);

    }

    // Hantera träningspass:

    // createTrainingClass()             // Skapa ett nytt träningspass
    @Test
    void testCreateTrainingClass() {
        when(trainingClassRepository.save(trainingClass)).thenReturn(trainingClass);

        TrainingClass createdClass = trainingClassService.createTrainingClass(trainingClass);

        assertEquals(trainingClass, createdClass);
    }

    // updateTrainingClass()             // Uppdatera ett befintligt träningspass
    @Test
    void testUpdateTrainingClass() {
        TrainingClass updatedClass = new TrainingClass();
        updatedClass.setTitle("Boxning");
        updatedClass.setDescription("Boxningsträning");
        updatedClass.setTrainingDay(DayOfWeek.TUESDAY);
        updatedClass.setStartTime(LocalTime.of(17, 0));
        updatedClass.setEndTime(LocalTime.of(18, 0));

        when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass));
        when(trainingClassRepository.save(any(TrainingClass.class))).thenReturn(updatedClass);

        TrainingClass result = trainingClassService.updateTrainingClass(trainingClassId, updatedClass);

        assertEquals("Boxning", result.getTitle());
        assertEquals(DayOfWeek.TUESDAY, result.getTrainingDay());
    }

    // deleteTrainingClass()             // Ta bort ett träningspass
    @Test
    void testDeleteTrainingClass() {
        trainingClassService.deleteTrainingClass(trainingClassId);
        verify(trainingClassRepository, times(1)).deleteById(trainingClassId);
    }

    // getTrainingClassById()            // Hämta träningspass baserat på ID
    @Test
    void testGetTrainingClassById() {
        when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass));

        TrainingClass foundClass = trainingClassService.getTrainingClassById(trainingClassId);

        assertEquals(trainingClass, foundClass);
    }

    @Test
    void testGetAllTrainingClasses() {
        List<TrainingClass> classes = List.of(trainingClass);
        when(trainingClassRepository.findAvailableClasses()).thenReturn(classes);

        List<TrainingClass> result = trainingClassService.getAllTrainingClasses();

        assertEquals(1, result.size());
        assertEquals(trainingClass, result.get(0));
    }

    // getTrainingClassesForTrainer()    // Hämta alla träningspass för en specifik tränare
    @Test
    void testGetTrainingClassesForTrainer() {
        List<TrainingClass> classes = List.of(trainingClass);

        when(trainingClassRepository.findByTrainerId(trainerId)).thenReturn(classes);

        List<TrainingClass> result = trainingClassService.getTrainingClassesForTrainer(trainerId);

        assertEquals(1, result.size());
        assertEquals(trainingClass, result.get(0));
    }

    // getTrainingClassesForMember()     // Hämta alla träningspass en medlem har bokat
    @Test
    void testGetTrainingClassesForMember() {
        Long memberId = 2L;
        List<TrainingClass> bookedClasses = List.of(trainingClass, futureClass);

        when(trainingClassRepository.findTrainingClassesForMember(memberId)).thenReturn(bookedClasses);

        List<TrainingClass> result = trainingClassService.getTrainingClassesForMember(memberId);

        assertEquals(2, result.size());
        assertTrue(result.contains(trainingClass));
        assertTrue(result.contains(futureClass));

        verify(trainingClassRepository, times(1)).findTrainingClassesForMember(memberId);
    }


    // Schemaläggning och tillgänglighet:

    // scheduleTrainingClass()           // Schemalägg ett träningspass
    @Test
    void testScheduleTrainingClass() {
        // Given
        TrainingClass trainingClass3 = new TrainingClass("BOXNING", "TEKNIK", DayOfWeek.WEDNESDAY, Matta.MATTA_1, LocalTime.of(10, 0), LocalTime.of(11, 0));
        when(trainingClassRepository.save(any(TrainingClass.class))).thenReturn(trainingClass3);

        // When
        TrainingClass result = trainingClassService.scheduleTrainingClass(trainingClass3);

        // Then
        assertNotNull(result);
        assertEquals("BOXNING", result.getTitle());
        assertEquals(DayOfWeek.WEDNESDAY, result.getTrainingDay());
        assertEquals(LocalTime.of(10, 0), result.getStartTime());
        assertEquals(LocalTime.of(11, 0), result.getEndTime());

        verify(trainingClassRepository, times(1)).save(trainingClass3);
    }


    // updateTrainingClassSchedule()     // Uppdatera schemat för ett träningspass
    @Test
    void testUpdateTrainingClassSchedule() {
        Long trainingClassId = 5L;
        DayOfWeek newDay = DayOfWeek.WEDNESDAY;
        LocalTime newStartTime = LocalTime.of(18, 0);
        LocalTime newEndTime = LocalTime.of(19, 0);

        TrainingClass trainingClass5 = new TrainingClass("Yoga", "Yoga for all", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(9, 0), LocalTime.of(10, 0));

        when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass5));

        trainingClassService.updateTrainingClassSchedule(trainingClassId, newDay, newStartTime, newEndTime);

        assertEquals(newDay, trainingClass5.getTrainingDay());
        assertEquals(newStartTime, trainingClass5.getStartTime());
        assertEquals(newEndTime, trainingClass5.getEndTime());

        verify(trainingClassRepository, times(1)).save(trainingClass5);
    }


    // Tränare och deltagare:

    // assignTrainerToTrainingClass()    // Tilldela en tränare till ett träningspass
    @Test
    void testAssignTrainerToTrainingClass() {
        Long trainingClassId = 1L;
        Long trainerId = 2L;

        TrainingClass trainingClass = new TrainingClass("Yoga", "Yoga for all", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(9, 0), LocalTime.of(10, 0));
        User trainer = new User();
        trainer.setId(trainerId);

        when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass));
        when(userRepository.findById(trainerId)).thenReturn(Optional.of(trainer));

        trainingClassService.assignTrainerToTrainingClass(trainingClassId, trainerId);

        assertEquals(trainer, trainingClass.getTrainer());

        verify(trainingClassRepository, times(1)).save(trainingClass);
    }


    // removeTrainerFromTrainingClass()  // Ta bort tränare från ett träningspass
    @Test
    void testRemoveTrainerFromTrainingClass() {
        Long trainingClassId = 1L;

        TrainingClass trainingClass = new TrainingClass("Yoga", "Yoga for all", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(9, 0), LocalTime.of(10, 0));
        User trainer = new User();
        trainer.setId(2L);
        trainingClass.setTrainer(trainer);

        when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass));

        trainingClassService.removeTrainerFromTrainingClass(trainingClassId);

        assertNull(trainingClass.getTrainer());

        verify(trainingClassRepository, times(1)).save(trainingClass);
    }


    // addMemberToTrainingClass()        // Lägg till en medlem till ett träningspass
    @Test
    void testAddMemberToTrainingClass() {
        Long trainingClassId = 1L;
        Long memberId = 2L;

        TrainingClass trainingClass = new TrainingClass("Yoga", "Yoga for all", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(9, 0), LocalTime.of(10, 0));
        User member = new User();
        member.setId(memberId);

        Booking booking = new Booking();
        booking.setMember(member);
        booking.setTrainingClass(trainingClass);

        when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass));
        when(userRepository.findById(memberId)).thenReturn(Optional.of(member));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        trainingClassService.addMemberToTrainingClass(trainingClassId, memberId);

        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    // removeMemberFromTrainingClass()   // Ta bort en medlem från ett träningspass
    @Test
    void testRemoveMemberFromTrainingClass() {
        Long trainingClassId = 1L;
        Long memberId = 2L;

        TrainingClass trainingClass = new TrainingClass("Yoga", "Yoga for all", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(9, 0), LocalTime.of(10, 0));
        User member = new User();
        member.setId(memberId);

        Booking booking = new Booking();
        booking.setTrainingClass(trainingClass);
        booking.setMember(member);
        booking.setBookingStatus(BookingStatus.CONFIRMED);

        when(bookingRepository.findByTrainingClassIdAndMemberId(trainingClassId, memberId)).thenReturn(Optional.of(booking));

        trainingClassService.removeMemberFromTrainingClass(trainingClassId, memberId);

        verify(bookingRepository, times(1)).delete(booking);
    }


    // Statistik:

    // getTrainingClassStats()           // Hämta statistik för ett träningspass (t.ex. antal deltagare, bokningar)
    @Test
    void testGetTrainingClassStats() {
        Long trainingClassId = 1L;

        TrainingClass trainingClass = new TrainingClass("Yoga", "Yoga for all", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(9, 0), LocalTime.of(10, 0));

        Booking booking1 = new Booking();
        Booking booking2 = new Booking();

        trainingClass.setId(trainingClassId);
        trainingClass.setBookings(List.of(booking1, booking2));

        when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass));

        TrainingClassStatsDTO stats = trainingClassService.getTrainingClassStats(trainingClassId);

        assertEquals(2, stats.getBookingCount());
    }


    // getUpcomingTrainingClasses()      // Hämta alla kommande träningspass
    @Test
    void testGetUpcomingTrainingClass() {
        TrainingClass futureClass1 = new TrainingClass("BJJ", "Jiu-Jitsu", DayOfWeek.WEDNESDAY, Matta.MATTA_1, LocalTime.of(17, 0), LocalTime.of(18, 0));
        TrainingClass futureClass2 = new TrainingClass("Yoga", "Avslappnande yoga", DayOfWeek.FRIDAY, Matta.MATTA_1, LocalTime.of(10, 0), LocalTime.of(11, 0));

        futureClass1.setTrainingDay(LocalDate.now().plusDays(3).getDayOfWeek());
        futureClass2.setTrainingDay(LocalDate.now().plusDays(5).getDayOfWeek());

        List<TrainingClass> upcomingClasses = List.of(futureClass1, futureClass2);

        when(trainingClassRepository.findUpcomingTrainingClasses(LocalDate.now())).thenReturn(upcomingClasses);

        List<TrainingClass> result = trainingClassService.getUpcomingTrainingClasses();

        assertEquals(2, result.size());
        assertEquals("BJJ", result.get(0).getTitle());
        assertEquals("Yoga", result.get(1).getTitle());
    }


    // getPastTrainingClasses()          // Hämta alla tidigare genomförda träningspass
    @Test
    void testGetPastTrainingClasses() {
        TrainingClass pastClass1 = new TrainingClass("Boxning", "Slagträning", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(18, 0), LocalTime.of(19, 0));
        TrainingClass pastClass2 = new TrainingClass("Crossfit", "Högintensiv träning", DayOfWeek.TUESDAY, Matta.MATTA_1, LocalTime.of(16, 0), LocalTime.of(17, 0));

        pastClass1.setTrainingDay(LocalDate.now().minusDays(10).getDayOfWeek());
        pastClass2.setTrainingDay(LocalDate.now().minusDays(5).getDayOfWeek());

        List<TrainingClass> pastClasses = List.of(pastClass1, pastClass2);

        when(trainingClassRepository.findPastTrainingClasses(LocalDate.now())).thenReturn(pastClasses);

        List<TrainingClass> result = trainingClassService.getPastTrainingClasses();

        assertEquals(2, result.size());
        assertEquals("Boxning", result.get(0).getTitle());
        assertEquals("Crossfit", result.get(1).getTitle());
    }


    // Övrigt:

    // getTrainingClassByType()          // Hämta träningspass baserat på typ (t.ex. BJJ, Boxning, etc.)
    @Test
    void testGetTrainingClassByType() {
        String type = "Boxning";

        TrainingClass class1 = new TrainingClass("Boxning", "Teknikträning", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(18, 0), LocalTime.of(19, 0));
        TrainingClass class2 = new TrainingClass("Boxning", "Konditionsträning", DayOfWeek.WEDNESDAY, Matta.MATTA_1, LocalTime.of(17, 0), LocalTime.of(18, 0));

        List<TrainingClass> boxingClasses = List.of(class1, class2);

        when(trainingClassRepository.findByTitleContainingIgnoreCase(type)).thenReturn(boxingClasses);

        List<TrainingClass> result = trainingClassService.getTrainingClassByType(type);

        assertEquals(2, result.size());
        assertEquals("Boxning", result.get(0).getTitle());
        assertEquals("Boxning", result.get(1).getTitle());
    }


    // getMemberTrainingClassHistory()   // Hämta en medlems träningspasshistorik
    @Test
    void testGetMemberTrainingClassHistory() {
        // Mocka repository
        List<Booking> bookings = List.of(booking1, booking2);
        when(bookingRepository.findByMemberId(member.getId())).thenReturn(bookings);

        // Anropa metoden i service
        List<TrainingClass> result = trainingClassService.getMemberTrainingClassHistory(member.getId());

        // Verifiera att rätt träningspass returneras
        assertEquals(2, result.size());
        assertTrue(result.contains(trainingClass));
        assertTrue(result.contains(futureClass));
    }

}
