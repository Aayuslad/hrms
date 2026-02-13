package com.aayush.lad.hrms.core.services;

import lombok.Getter;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.Map;

@Service
public class DateService {

    @Getter
    private static final String START_DATE_KEY = "startDate";
    @Getter
    private static final String END_DATE_KEY = "endDate";

    // TODO: test this function peroperly, in edge cases when week is shorter etc.
    /**
     * Calculates the start and end dates of the current week based on custom start and end days.
     *
     * @param startDay The desired start day of the week (e.g., DayOfWeek.MONDAY).
     * @param endDay   The desired end day of the week (e.g., DayOfWeek.SUNDAY).
     * @return A Map containing the start and end dates. with keys "endDate" and "startDate"
     */
    public Map<String, LocalDate> getCurrentWeekDateRange(DayOfWeek startDay, DayOfWeek endDay) {
        LocalDate today = LocalDate.now();

        // previousOrSame adjusts the date to the previous occurrence of the startDay, or today if it is the startDay.
        LocalDate startDate = today.with(TemporalAdjusters.previousOrSame(startDay));

        // nextOrSame adjusts the date to the next occurrence of the endDay, or today if it is the endDay.
        LocalDate endDate = today.with(TemporalAdjusters.nextOrSame(endDay));

        Map<String, LocalDate> dateRange = new HashMap<>();
        dateRange.put(START_DATE_KEY, startDate);
        dateRange.put(END_DATE_KEY, endDate);

        return dateRange;
    }
}
