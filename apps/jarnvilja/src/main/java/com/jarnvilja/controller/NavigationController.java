package com.jarnvilja.controller;

import com.jarnvilja.model.TrainingClass;
import com.jarnvilja.repository.TrainingClassRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

@Controller
public class NavigationController {

    private final TrainingClassRepository trainingClassRepository;

    public NavigationController(TrainingClassRepository trainingClassRepository) {
        this.trainingClassRepository = trainingClassRepository;
    }

    @GetMapping("/index")
    public String showHomePage() {
        return "index";
    }

    @GetMapping("/kontakt")
    public String showContactPage() {
        return "kontakt";
    }

    @GetMapping("/om_klubben")
    public String showAboutPage() {
        return "om_klubben";
    }

    @GetMapping("/traningsschema")
    public String showTrainingSchedulePage(Model model) {
        List<TrainingClass> allClasses = trainingClassRepository.findAll();
        Map<DayOfWeek, List<TrainingClass>> byDay = allClasses.stream()
                .collect(Collectors.groupingBy(TrainingClass::getTrainingDay));

        List<DayOfWeek> orderedDays = List.of(
                DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY);

        LinkedHashMap<DayOfWeek, List<TrainingClass>> orderedSchedule = new LinkedHashMap<>();
        for (DayOfWeek day : orderedDays) {
            List<TrainingClass> dayClasses = byDay.getOrDefault(day, Collections.emptyList());
            dayClasses.sort(Comparator.comparing(TrainingClass::getStartTime));
            orderedSchedule.put(day, dayClasses);
        }

        model.addAttribute("scheduleByDay", orderedSchedule);
        return "traningsschema";
    }

    @GetMapping("/tranare")
    public String showTrainersPage() {
        return "tranare";
    }

    @GetMapping("/bli_medlem")
    public String showJoinUsPage() {
        return "bli_medlem";
    }

    @GetMapping("/faq")
    public String showFAQPage() {
        return "faq";
    }

    @GetMapping("/integritetspolicy")
    public String showPrivacyPolicyPage() {
        return "integritetspolicy";
    }

    @GetMapping("/om_projektet")
    public String showAboutProjectPage() {
        return "om_projektet";
    }

    @GetMapping("/login")
    public String showLoginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String showRegisterPage() {
        return "register";
    }
}
