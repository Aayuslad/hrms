package com.aayush.lad.hrms.modules.engagement.dtos.read;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostImageResponse {

    private UUID id;
    
    private String docUrl;
}