package com.supermart.dto;

import lombok.Data;

@Data
public class UpdateBulkDealRequest {
    private Long bulkOrderId;
    private Integer quantity;
}
