package com.jarnvilja.dto;

public class MemberStatsDTO {
    private long totalMembers;
    private long activeMembers;
    private long inactiveMembers;
    private long mostActiveMemberId;

    public MemberStatsDTO(long totalMembers, long activeMembers, long inactiveMembers, long mostActiveMemberId) {
        this.totalMembers = totalMembers;
        this.activeMembers = activeMembers;
        this.inactiveMembers = inactiveMembers;
        this.mostActiveMemberId = mostActiveMemberId;
    }

    public long getTotalMembers() { return totalMembers; }
    public long getActiveMembers() { return activeMembers; }
    public long getInactiveMembers() { return inactiveMembers; }
    public long getMostActiveMemberId() { return mostActiveMemberId; }
}
