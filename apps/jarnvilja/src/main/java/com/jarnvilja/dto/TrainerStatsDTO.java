package com.jarnvilja.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@Setter
public class TrainerStatsDTO {
    private int totalClasses;
    private int totalBookings;
    private String mostPopularDay;
    private Map<String, Integer> bookingsPerClass = new LinkedHashMap<>();
    private double avgAttendanceRate;
    private Map<String, Integer> weeklyAttendance = new LinkedHashMap<>();
}
