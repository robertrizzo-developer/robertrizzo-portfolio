package com.jarnvilja.dto;

import com.jarnvilja.model.Booking;

public class BookingDTO {
    private Long id;
    private String trainingTitle;
    private String username;

    public BookingDTO(Booking booking) {
        this.id = booking.getId();
        this.trainingTitle = booking.getTrainingClass().getTitle();
        this.username = booking.getMember().getUsername();
    }

    // getters
    public Long getId() { return id; }
    public String getTrainingTitle() { return trainingTitle; }
    public String getUsername() { return username; }

}

