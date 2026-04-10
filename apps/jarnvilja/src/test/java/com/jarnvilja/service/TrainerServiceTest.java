package com.jarnvilja.service;

import com.jarnvilja.model.Booking;
import com.jarnvilja.model.Matta;
import com.jarnvilja.model.TrainingClass;
import com.jarnvilja.model.User;
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
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TrainerServiceTest {

    @InjectMocks
    private TrainerService trainerService;

    @Mock
    private TrainingClassRepository trainingClassRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private EmailService emailService;


    private Long trainerId;
    private Long trainingClassId;
    private TrainingClass futureClass;
    private TrainingClass pastClass;
    private TrainingClass trainingClass;
    private Booking booking;
    private User member;
    private User trainer;

    @BeforeEach
    public void setUp() {
        trainerId = 1L;
        trainingClassId = 1L;

        member = new User();
        member.setId(2L);
        member.setEmail("member@example.com");

        trainer = new User();
        trainer.setId(trainerId);
        trainer.setEmail("trainer@example.com");

        futureClass = new TrainingClass("BJJ", "Jiu-Jitsu", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(17, 0), LocalTime.of(18, 0));
        futureClass.setTrainingDay(LocalDate.now().plusDays(1).getDayOfWeek());
        futureClass.setTrainer(trainer);

        pastClass = new TrainingClass("Boxning", "Boxing", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(17, 0), LocalTime.of(18, 0));
        pastClass.setTrainingDay(LocalDate.now().minusDays(1).getDayOfWeek());
        pastClass.setTrainer(trainer);

        trainingClass = new TrainingClass("Yoga", "Yoga for all", DayOfWeek.MONDAY, Matta.MATTA_1, LocalTime.of(9, 0), LocalTime.of(10, 0));
        trainingClass.setTrainer(trainer);

        booking = new Booking();
        booking.setId(200L);
        booking.setMember(member);
        booking.setTrainingClass(trainingClass);
    }


    //  Tränarens tillgång till träningspass:

    /*
   //   getMyUpcomingTrainingClasses() → Hämta kommande träningspass tränaren ska hålla
   @Test
   public void testGetMyUpcomingTrainingClasses() {
       Long trainerId = 1L;
       DayOfWeek futureDate = DayOfWeek.FRIDAY;
       TrainingClass futureClass = new TrainingClass("BJJ", "Jiu-Jitsu", DayOfWeek.FRIDAY, LocalTime.of(17, 0), LocalTime.of(18, 0));
       futureClass.setTrainingDay(futureDate);
       futureClass.setStartTime(LocalTime.of(17, 0));
       futureClass.setEndTime(LocalTime.of(18, 0));
       futureClass.setTrainer(new User(trainerId)); // Mockar tränaren

       List<TrainingClass> upcomingClasses = List.of(futureClass);

       when(trainingClassRepository.findByTrainerIdAndTrainingDayAfter(trainerId, futureDate)).thenReturn(upcomingClasses);

       List<TrainingClass> result = trainerService.getMyUpcomingTrainingClasses(trainerId);

       assertNotNull(result);
       assertEquals(1, result.size());
       assertEquals(futureClass, result.get(0));
   }

   //  getMyPastTrainingClasses() → Hämta träningspass tränaren tidigare har haft
   @Test
   public void testGetMyPastTrainingClasses() {
        Long trainerId = 1L;
        DayOfWeek pastDate = DayOfWeek.FRIDAY;

       // Mocka resultat från repository
       when(trainingClassRepository.findByTrainerIdAndTrainingDayBefore(trainerId, pastDate))
               .thenReturn(Arrays.asList(pastClass));

       List<TrainingClass> result = trainerService.getMyPastTrainingClasses(trainerId);

       assertNotNull(result);
       assertEquals(1, result.size());
       assertEquals(pastClass, result.get(0));
   }


     */
   //  getTrainingClassDetails(Long trainingClassId) → Hämta detaljer för ett specifikt träningspass (som tränaren håller)
   @Test
   public void testGetTrainingClassDetails() {
       // Mocka resultat från repository
       when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass));

       TrainingClass result = trainerService.getTrainingClassDetails(trainerId, trainingClassId);

       assertNotNull(result);
       assertEquals(trainingClass, result);
   }


    // Deltagarhantering:

   // getBookingsForMyTrainingClass(Long trainingClassId) → Hämta alla bokningar för ett av tränarens pass

    @Test
    void testGetBookingsForMyTrainingClass() {
        when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass));
        when(bookingRepository.findByTrainingClassId(trainingClassId)).thenReturn(List.of(booking));

        List<Booking> result = trainerService.getBookingsForMyTrainingClass(trainerId, trainingClassId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(member, result.get(0).getMember());
    }

    @Test
    void testGetBookingsForMyTrainingClass_TrainerHasNoAccess() {
        User anotherTrainer = new User();
        anotherTrainer.setId(3L);
        trainingClass.setTrainer(anotherTrainer);

        when(trainingClassRepository.findById(100L)).thenReturn(Optional.of(trainingClass));

        assertThrows(RuntimeException.class, () -> trainerService.getBookingsForMyTrainingClass(1L, 100L));
    }

   //  getMembersForMyTrainingClass(Long trainingClassId) → Hämta alla medlemmar som är bokade på tränarens pass
   @Test
   void testGetMembersForMyTrainingClass() {
       when(trainingClassRepository.findById(100L)).thenReturn(Optional.of(trainingClass));
       when(bookingRepository.findByTrainingClassId(100L)).thenReturn(List.of(booking));

       List<User> result = trainerService.getMembersForMyTrainingClass(1L, 100L);

       assertNotNull(result);
       assertEquals(1, result.size());
       assertEquals(member, result.get(0));
   }

   // removeMemberFromMyTrainingClass(Long trainingClassId, Long memberId) → Ta bort en medlem från ett pass tränaren håller (exempelvis vid överfull bokning eller missbruk)
   @Test
   void testRemoveMemberFromMyTrainingClass_NotTrainer() {
       User anotherTrainer = new User();
       anotherTrainer.setId(3L);
       trainingClass.setTrainer(anotherTrainer);

       when(trainingClassRepository.findById(100L)).thenReturn(Optional.of(trainingClass));

       assertThrows(RuntimeException.class, () -> trainerService.removeMemberFromMyTrainingClass(1L, 100L, 2L));
   }


    // Påminnelse och frånvaro:

   // sendReminderForUpcomingClass(Long trainingClassId) → Skicka en påminnelse till tränaren (och ev. deltagarna) om ett kommande pass
   @Test
   void testSendReminderForUpcomingClass() {
       when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass));

       trainerService.sendReminderForUpcomingClass(trainerId, trainingClassId);

       // Verifiera att tränaren får ett mail
       verify(emailService, times(1)).sendEmail(
               eq(trainer.getEmail()),
               eq("Påminnelse: " + trainingClass.getTitle()),
               contains("Ditt pass: '" + trainingClass.getTitle() + "' startar snart!")
       );
   }
    @Test
    void testSendReminderForUpcomingClass_TrainerHasNoAccess() {
        User anotherTrainer = new User();
        anotherTrainer.setId(3L);
        futureClass.setTrainer(anotherTrainer);

        when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(futureClass));

        assertThrows(RuntimeException.class, () -> trainerService.sendReminderForUpcomingClass(trainerId, trainingClassId));
    }

   // cancelMyTrainingClass(Long trainingClassId, String reason) → Ställ in ett träningspass om tränaren blir sjuk eller får förhinder
   @Test
   void testCancelMyTrainingClass() {
       Long trainingClassId = 1L;
       String reason = "Jag är sjuk";

       TrainingClass trainingClass = new TrainingClass();
       trainingClass.setTitle("Yoga");

       User trainer = new User();
       trainer.setEmail("trainer@example.com");
       trainingClass.setTrainer(trainer);

       User member = new User();
       member.setEmail("member@example.com");

       Booking booking = new Booking();
       booking.setMember(member);
       trainingClass.setBookings(List.of(booking));

       when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass));

       trainerService.cancelMyTrainingClass(trainingClassId, reason);

       // Verifiera att e-post skickas till tränaren
       verify(emailService, times(1)).sendEmail(
               eq("trainer@example.com"),
               eq("Träningspass inställt"),
               contains("Du har ställt in passet 'Yoga'.")
       );

       // Verifiera att e-post skickas till medlemmen
       verify(emailService, times(1)).sendEmail(
               eq("member@example.com"),
               eq("Träningspass inställt"),
               contains("Hej, ditt pass 'Yoga' har blivit inställt. Anledning: Jag är sjuk")
       );
   }


    @Test
    void testCancelMyTrainingClass_TrainerHasNoAccess() {
        String reason = "Jag är sjuk";
        User anotherTrainer = new User();
        anotherTrainer.setId(3L);
        futureClass.setTrainer(anotherTrainer);
        futureClass.setId(90L);

        when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(futureClass));

        assertThrows(RuntimeException.class, () -> trainerService.cancelMyTrainingClass(futureClass.getId(), reason));
    }

   // Statistik för tränarens pass:

   // getTrainingClassStats(Long trainingClassId) → Se statistik för ett av tränarens pass (t.ex. antal bokningar)
   // ✅ Testa att hämta statistik för ett specifikt pass
   @Test
   void testGetTrainingClassStats() {
       when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass));
       when(bookingRepository.countByTrainingClassId(trainingClassId)).thenReturn(5L);

       long antalBokningar = trainerService.getTrainingClassStats(trainerId, trainingClassId);

       assertEquals(5L, antalBokningar);
   }
    @Test
    void testGetTrainingClassStats_UnauthorizedTrainer() {
        trainingClass.getTrainer().setId(99L); // Annan tränare

        when(trainingClassRepository.findById(trainingClassId)).thenReturn(Optional.of(trainingClass));

        Exception exception = assertThrows(RuntimeException.class, () ->
                trainerService.getTrainingClassStats(trainerId, trainingClassId));

        assertEquals("Du har inte behörighet att se detta pass.", exception.getMessage());
    }

   // getMostPopularOfMyTrainingClasses() → Se vilket av tränarens pass som är mest bokat
   @Test
   void testGetMostPopularOfMyTrainingClasses() {
       when(trainingClassRepository.findMostPopularTrainingClassByTrainer(trainerId)).thenReturn(Optional.of(trainingClass));

       TrainingClass mostPopular = trainerService.getMostPopularOfMyTrainingClasses(trainerId);

       assertEquals(trainingClass, mostPopular);
   }

    // Testa om tränaren inte har några pass
    @Test
    void testGetMostPopularOfMyTrainingClasses_NoClasses() {
        when(trainingClassRepository.findMostPopularTrainingClassByTrainer(trainerId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () ->
                trainerService.getMostPopularOfMyTrainingClasses(trainerId));

        assertEquals("Inga träningspass hittades för denna tränare.", exception.getMessage());
    }
}
