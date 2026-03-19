package com.supermart.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateBulkOrderRequest {
    private Long productId;
    private Long societyId;
    private Integer targetQuantity;
    private Double discountPercentage;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
