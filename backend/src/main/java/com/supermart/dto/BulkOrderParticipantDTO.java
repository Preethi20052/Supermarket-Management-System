package com.supermart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BulkOrderParticipantDTO {
    private String userName;
    private String flatNumber;
    private Integer quantityJoined;
    private LocalDateTime timeJoined;
}
