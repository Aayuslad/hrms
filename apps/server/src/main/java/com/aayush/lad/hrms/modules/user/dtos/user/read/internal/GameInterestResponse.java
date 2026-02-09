package com.aayush.lad.hrms.modules.user.dtos.user.read.internal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameInterestResponse {

    private UUID id;

    private String name;
}
