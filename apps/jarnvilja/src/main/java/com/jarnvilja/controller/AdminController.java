package com.jarnvilja.controller;

import com.jarnvilja.dto.AdminDashboardStatsDTO;
import com.jarnvilja.dto.BookingStatsDTO;
import com.jarnvilja.dto.MemberStatsDTO;
import com.jarnvilja.dto.TrainingClassStatsDTO;
import com.jarnvilja.model.*;
import com.jarnvilja.model.EditableContent;
import com.jarnvilja.repository.BookingRepository;
import com.jarnvilja.repository.TrainingClassRepository;
import com.jarnvilja.service.AdminService;
import com.jarnvilja.service.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/adminPage")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final TrainingClassRepository trainingClassRepository;
    private final BookingRepository bookingRepository;
    private final ContentService contentService;

    @Autowired
    public AdminController(AdminService adminService, TrainingClassRepository trainingClassRepository,
                           BookingRepository bookingRepository, ContentService contentService) {
        this.adminService = adminService;
        this.trainingClassRepository = trainingClassRepository;
        this.bookingRepository = bookingRepository;
        this.contentService = contentService;
    }

    private static final int USERS_PAGE_SIZE = 20;
    private static final int BOOKINGS_PAGE_SIZE = 20;

    @GetMapping
    public String adminPage(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "username") String sortBy,
            @RequestParam(defaultValue = "month") String range,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "0") int bookingPage,
            Model model) {

        Map<Long, Long> bookingCounts = bookingRepository.findAll().stream()
                .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED)
                .collect(Collectors.groupingBy(b -> b.getMember().getId(), Collectors.counting()));

        Role roleEnum = null;
        if (role != null && !role.isBlank()) {
            try {
                roleEnum = Role.valueOf(role);
            } catch (IllegalArgumentException ignored) { }
        }

        Page<User> usersPage = adminService.getUsersPage(roleEnum, search, sortBy, page, USERS_PAGE_SIZE, bookingCounts);
        model.addAttribute("usersPage", usersPage);
        model.addAttribute("users", usersPage.getContent());
        model.addAttribute("bookingCounts", bookingCounts);
        model.addAttribute("selectedRole", role);
        model.addAttribute("searchQuery", search);
        model.addAttribute("sortBy", sortBy);
        model.addAttribute("selectedRange", range);
        model.addAttribute("currentPage", page);

        List<Booking> allBookings = adminService.getAllBookings();
        Page<Booking> bookingsPage = adminService.getBookingsPage(bookingPage, BOOKINGS_PAGE_SIZE);
        model.addAttribute("bookingsPage", bookingsPage);
        model.addAttribute("bookings", bookingsPage.getContent());
        model.addAttribute("currentBookingPage", bookingPage);

        String popularClass = allBookings.stream()
                .filter(b -> b.getTrainingClass() != null)
                .collect(Collectors.groupingBy(b -> b.getTrainingClass().getTitle(), Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("–");
        model.addAttribute("popularClass", popularClass);

        AdminDashboardStatsDTO dashStats = computeDashboardStats(allBookings, range);
        model.addAttribute("dashStats", dashStats);

        List<TrainingClass> trainingClasses = trainingClassRepository.findAll();
        model.addAttribute("trainingClasses", trainingClasses);

        List<EditableContent> editableContent = contentService.findAll();
        model.addAttribute("editableContent", editableContent);

        return "adminPage";
    }

    private AdminDashboardStatsDTO computeDashboardStats(List<Booking> bookings, String range) {
        AdminDashboardStatsDTO dto = new AdminDashboardStatsDTO();
        dto.setTotalBookings(bookings.size());

        long cancelled = bookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.CANCELLED).count();
        dto.setCancellationRate(bookings.isEmpty() ? 0 : (double) cancelled / bookings.size() * 100);

        Map<String, Long> byDay = new LinkedHashMap<>();
        String[] dayNames = {"Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"};
        for (String d : dayNames) byDay.put(d, 0L);

        Map<String, Long> byCat = new LinkedHashMap<>();

        LocalDate cutoff = switch (range) {
            case "week" -> LocalDate.now().minusWeeks(1);
            case "year" -> LocalDate.now().minusYears(1);
            default -> LocalDate.now().minusMonths(1);
        };

        Map<String, Long> overTime = new TreeMap<>();

        for (Booking b : bookings) {
            if (b.getBookingDate() == null || b.getBookingDate().isBefore(cutoff)) continue;
            if (b.getTrainingClass() == null) continue;

            DayOfWeek dow = b.getTrainingClass().getTrainingDay();
            if (dow != null) {
                String dayLabel = dow.getDisplayName(TextStyle.FULL, new Locale("sv", "SE"));
                dayLabel = dayLabel.substring(0, 1).toUpperCase() + dayLabel.substring(1);
                byDay.merge(dayLabel, 1L, Long::sum);
            }

            if (b.getTrainingClass().getCategory() != null) {
                byCat.merge(b.getTrainingClass().getCategory().name(), 1L, Long::sum);
            }

            if ("week".equals(range)) {
                overTime.merge(b.getBookingDate().toString(), 1L, Long::sum);
            } else {
                String monthKey = b.getBookingDate().getYear() + "-" +
                        String.format("%02d", b.getBookingDate().getMonthValue());
                overTime.merge(monthKey, 1L, Long::sum);
            }
        }

        dto.setBookingsByDay(byDay);
        dto.setBookingsByCategory(byCat);
        dto.setBookingsOverTime(overTime);

        byDay.entrySet().stream().max(Map.Entry.comparingByValue())
                .ifPresent(e -> dto.setBusiestDay(e.getKey()));
        byCat.entrySet().stream().max(Map.Entry.comparingByValue())
                .ifPresent(e -> dto.setMostPopularClass(e.getKey()));

        return dto;
    }

    // --- Training Class CRUD ---

    @GetMapping("/classes/new")
    public String newClassForm(Model model) {
        model.addAttribute("trainingClass", new TrainingClass());
        model.addAttribute("trainers", adminService.getAllTrainers());
        model.addAttribute("categories", TrainingCategory.values());
        model.addAttribute("mattas", Matta.values());
        model.addAttribute("daysOfWeek", DayOfWeek.values());
        model.addAttribute("isEdit", false);
        return "adminClassForm";
    }

    @PostMapping("/classes")
    public String createClass(@ModelAttribute TrainingClass trainingClass,
                              @RequestParam(required = false) Long trainerId,
                              RedirectAttributes redirectAttributes) {
        if (trainerId != null) {
            User trainer = adminService.getUserById(trainerId);
            trainingClass.setTrainer(trainer);
        }
        if (trainingClass.getStatus() == null) {
            trainingClass.setStatus(ClassStatus.ACTIVE);
        }
        trainingClassRepository.save(trainingClass);
        redirectAttributes.addFlashAttribute("successMessage", "Träningspasset har skapats!");
        return "redirect:/adminPage";
    }

    @GetMapping("/classes/{id}/edit")
    public String editClassForm(@PathVariable Long id, Model model) {
        TrainingClass tc = trainingClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training class not found"));
        model.addAttribute("trainingClass", tc);
        model.addAttribute("trainers", adminService.getAllTrainers());
        model.addAttribute("categories", TrainingCategory.values());
        model.addAttribute("mattas", Matta.values());
        model.addAttribute("daysOfWeek", DayOfWeek.values());
        model.addAttribute("isEdit", true);
        return "adminClassForm";
    }

    @PostMapping("/classes/{id}")
    public String updateClass(@PathVariable Long id,
                              @ModelAttribute TrainingClass updatedClass,
                              @RequestParam(required = false) Long trainerId,
                              RedirectAttributes redirectAttributes) {
        TrainingClass existing = trainingClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training class not found"));
        existing.setTitle(updatedClass.getTitle());
        existing.setDescription(updatedClass.getDescription());
        existing.setTrainingDay(updatedClass.getTrainingDay());
        existing.setMatta(updatedClass.getMatta());
        existing.setStartTime(updatedClass.getStartTime());
        existing.setEndTime(updatedClass.getEndTime());
        existing.setCategory(updatedClass.getCategory());
        existing.setMaxCapacity(updatedClass.getMaxCapacity());
        existing.setStatus(updatedClass.getStatus() != null ? updatedClass.getStatus() : ClassStatus.ACTIVE);
        if (trainerId != null) {
            User trainer = adminService.getUserById(trainerId);
            existing.setTrainer(trainer);
        } else {
            existing.setTrainer(null);
        }
        trainingClassRepository.save(existing);
        redirectAttributes.addFlashAttribute("successMessage", "Träningspasset har uppdaterats!");
        return "redirect:/adminPage";
    }

    @PostMapping("/classes/{id}/delete")
    public String deleteClass(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        trainingClassRepository.deleteById(id);
        redirectAttributes.addFlashAttribute("successMessage", "Träningspasset har tagits bort!");
        return "redirect:/adminPage";
    }

    // --- Existing endpoints ---

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = adminService.createUser(user);
        if (createdUser == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
       return adminService.deleteUser(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserId(@PathVariable Long id) {
        User user = adminService.getUserById(id);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable Role role) {
        List<User> users = adminService.getUsersByRole(role);

        if (users.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }


    @PatchMapping("/{id}/role")
    public ResponseEntity<User> assignRoleToUser (@PathVariable Long id, @RequestBody Role role) {
        User updatedUser  = adminService.assignRoleToUser (id, role);
        if (updatedUser  == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updatedUser , HttpStatus.OK);
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<User> resetUserPassword(@PathVariable Long id, @RequestBody String newPassword) {
        User updatedUser = adminService.resetUserPassword(id, newPassword);

        if (updatedUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updatedUser , HttpStatus.OK);
    }

    @PostMapping("/classes/{classId}/trainer/{trainerId}")
    public ResponseEntity<TrainingClass> assignTrainerToClass(@PathVariable Long classId, @PathVariable Long trainerId) {
        TrainingClass updatedTrainingClass = adminService.assignTrainerToClass(classId, trainerId);
        if (updatedTrainingClass == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updatedTrainingClass, HttpStatus.OK);
    }

    @DeleteMapping("/classes/{classId}/trainer/{trainerId}")
    public ResponseEntity<String> removeTrainerFromClass(@PathVariable Long classId, @PathVariable Long trainerId) {
        String result = adminService.removeTrainerFromClass(classId, trainerId);

        if (result.contains("not found")) {
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        } else if (result.contains("removed")) {
            return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/classes/{classId}/trainer")
    public ResponseEntity<User> getTrainerFromClass(@PathVariable Long classId) {
        Optional<User> trainerOpt = adminService.getTrainerFromClass(classId);

        if (trainerOpt.isPresent()) {
            return new ResponseEntity<>(trainerOpt.get(), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/content")
    public RedirectView saveContent(@RequestParam Map<String, String> allParams, RedirectAttributes redirectAttributes) {
        for (Map.Entry<String, String> e : allParams.entrySet()) {
            if (e.getKey() != null && e.getKey().startsWith("value_")) {
                String contentKey = e.getKey().substring("value_".length());
                String value = e.getValue() != null ? e.getValue() : "";
                contentService.save(contentKey, value);
            }
        }
        redirectAttributes.addFlashAttribute("successMessage", "Innehållet har sparats.");
        return new RedirectView("/adminPage#content-section");
    }

    @GetMapping("/trainers")
    public ResponseEntity<List<User>> getAllTrainers() {
        List<User> trainers = adminService.getAllTrainers();
        return new ResponseEntity<>(trainers, HttpStatus.OK);
    }



    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = adminService.getAllBookings();
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }


    @PostMapping("/deleteBooking/{bookingId}")
    public RedirectView deleteBooking(@PathVariable Long bookingId, @RequestParam("_method") String method) {
        if ("delete".equalsIgnoreCase(method)) {
            String result = adminService.deleteBooking(bookingId);

            if (result.contains("not found")) {
                return new RedirectView("/adminPage?error=notfound");
            }

            return new RedirectView("/adminPage?success=deleted");
        }

        return new RedirectView("/adminPage?error=methodnotallowed");
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        try {
            Booking booking = adminService.getBookingById(id);
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @PatchMapping("/classes/{trainingClassId}/bookings")
    public ResponseEntity<List<Booking>> cancelAllBookingsForClass(@PathVariable Long trainingClassId) {
        List<Booking> cancelledBookings = adminService.cancelAllBookingsForClass(trainingClassId);
        return new ResponseEntity<>(cancelledBookings, HttpStatus.OK);
    }


    @GetMapping("/bookings/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable BookingStatus status) {
        List<Booking> bookings = adminService.getBookingsByStatus(status);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }


    @DeleteMapping("/bookings/expired")
    public ResponseEntity<String> removeExpiredBookings() {
        adminService.removeExpiredBookings();
        return new ResponseEntity<>("Expired bookings removed", HttpStatus.OK);
    }

    @GetMapping("/booking-stats")
    public ResponseEntity<BookingStatsDTO> getBookingStats() {
        try {
            BookingStatsDTO stats = adminService.getBookingStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<MemberStatsDTO> getMemberStats() {
        try {
            MemberStatsDTO stats = adminService.getMemberStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/classes/{classId}/bookings/total")
    public ResponseEntity<Long> getTotalBookingsForClass(@PathVariable Long classId) {
        try {
            Long totalBookings = Long.valueOf(adminService.getTotalBookingsForClass(classId));
            return ResponseEntity.ok(totalBookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/period")
    public ResponseEntity<List<Booking>> getBookingsByPeriod(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<Booking> bookings = adminService.getBookingsByPeriod(startDate, endDate);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/{memberId}/bookings")
    public ResponseEntity<List<Booking>> getAllBookingsForMember(@PathVariable Long memberId) {
        try {
            List<Booking> bookings = adminService.getAllBookingsForMember(memberId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/classes/stats")
    public ResponseEntity<List<TrainingClassStatsDTO>> getClassStats() {
        try {
            Map<String, Long> classStatsMap = adminService.getClassStats();
            List<TrainingClassStatsDTO> classStats = classStatsMap.entrySet().stream()
                    .map(entry -> new TrainingClassStatsDTO(Long.valueOf(entry.getKey()), entry.getValue().intValue()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(classStats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/editUser/{id}")
    public String editUser (@PathVariable Long id, Model model) {
        User user = adminService.getUserById(id);
        if (user == null) {
            return "error";
        }
            model.addAttribute("user", user);
            return "editUser";
        }

    @PostMapping("/editUser/{id}")
    public String updateUser (@PathVariable Long id, @ModelAttribute User user) {
        adminService.updateUser (id, user);
        return "redirect:/adminPage";
    }
}
