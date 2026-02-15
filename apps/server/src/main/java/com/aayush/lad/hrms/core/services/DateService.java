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

    public Map<String, LocalDate> getCurrentWeekDateRange(DayOfWeek startDay, DayOfWeek endDay) {
        LocalDate today = LocalDate.now();

        // Step 1: Find start of current custom week
        LocalDate startDate = today.with(TemporalAdjusters.previousOrSame(startDay));

        // Step 2: Calculate how many days from startDay to endDay
        int startValue = startDay.getValue(); // 1 (Mon) - 7 (Sun)
        int endValue = endDay.getValue();

        int daysBetween;

        if (endValue >= startValue) {
            daysBetween = endValue - startValue;
        } else {
            // Handles wrap-around case like THURSDAY -> TUESDAY
            daysBetween = 7 - (startValue - endValue);
        }

        LocalDate endDate = startDate.plusDays(daysBetween);

        Map<String, LocalDate> dateRange = new HashMap<>();
        dateRange.put(START_DATE_KEY, startDate);
        dateRange.put(END_DATE_KEY, endDate);

        return dateRange;
    }
}
