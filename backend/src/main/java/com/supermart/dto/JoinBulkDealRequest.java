package com.supermart.dto;

import lombok.Data;

@Data
public class JoinBulkDealRequest {
    private Long bulkOrderId;
    private Integer quantity;
}
