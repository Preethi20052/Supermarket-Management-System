package com.supermart.model;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
public class BulkOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long societyId;
    private Long productId;
    private Integer currentQuantity;
    private Integer targetQuantity; // Same as society threshold or product specific
    private String status; // UPCOMING, ACTIVE, COMPLETED, EXPIRED
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double discountPercentage;
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
