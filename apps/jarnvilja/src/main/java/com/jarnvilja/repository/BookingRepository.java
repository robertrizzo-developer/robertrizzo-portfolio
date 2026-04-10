package com.jarnvilja.repository;

import com.jarnvilja.model.Booking;
import com.jarnvilja.model.BookingStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    long countByBookingStatus(BookingStatus status);

    @Query("SELECT b.trainingClass.title FROM Booking b GROUP BY b.trainingClass.title ORDER BY COUNT(b.id) DESC LIMIT 1")
    String findMostPopularClass();

    @Query("SELECT COUNT(DISTINCT b.member.id) FROM Booking b")
    long countActiveMembers();

    @Query("SELECT b.member.id FROM Booking b GROUP BY b.member.id ORDER BY COUNT(b.id) DESC LIMIT 1")
    Long findMostActiveMemberId();

    @Query("SELECT COUNT(b.id) FROM Booking b WHERE b.trainingClass.id = :classId")
    Long countBookingsForClass(@Param("classId") Long classId);

    @Query("SELECT b FROM Booking b WHERE b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findBookingsByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT b FROM Booking b WHERE b.member.id = :memberId")
    List<Booking> findBookingsByMemberId(@Param("memberId") Long memberId);

    @Query("SELECT b.trainingClass.title, COUNT(b.id) FROM Booking b GROUP BY b.trainingClass.title")
    List<Object[]> getClassStats();

    List<Booking> findByMemberIdAndTrainingClassIdAndBookingDate(Long userId, Long trainingClassId, LocalDate bookingDay);

    List<Booking> findByTrainingClassId(long trainingClassId);

    List<Booking> findByBookingStatus(BookingStatus status);

    @EntityGraph(attributePaths = {"trainingClass", "member"})
    List<Booking> findByMemberId(Long memberId);

    void deleteByTrainingClassId(Long trainingClassId);

    Optional<Booking> findByTrainingClassIdAndMemberId(Long classId, Long memberId);

    @Query("SELECT b FROM Booking b WHERE b.bookingStatus = 'PENDING' AND b.bookingTimeStamp < :threshold")
    List<Booking> findPendingBookingsBefore(@Param("threshold") LocalDateTime threshold);

    @Query("SELECT b FROM Booking b WHERE b.member.id = :memberId AND b.bookingDate >= :today")
    List<Booking> findUpcomingBookingsForMember(@Param("memberId") Long memberId, @Param("today") LocalDate today);

    @Query("SELECT b FROM Booking b WHERE b.member.id = :memberId AND b.bookingDate < :today")
    List<Booking> findPastBookingsForMember(@Param("memberId") Long memberId, @Param("today") LocalDate today);

    long countByTrainingClassId(Long trainingClassId);

    long countByTrainingClassIdAndBookingDateAndBookingStatusIn(
            Long trainingClassId, LocalDate bookingDate, List<BookingStatus> statuses);

}
