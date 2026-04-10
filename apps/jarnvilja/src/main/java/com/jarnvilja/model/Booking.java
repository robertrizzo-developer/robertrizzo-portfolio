package com.jarnvilja.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "bookings", uniqueConstraints = @UniqueConstraint(
        columnNames = {"member_id", "training_class_id", "booking_date"}
), indexes = {
        @Index(name = "idx_booking_date", columnList = "booking_date"),
        @Index(name = "idx_booking_member", columnList = "member_id")
})
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "member_id", nullable = false)
    private User member;

    @ManyToOne
    @JoinColumn(name = "training_class_id", nullable = false)
    private TrainingClass trainingClass;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus bookingStatus;

    @Column(nullable = false)
    private LocalDate bookingDate;

    private LocalDateTime bookingTimeStamp;

    @Column(name = "attended")
    private boolean attended = false;

    public Booking(User member, TrainingClass trainingClass) {
        this.member = member;
        this.trainingClass = trainingClass;
        this.bookingDate = LocalDate.now();
        this.bookingTimeStamp = LocalDateTime.now();
        this.bookingStatus = BookingStatus.PENDING;
    }

    public boolean isCancelledByMember() {
        return BookingStatus.CANCELLED_BY_MEMBER.equals(this.bookingStatus);
    }

    public boolean isExpired() {
        return bookingStatus == BookingStatus.PENDING
                && bookingTimeStamp != null
                && bookingTimeStamp.isBefore(LocalDateTime.now().minusMinutes(30));
    }
}
