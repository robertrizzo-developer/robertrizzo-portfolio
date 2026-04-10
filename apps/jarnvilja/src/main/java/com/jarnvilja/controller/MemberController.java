package com.jarnvilja.controller;

import com.jarnvilja.dto.MemberProfileDTO;
import com.jarnvilja.dto.MembershipStatsDTO;
import com.jarnvilja.model.*;
import com.jarnvilja.service.BookingService;
import com.jarnvilja.service.DemoGuard;
import com.jarnvilja.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/memberPage")
public class MemberController {

    private final MemberService memberService;
    private final BookingService bookingService;
    private final PasswordEncoder passwordEncoder;
    private final DemoGuard demoGuard;

    @Autowired
    public MemberController(MemberService memberService, BookingService bookingService,
                            PasswordEncoder passwordEncoder, DemoGuard demoGuard) {
        this.memberService = memberService;
        this.bookingService = bookingService;
        this.passwordEncoder = passwordEncoder;
        this.demoGuard = demoGuard;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_MEMBER')")
    public String memberPage(Model model,
                             @AuthenticationPrincipal UserDetails userDetails,
                             @RequestParam(required = false) String search,
                             @RequestParam(required = false) String sort,
                             @RequestParam(required = false, defaultValue = "false") boolean reset) {
        String username = userDetails.getUsername();
        User member = memberService.getMemberByUsername(username);

        model.addAttribute("member", member);
        model.addAttribute("memberId", member.getId());
        model.addAttribute("username", username);

        List<TrainingClass> trainingClasses = memberService.getAvailableClasses();

        if (!reset) {
            if (search != null && !search.isEmpty()) {
                trainingClasses = memberService.searchAvailableClasses(search);
            }
            if (sort != null) {
                trainingClasses = memberService.sortClasses(trainingClasses, sort);
            }
        }

        model.addAttribute("search", search);
        model.addAttribute("trainingClasses", trainingClasses);
        model.addAttribute("matta1Pass", trainingClasses.stream()
                .filter(tc -> tc.getMatta() == Matta.MATTA_1).collect(Collectors.toList()));
        model.addAttribute("matta2Pass", trainingClasses.stream()
                .filter(tc -> tc.getMatta() == Matta.MATTA_2).collect(Collectors.toList()));

        List<Booking> bookings = memberService.getBookingsForMember(member.getId());
        List<Booking> activeBookings = bookings.stream()
                .filter(b -> !b.getBookingStatus().equals(BookingStatus.CANCELLED))
                .collect(Collectors.toList());
        model.addAttribute("bookings", activeBookings);

        List<Booking> upcomingBookings = memberService.getUpcomingBookingsForMember(member.getId());
        List<Booking> pastBookings = memberService.getPastBookingsForMember(member.getId());
        model.addAttribute("upcomingBookings", upcomingBookings);
        model.addAttribute("pastBookings", pastBookings);

        model.addAttribute("daysOfWeek", DayOfWeek.values());

        Map<Long, Integer> capacityUsed = new HashMap<>();
        LocalDate today = LocalDate.now();
        for (TrainingClass tc : trainingClasses) {
            capacityUsed.put(tc.getId(), bookingService.getConfirmedCountForClassOnDate(tc.getId(), today));
        }
        model.addAttribute("capacityUsed", capacityUsed);

        MembershipStatsDTO stats = memberService.getMembershipStats(member.getId());
        model.addAttribute("stats", stats);

        model.addAttribute("onboarding", member.isDemo());

        return "memberPage";
    }

    @GetMapping("/me")
    @ResponseBody
    @PreAuthorize("hasAuthority('ROLE_MEMBER')")
    public ResponseEntity<MemberProfileDTO> getCurrentMember(@AuthenticationPrincipal UserDetails userDetails) {
        User member = memberService.getMemberByUsername(userDetails.getUsername());
        return ResponseEntity.ok(new MemberProfileDTO(
                member.getId(), member.getUsername(), member.getEmail(),
                member.getFirstName(), member.getLastName(),
                member.getRole() != null ? member.getRole().name() : "ROLE_MEMBER",
                member.isProfileVisible(), member.getCreatedAt(), member.isDemo()));
    }

    @PostMapping("/register")
    public ResponseEntity<User> createMember(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User createdUser  = memberService.createMember(user);
        return new ResponseEntity<>(createdUser , HttpStatus.CREATED);
    }

    @PutMapping("/{memberId}")
    public ResponseEntity<User> updateMember(@PathVariable Long memberId, @RequestBody User user) {
        User updatedUser  = memberService.updateMember(memberId, user);
        return new ResponseEntity<>(updatedUser , HttpStatus.OK);
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long memberId) {
        memberService.deleteMember(memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<User> getMemberById(@PathVariable Long memberId) {
        Optional<User> user = Optional.ofNullable(memberService.getMemberById(memberId));
        return user.map(ResponseEntity::ok) // Om medlemmen finns, returnera 200 OK med medlemmen
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND)); // Annars returnera 404 NOT FOUND
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllMembers() {
        List<User> members = memberService.getAllMembers();
        return new ResponseEntity<>(members, HttpStatus.OK);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getMemberByEmail(@PathVariable String email) {
        Optional<User> user = Optional.ofNullable(memberService.getMemberByEmail(email));
        return user.map(ResponseEntity::ok) // Om medlemmen finns, returnera 200 OK med medlemmen
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND)); // Annars returnera 404 NOT FOUND
    }

    @PatchMapping("/{memberId}/password")
    public ResponseEntity<User> updateMemberPassword(@PathVariable Long memberId, @RequestBody String newPassword) {
        User updatedUser  = memberService.updateMemberPassword(memberId, newPassword);
        return new ResponseEntity<>(updatedUser , HttpStatus.OK);
    }

    @PostMapping("/{memberId}/bookings")
    public String createBooking(@PathVariable Long memberId, @RequestParam Long trainingClassId, Model model, RedirectAttributes redirectAttributes) {
        // Kontrollera bokningsstatus
        String bookingMessage = memberService.checkBookingStatus(memberId, trainingClassId);

        if (bookingMessage != null) {
            // Om användaren redan har bokat passet, skicka meddelandet via RedirectAttributes
            redirectAttributes.addFlashAttribute("bookingMessage", bookingMessage);
            return "redirect:/memberPage";  // Omdirigera till medlemssidan med meddelandet
        }

        try {
            memberService.createBooking(memberId, trainingClassId);
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("bookingMessage", e.getMessage());
            return "redirect:/memberPage";
        }

        return "redirect:/memberPage";
    }

    @PatchMapping("/bookings/{bookingId}/confirm")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Long bookingId) {
        Booking confirmedBooking = memberService.confirmBooking(bookingId);
        return new ResponseEntity<>(confirmedBooking, HttpStatus.OK);
    }

    @PostMapping("/bookings/{bookingId}")
    public RedirectView cancelBooking(@PathVariable Long bookingId, @RequestParam("_method") String method) {
        if ("delete".equalsIgnoreCase(method)) {
            memberService.cancelBooking(bookingId);
            return new RedirectView("/memberPage");
        }
        return new RedirectView("/error"); // Omdirigera till en fel-sida om metoden inte är DELETE
    }

    @GetMapping("/{userId}/bookings")
    public ResponseEntity<List<Booking>> getBookingsForMember(@PathVariable Long userId) {
        List<Booking> bookings = memberService.getBookingsForMember(userId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/{userId}/bookings/upcoming")
    public ResponseEntity<List<Booking>> getUpcomingBookingsForMember(@PathVariable Long userId) {
        List<Booking> upcomingBookings = memberService.getUpcomingBookingsForMember(userId);
        return new ResponseEntity<>(upcomingBookings, HttpStatus.OK);
    }

    @GetMapping("/{userId}/bookings/past")
    public ResponseEntity<List<Booking>> getPastBookingsForMember(@PathVariable Long userId) {
        List<Booking> pastBookings = memberService.getPastBookingsForMember(userId);
        return new ResponseEntity<>(pastBookings, HttpStatus.OK);
    }

    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long bookingId) {
        Booking booking = memberService.getBookingById(bookingId);
        return new ResponseEntity<>(booking, HttpStatus.OK);
    }

    @GetMapping("/available-classes")
    public ResponseEntity<List<TrainingClass>> getAvailableClasses() {
        List<TrainingClass> availableClasses = memberService.getAvailableClasses();
        return new ResponseEntity<>(availableClasses, HttpStatus.OK);
    }

    @GetMapping("/{memberId}/classes")
    public ResponseEntity<List<TrainingClass>> getAllClassesForMember(@PathVariable Long memberId) {
        List<TrainingClass> memberClasses = memberService.getAllClassesForMember(memberId);
        return new ResponseEntity<>(memberClasses, HttpStatus.OK);
    }


    @GetMapping("/{memberId}/profile")
    public ResponseEntity<MemberProfileDTO> getMemberProfile(@PathVariable Long memberId) {
        MemberProfileDTO memberProfile = memberService.getMemberProfile(memberId);
        return new ResponseEntity<>(memberProfile, HttpStatus.OK);
    }

    @GetMapping("/{memberId}/stats")
    public ResponseEntity<MembershipStatsDTO> getMembershipStats(@PathVariable Long memberId) {
        MembershipStatsDTO membershipStats = memberService.getMembershipStats(memberId);
        return new ResponseEntity<>(membershipStats, HttpStatus.OK);
    }

    @PostMapping("/bookings/cancel-all")
    @PreAuthorize("hasAuthority('ROLE_MEMBER')")
    public String cancelAllBookings(@AuthenticationPrincipal UserDetails userDetails,
                                    RedirectAttributes redirectAttributes) {
        User member = memberService.getMemberByUsername(userDetails.getUsername());
        if (demoGuard.isDemoUser()) {
            redirectAttributes.addFlashAttribute("successMessage", "Demo: Alla bokningar avbokade (simulerat).");
            return "redirect:/memberPage";
        }
        bookingService.cancelAllBookingsForMember(member.getId());
        redirectAttributes.addFlashAttribute("successMessage", "Alla bokningar har avbokats.");
        return "redirect:/memberPage";
    }

    @PostMapping("/profile/update")
    @PreAuthorize("hasAuthority('ROLE_MEMBER')")
    public String updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                @RequestParam String email,
                                RedirectAttributes redirectAttributes) {
        User member = memberService.getMemberByUsername(userDetails.getUsername());
        User updated = new User();
        updated.setUsername(member.getUsername());
        updated.setEmail(email);
        memberService.updateMember(member.getId(), updated);
        redirectAttributes.addFlashAttribute("successMessage", "Profil uppdaterad!");
        return "redirect:/memberPage";
    }

    @PostMapping("/profile/password")
    @PreAuthorize("hasAuthority('ROLE_MEMBER')")
    public String changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                 @RequestParam String currentPassword,
                                 @RequestParam String newPassword,
                                 RedirectAttributes redirectAttributes) {
        User member = memberService.getMemberByUsername(userDetails.getUsername());
        if (!passwordEncoder.matches(currentPassword, member.getPassword())) {
            redirectAttributes.addFlashAttribute("errorMessage", "Nuvarande lösenord är felaktigt.");
            return "redirect:/memberPage";
        }
        memberService.updateMemberPassword(member.getId(), newPassword);
        redirectAttributes.addFlashAttribute("successMessage", "Lösenord ändrat!");
        return "redirect:/memberPage";
    }

    @PostMapping("/profile/visibility")
    @PreAuthorize("hasAuthority('ROLE_MEMBER')")
    public String toggleVisibility(@AuthenticationPrincipal UserDetails userDetails,
                                   RedirectAttributes redirectAttributes) {
        User member = memberService.getMemberByUsername(userDetails.getUsername());
        member.setProfileVisible(!member.isProfileVisible());
        memberService.updateMember(member.getId(), member);
        redirectAttributes.addFlashAttribute("successMessage",
                member.isProfileVisible() ? "Profil synlig" : "Profil dold");
        return "redirect:/memberPage";
    }
}


