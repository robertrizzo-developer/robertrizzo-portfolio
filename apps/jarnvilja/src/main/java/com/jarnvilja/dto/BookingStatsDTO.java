package com.jarnvilja.dto;


public class BookingStatsDTO {
    private long totalBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private long pendingBookings;
    private long cancelledBookingsByMember;
    private long expiredBookings;
    private String mostPopularClass;

    public BookingStatsDTO(long totalBookings, long confirmedBookings, long cancelledBookings, long pendingBookings, long cancelledBookingsByMember, long expiredBookings, String mostPopularClass) {
        this.totalBookings = totalBookings;
        this.confirmedBookings = confirmedBookings;
        this.cancelledBookings = cancelledBookings;
        this.pendingBookings = pendingBookings;
        this.cancelledBookingsByMember = cancelledBookingsByMember;
        this.expiredBookings = expiredBookings;
        this.mostPopularClass = mostPopularClass;
    }

    public long getTotalBookings() { return totalBookings; }
    public long getConfirmedBookings() { return confirmedBookings; }
    public long getCancelledBookings() { return cancelledBookings; }
    public long getPendingBookings() { return pendingBookings; }
    public long getCancelledBookingsByMember() { return cancelledBookingsByMember; }
    public long getExpiredBookings() { return expiredBookings; }
    public String getMostPopularClass() { return mostPopularClass; }

}
