package com.supermart.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BulkOrderResponseDTO {
    private Long id;
    private Long societyId;
    private Long productId;
    private String productName;
    private String productImage;
    private Double originalPrice;
    private Double discountPercentage;
    private Integer currentQuantity;
    private Integer targetQuantity;
    private String status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer participantsCount;
    private Integer userContribution; // how much the current user has contributed
}
