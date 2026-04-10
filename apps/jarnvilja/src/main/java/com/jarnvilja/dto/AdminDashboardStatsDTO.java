package com.jarnvilja.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@Setter
public class AdminDashboardStatsDTO {
    private long totalBookings;
    private long newMembers;
    private double cancellationRate;
    private String mostPopularClass;
    private String busiestDay;
    private Map<String, Long> bookingsByDay = new LinkedHashMap<>();
    private Map<String, Long> bookingsByCategory = new LinkedHashMap<>();
    private Map<String, Long> bookingsOverTime = new LinkedHashMap<>();
}
