package com.jarnvilja.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@Setter
public class MembershipStatsDTO {

    private Long memberId;
    private int totalBookings;
    private String mostBookedClass;
    private LocalDate memberSince;
    private double avgSessionsPerWeek;
    private int currentStreak;
    private Map<String, Integer> categoryBreakdown = new LinkedHashMap<>();
    private Map<String, Integer> monthlyTrend = new LinkedHashMap<>();

    public MembershipStatsDTO(Long memberId, int totalBookings, String mostBookedClass, LocalDate memberSince) {
        this.memberId = memberId;
        this.totalBookings = totalBookings;
        this.mostBookedClass = mostBookedClass;
        this.memberSince = memberSince;
    }
}
