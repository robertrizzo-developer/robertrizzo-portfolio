package com.jarnvilja.controller;

import com.jarnvilja.dto.TrainerStatsDTO;
import com.jarnvilja.model.*;
import com.jarnvilja.repository.TrainingClassRepository;
import com.jarnvilja.repository.UserRepository;
import com.jarnvilja.service.DemoGuard;
import com.jarnvilja.service.TrainerService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.WeekFields;
import java.util.*;

@Controller
@RequestMapping("/trainerPage")
public class TrainerPageController {

    private final UserRepository userRepository;
    private final TrainingClassRepository trainingClassRepository;
    private final TrainerService trainerService;
    private final DemoGuard demoGuard;

    public TrainerPageController(UserRepository userRepository, TrainingClassRepository trainingClassRepository,
                                 TrainerService trainerService, DemoGuard demoGuard) {
        this.userRepository = userRepository;
        this.trainingClassRepository = trainingClassRepository;
        this.trainerService = trainerService;
        this.demoGuard = demoGuard;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_TRAINER')")
    public String trainerPage(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        User trainer = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        List<TrainingClass> classes = trainingClassRepository.findByTrainerId(trainer.getId());

        Map<Long, Integer> bookingsPerClass = new LinkedHashMap<>();
        long totalBookings = 0;
        long totalAttended = 0;
        long totalConfirmed = 0;

        Map<DayOfWeek, Integer> bookingsByDay = new EnumMap<>(DayOfWeek.class);
        Map<String, Integer> weeklyAttendance = new LinkedHashMap<>();

        for (TrainingClass tc : classes) {
            int activeBookings = 0;
            if (tc.getBookings() != null) {
                for (var b : tc.getBookings()) {
                    if (b.getBookingStatus() == BookingStatus.CONFIRMED) {
                        activeBookings++;
                        totalConfirmed++;
                        if (b.isAttended()) {
                            totalAttended++;
                        }
                        if (b.getBookingDate() != null) {
                            LocalDate bd = b.getBookingDate();
                            int week = bd.get(WeekFields.ISO.weekOfYear());
                            String key = "v" + week;
                            weeklyAttendance.merge(key, 1, Integer::sum);
                        }
                    }
                }
            }
            bookingsPerClass.put(tc.getId(), activeBookings);
            totalBookings += activeBookings;
            bookingsByDay.merge(tc.getTrainingDay(), activeBookings, Integer::sum);
        }

        TrainerStatsDTO stats = new TrainerStatsDTO();
        stats.setTotalClasses(classes.size());
        stats.setTotalBookings((int) totalBookings);
        stats.setAvgAttendanceRate(totalConfirmed > 0 ? (double) totalAttended / totalConfirmed * 100 : 0);

        String mostPopularDay = bookingsByDay.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(e -> swedishDay(e.getKey()))
                .orElse("–");
        stats.setMostPopularDay(mostPopularDay);

        for (TrainingClass tc : classes) {
            stats.getBookingsPerClass().put(tc.getTitle(),
                    bookingsPerClass.getOrDefault(tc.getId(), 0));
        }

        TreeMap<String, Integer> sortedWeekly = new TreeMap<>(weeklyAttendance);
        stats.setWeeklyAttendance(sortedWeekly);

        model.addAttribute("trainer", trainer);
        model.addAttribute("classes", classes);
        model.addAttribute("totalBookings", totalBookings);
        model.addAttribute("bookingsPerClass", bookingsPerClass);
        model.addAttribute("stats", stats);

        return "trainerPage";
    }

    @GetMapping("/classes/{id}/edit")
    @PreAuthorize("hasAuthority('ROLE_TRAINER')")
    public String editClassForm(@PathVariable Long id, Model model,
                                @AuthenticationPrincipal UserDetails userDetails) {
        User trainer = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        TrainingClass tc = trainingClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        if (!tc.getTrainer().getId().equals(trainer.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        model.addAttribute("trainingClass", tc);
        return "trainerClassEdit";
    }

    @PostMapping("/classes/{id}")
    @PreAuthorize("hasAuthority('ROLE_TRAINER')")
    public String updateClass(@PathVariable Long id,
                              @RequestParam String description,
                              @RequestParam String startTime,
                              @RequestParam String endTime,
                              @RequestParam int maxCapacity,
                              @AuthenticationPrincipal UserDetails userDetails,
                              RedirectAttributes redirectAttributes) {
        User trainer = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        TrainingClass tc = trainingClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        if (!tc.getTrainer().getId().equals(trainer.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (demoGuard.isDemoUser()) {
            redirectAttributes.addFlashAttribute("successMessage", "Demo: Ändringarna sparades (simulerat).");
            return "redirect:/trainerPage";
        }

        tc.setDescription(description);
        tc.setStartTime(LocalTime.parse(startTime));
        tc.setEndTime(LocalTime.parse(endTime));
        tc.setMaxCapacity(maxCapacity);
        trainingClassRepository.save(tc);

        redirectAttributes.addFlashAttribute("successMessage", "Passet har uppdaterats.");
        return "redirect:/trainerPage";
    }

    @PostMapping("/classes/{id}/cancel")
    @PreAuthorize("hasAuthority('ROLE_TRAINER')")
    public String cancelClass(@PathVariable Long id,
                              @RequestParam(defaultValue = "Inställt av tränare") String reason,
                              @AuthenticationPrincipal UserDetails userDetails,
                              RedirectAttributes redirectAttributes) {
        User trainer = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        TrainingClass tc = trainingClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        if (!tc.getTrainer().getId().equals(trainer.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (demoGuard.isDemoUser()) {
            int memberCount = tc.getBookings() != null ?
                    (int) tc.getBookings().stream().filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED).count() : 0;
            redirectAttributes.addFlashAttribute("successMessage",
                    "Demo: Passet markerat som inställt (" + memberCount + " medlemmar hade meddelats).");
            return "redirect:/trainerPage";
        }

        int memberCount = 0;
        if (tc.getBookings() != null) {
            memberCount = (int) tc.getBookings().stream()
                    .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED).count();
        }
        trainerService.cancelMyTrainingClass(id, reason);
        redirectAttributes.addFlashAttribute("successMessage",
                "Passet är inställt. " + memberCount + " medlemmar har meddelats via e-post.");
        return "redirect:/trainerPage";
    }

    private String swedishDay(DayOfWeek day) {
        return switch (day) {
            case MONDAY -> "Måndag";
            case TUESDAY -> "Tisdag";
            case WEDNESDAY -> "Onsdag";
            case THURSDAY -> "Torsdag";
            case FRIDAY -> "Fredag";
            case SATURDAY -> "Lördag";
            case SUNDAY -> "Söndag";
        };
    }
}
