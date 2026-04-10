package com.jarnvilja.seeder;

import com.jarnvilja.model.*;
import com.jarnvilja.repository.BookingRepository;
import com.jarnvilja.repository.TrainingClassRepository;
import com.jarnvilja.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Slf4j
@Component
@Order(3)
public class BookingSeeder implements CommandLineRunner {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TrainingClassRepository trainingClassRepository;

    public BookingSeeder(BookingRepository bookingRepository, UserRepository userRepository, TrainingClassRepository trainingClassRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.trainingClassRepository = trainingClassRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (bookingRepository.count() > 0) {
            log.info("Bookings already exist, skipping seed");
            return;
        }

        List<User> members = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_MEMBER)
                .toList();
        List<TrainingClass> classes = trainingClassRepository.findAll();

        if (members.isEmpty() || classes.isEmpty()) {
            log.warn("No members or training classes found, skipping booking seed");
            return;
        }

        Random rand = new Random(42);
        BookingStatus[] statuses = { BookingStatus.CONFIRMED, BookingStatus.CONFIRMED, BookingStatus.CONFIRMED,
                BookingStatus.PENDING, BookingStatus.CANCELLED_BY_MEMBER, BookingStatus.EXPIRED };
        int count = 0;

        for (int i = 0; i < 20; i++) {
            User member = members.get(rand.nextInt(members.size()));
            TrainingClass tc = classes.get(rand.nextInt(classes.size()));
            LocalDate date = LocalDate.now().minusDays(rand.nextInt(14)).plusDays(rand.nextInt(7));

            if (bookingRepository.findByMemberIdAndTrainingClassIdAndBookingDate(
                    member.getId(), tc.getId(), date).isEmpty()) {
                Booking booking = new Booking();
                booking.setMember(member);
                booking.setTrainingClass(tc);
                booking.setBookingDate(date);
                booking.setBookingTimeStamp(LocalDateTime.now().minusDays(rand.nextInt(7)));
                booking.setBookingStatus(statuses[rand.nextInt(statuses.length)]);
                bookingRepository.save(booking);
                count++;
            }
        }

        log.info("Seeded {} bookings across {} members", count, members.size());
    }
}
