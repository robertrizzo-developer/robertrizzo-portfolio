package com.jarnvilja.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = "bookings")
@Entity
@Table(name = "training_classes", indexes = {
        @Index(name = "idx_training_day", columnList = "trainingDay")
})
public class TrainingClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    private DayOfWeek trainingDay;

    @Enumerated(EnumType.STRING)
    private Matta matta;

    private LocalTime startTime;
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private TrainingCategory category;

    @Column(name = "max_capacity")
    private int maxCapacity = 20;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private User trainer;

    @Enumerated(EnumType.STRING)
    private ClassStatus status = ClassStatus.ACTIVE;

    @OneToMany(mappedBy = "trainingClass", cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();

    public TrainingClass(String title, String description, DayOfWeek trainingDay, Matta matta, LocalTime startTime, LocalTime endTime) {
        this.title = title;
        this.description = description;
        this.trainingDay = trainingDay;
        this.matta = matta;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
