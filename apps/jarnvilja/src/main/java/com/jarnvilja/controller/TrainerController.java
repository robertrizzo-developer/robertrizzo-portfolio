package com.jarnvilja.controller;
import com.jarnvilja.dto.TrainingClassStatsDTO;
import com.jarnvilja.model.Booking;
import com.jarnvilja.model.TrainingClass;
import com.jarnvilja.model.User;
import com.jarnvilja.service.TrainerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/trainer")
@PreAuthorize("hasAuthority('ROLE_TRAINER')")
public class TrainerController {

    private final TrainerService trainerService;

    public TrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
    }

    @GetMapping("/{trainerId}/classes/{trainingClassId}")
    public ResponseEntity<TrainingClass> getTrainingClassDetails(@PathVariable Long trainerId, @PathVariable Long trainingClassId) {
        TrainingClass trainingClass = trainerService.getTrainingClassDetails(trainerId, trainingClassId);
        return new ResponseEntity<>(trainingClass, HttpStatus.OK);
    }


    @GetMapping("/{trainerId}/classes/{trainingClassId}/bookings")
    public ResponseEntity<List<Booking>> getBookingsForMyTrainingClass(@PathVariable Long trainerId, @PathVariable Long trainingClassId) {
        List<Booking> bookings = trainerService.getBookingsForMyTrainingClass(trainerId, trainingClassId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/{trainerId}/classes/{trainingClassId}/members")
    public ResponseEntity<List<User>> getMembersForMyTrainingClass(@PathVariable Long trainerId, @PathVariable Long trainingClassId) {
        List<User> members = trainerService.getMembersForMyTrainingClass(trainerId, trainingClassId);
        return new ResponseEntity<>(members, HttpStatus.OK);
    }

    @DeleteMapping("/{trainerId}/classes/{trainingClassId}/members/{memberId}")
    public ResponseEntity<Void> removeMemberFromMyTrainingClass(@PathVariable Long trainerId,
                                                                @PathVariable Long trainingClassId,
                                                                @PathVariable Long memberId) {
        trainerService.removeMemberFromMyTrainingClass(trainerId, trainingClassId, memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Returnera 204 No Content
    }

    @PostMapping("/{trainerId}/classes/{trainingClassId}/reminder")
    public ResponseEntity<Void> sendReminderForUpcomingClass(@PathVariable Long trainerId,
                                                             @PathVariable Long trainingClassId) {
        trainerService.sendReminderForUpcomingClass(trainerId, trainingClassId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Returnera 204 No Content
    }


    @DeleteMapping("/classes/{trainingClassId}")
    public ResponseEntity<Void> cancelMyTrainingClass(@PathVariable Long trainingClassId,
                                                      @RequestParam String reason) {
        trainerService.cancelMyTrainingClass(trainingClassId, reason);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Returnera 204 No Content
    }

    @GetMapping("/{trainerId}/classes/{trainingClassId}/stats")
    public ResponseEntity<TrainingClassStatsDTO> getTrainingClassStats(@PathVariable Long trainerId,
                                                                       @PathVariable Long trainingClassId) {
        // Hämta antalet bokningar från service
        long bookingCount = trainerService.getTrainingClassStats(trainerId, trainingClassId);

        // Skapa en DTO med träningspassets ID och antalet bokningar
        TrainingClassStatsDTO stats = new TrainingClassStatsDTO(trainingClassId, (int) bookingCount);

        // Returnera DTO:n med status 200 OK
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    @GetMapping("/{trainerId}/classes/popular")
    public ResponseEntity<TrainingClass> getMostPopularOfMyTrainingClasses(@PathVariable Long trainerId) {
        TrainingClass popularClass = trainerService.getMostPopularOfMyTrainingClasses(trainerId);
        return new ResponseEntity<>(popularClass, HttpStatus.OK);
    }

}
