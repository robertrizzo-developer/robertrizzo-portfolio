package com.jarnvilja.dto;

import java.util.Objects;

public class TrainingClassStatsDTO {
    private Long trainingClassId;
    private int bookingCount;

    public TrainingClassStatsDTO(Long trainingClassId, int bookingCount) {
        this.trainingClassId = trainingClassId;
        this.bookingCount = bookingCount;
    }

    public Long getTrainingClassId() {
        return trainingClassId;
    }

    public int getBookingCount() {
        return bookingCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true; // Kontrollera om de är samma instans
        if (!(o instanceof TrainingClassStatsDTO)) return false; // Kontrollera typ
        TrainingClassStatsDTO that = (TrainingClassStatsDTO) o; // Typa om
        return bookingCount == that.bookingCount && // Jämför bookingCount
                Objects.equals(trainingClassId, that.trainingClassId); // Jämför trainingClassId
    }

    @Override
    public int hashCode() {
        return Objects.hash(trainingClassId, bookingCount); // Generera hashkod
    }
}