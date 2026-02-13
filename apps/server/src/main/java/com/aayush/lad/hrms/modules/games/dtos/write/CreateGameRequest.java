package com.aayush.lad.hrms.modules.games.dtos.write;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateGameRequest {

    @NotBlank(message = "Name can not be empty")
    private String name;

    @NotNull(message = "slot duration can not be null")
    @Min(value = 10, message = "Minimum slot duration should be 10 minutes")
    private int slotDuration;

    @NotNull(message = "maximum slot players can not be null")
    @Min(value = 1, message = "Minimum slot players should be 1")
    private int maxSlotPlayers;

    @NotNull(message = "Open time can not be empty")
    private LocalTime openTime;

    @NotNull(message = "Close time can not be empty")
    private LocalTime closeTime;

    @NotNull(message = "Opening day of week can not be empty")
//    @Pattern(regexp = "^(SUNDAY|MONDAY)$", message = "Only SUNDAY and MONDAY are allowed as closing day")
    private DayOfWeek openingDayOfWeek;

    @NotNull(message = "Closing day of week can not be empty")
//    @Pattern(regexp = "^(FRIDAY|SATURDAY)$", message = "Only FRIDAY and SATURDAY are allowed as closing day")
    private DayOfWeek closingDayOfWeek;
}
