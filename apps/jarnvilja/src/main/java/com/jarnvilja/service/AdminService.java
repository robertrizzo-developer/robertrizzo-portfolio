package com.jarnvilja.service;

import com.jarnvilja.dto.BookingStatsDTO;
import com.jarnvilja.dto.MemberStatsDTO;
import com.jarnvilja.model.*;
import com.jarnvilja.repository.BookingRepository;
import com.jarnvilja.repository.TrainingClassRepository;
import com.jarnvilja.repository.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TrainingClassRepository trainingClassRepository;
    private final BookingRepository bookingRepository;

    public AdminService(UserRepository userRepository, PasswordEncoder passwordEncoder, TrainingClassRepository trainingClassRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.trainingClassRepository = trainingClassRepository;
        this.bookingRepository = bookingRepository;
    }


    // Hantera användare

    @Transactional
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User updatedUser) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existingUser = user.get();
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setPassword(updatedUser.getPassword());
            existingUser.setRole(updatedUser.getRole());
            return userRepository.save(existingUser);
        }
        return null;
    }


    @Transactional
    public String deleteUser(Long id) {
        userRepository.deleteById(id);
        return "User " + id + " deleted";
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findUsersByRole(role);
    }

    /**
     * Paginated user list with optional role and username search. Sort by "bookings" is done in-memory.
     */
    public Page<User> getUsersPage(Role role, String search, String sortBy, int page, int size,
                                   Map<Long, Long> bookingCounts) {
        Pageable pageable;
        String sortField = "username";
        boolean descending = false;
        if (!"bookings".equals(sortBy)) {
            switch (sortBy != null ? sortBy : "username") {
                case "role" -> { sortField = "role"; }
                case "email" -> { sortField = "email"; }
                case "createdAt" -> { sortField = "createdAt"; descending = true; }
                default -> { sortField = "username"; }
            }
            Sort sort = descending ? Sort.by(sortField).descending() : Sort.by(sortField).ascending();
            pageable = PageRequest.of(page, size, sort);
        } else {
            pageable = PageRequest.of(page, size);
        }

        Page<User> usersPage;
        boolean hasRole = role != null && !role.name().isEmpty();
        boolean hasSearch = search != null && !search.isBlank();

        if (hasRole && hasSearch) {
            usersPage = userRepository.findUsersByRoleAndUsernameContainingIgnoreCase(role, search.trim(), pageable);
        } else if (hasRole) {
            usersPage = userRepository.findUsersByRole(role, pageable);
        } else if (hasSearch) {
            usersPage = userRepository.findByUsernameContainingIgnoreCase(search.trim(), pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }

        if ("bookings".equals(sortBy)) {
            List<User> allFiltered;
            if (hasRole && hasSearch) {
                allFiltered = userRepository.findUsersByRoleAndUsernameContainingIgnoreCase(role, search.trim(), Pageable.unpaged()).getContent();
            } else if (hasRole) {
                allFiltered = userRepository.findUsersByRole(role, Pageable.unpaged()).getContent();
            } else if (hasSearch) {
                allFiltered = userRepository.findByUsernameContainingIgnoreCase(search.trim(), Pageable.unpaged()).getContent();
            } else {
                allFiltered = userRepository.findAll();
            }
            allFiltered.sort(Comparator.comparingLong((User u) -> bookingCounts.getOrDefault(u.getId(), 0L)).reversed());
            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), allFiltered.size());
            List<User> pageContent = start >= allFiltered.size() ? List.of() : allFiltered.subList(start, end);
            return new PageImpl<>(pageContent, pageable, allFiltered.size());
        }

        return usersPage;
    }

    public Page<Booking> getBookingsPage(int page, int size) {
        return bookingRepository.findAll(PageRequest.of(page, size));
    }

    @Transactional
    public User assignRoleToUser(Long id, Role role) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setRole(role);
            return userRepository.save(user);
        }
        return null;
    }

    @Transactional
    public User resetUserPassword(Long id, String newPassword) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            return userRepository.save(user);
        }
        return null;
    }




    // Hantera tränare

    @Transactional
    public TrainingClass assignTrainerToClass(Long classId, Long trainerId) {
        TrainingClass trainingClass = trainingClassRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Training class not found"));

        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        trainingClass.setTrainer(trainer);  // Sätter en ny tränare istället för att lägga till i en lista

        return trainingClassRepository.save(trainingClass);  // Sparar uppdateringen
    }


    @Transactional
    public String removeTrainerFromClass(Long classId, Long trainerId) {
        Optional<TrainingClass> trainingClassOpt = trainingClassRepository.findById(classId);

        if (trainingClassOpt.isPresent()) {
            TrainingClass trainingClass = trainingClassOpt.get();

            if (trainingClass.getTrainer() != null && trainingClass.getTrainer().getId().equals(trainerId)) {
                trainingClass.setTrainer(null);  // Ta bort tränaren genom att sätta den till null
                trainingClassRepository.save(trainingClass);
                return "Trainer " + trainerId + " removed from the class: " + trainingClass.getTitle();
            } else {
                return "Trainer " + trainerId + " is not assigned to this class.";
            }
        }
        return "Training class not found.";
    }


    public Optional<User> getTrainerFromClass(Long classId) {
        Optional<TrainingClass> trainingClassOpt = trainingClassRepository.findById(classId);
        if (trainingClassOpt.isPresent()) {
            User trainer = trainingClassOpt.get().getTrainer();
            return Optional.ofNullable(trainer);
        }
        return Optional.empty();
    }

    public List<User> getAllTrainers() {
        return userRepository.findUsersByRole(Role.ROLE_TRAINER);
    }



    // Hantera Bokningar
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional
    public String deleteBooking(Long bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            bookingRepository.deleteById(bookingId);
            return "Booking " + bookingId + " deleted";
        }
        return "Booking " + bookingId + " not found";
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @Transactional
    public List<Booking> cancelAllBookingsForClass(Long trainingClassId) {
        List<Booking> bookings = bookingRepository.findByTrainingClassId(trainingClassId);

        for (Booking booking : bookings) {
            booking.setBookingStatus(BookingStatus.CANCELLED);
        }
        return bookingRepository.saveAll(bookings);
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
         return bookingRepository.findByBookingStatus(status);
    }

    @Transactional
    public void removeExpiredBookings() {
        List<Booking> allBookings = bookingRepository.findAll();  // Hämta alla bokningar
        List<Booking> expiredBookings = allBookings.stream()
                .filter(Booking::isExpired)  // Filtrera ut bokningar som är expired
                .collect(Collectors.toList());

        if (!expiredBookings.isEmpty()) {
            bookingRepository.deleteAll(expiredBookings);  // Ta bort de utlöpta bokningarna
        }
    }



    public BookingStatsDTO getBookingStats() {
        long totalBookings = bookingRepository.count();
        long confirmedBookings = bookingRepository.countByBookingStatus(BookingStatus.CONFIRMED);
        long cancelledBookings = bookingRepository.countByBookingStatus(BookingStatus.CANCELLED);
        long pendingBookings = bookingRepository.countByBookingStatus(BookingStatus.PENDING);
        long cancelledBookingsByMember = bookingRepository.countByBookingStatus((BookingStatus.CANCELLED_BY_MEMBER));
        long expiredBookings = bookingRepository.countByBookingStatus(BookingStatus.EXPIRED);
        String mostPopularClass = bookingRepository.findMostPopularClass();

        return new BookingStatsDTO(totalBookings, confirmedBookings, cancelledBookings, pendingBookings, cancelledBookingsByMember, expiredBookings, mostPopularClass);
    }

    public MemberStatsDTO getMemberStats() {
        long totalMembers = userRepository.count();
        long activeMembers = bookingRepository.countActiveMembers();
        long inactiveMembers = totalMembers - activeMembers;
        long mostActiveMemberId = bookingRepository.findMostActiveMemberId();

        return new MemberStatsDTO(totalMembers, activeMembers, inactiveMembers, mostActiveMemberId);
    }

    public String getTotalBookingsForClass(Long classId) {
        Long count = bookingRepository.countBookingsForClass(classId);
        return "Total bookings for class " + classId + ": " + count;
    }

    public List<Booking> getBookingsByPeriod(LocalDate startDate, LocalDate endDate) {
        return bookingRepository.findBookingsByDateBetween(startDate, endDate);
    }

    public List<Booking> getAllBookingsForMember(Long memberId) {
        return bookingRepository.findBookingsByMemberId(memberId);
    }

    public Map<String, Long> getClassStats() {
        List<Object[]> results = bookingRepository.getClassStats();
        Map<String, Long> classStats = new HashMap<>();

        for (Object[] result : results) {
            classStats.put((String) result[0], (Long) result[1]);
        }
        return classStats;
    }
}

