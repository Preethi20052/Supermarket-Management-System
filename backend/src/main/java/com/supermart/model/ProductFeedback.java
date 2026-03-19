package com.supermart.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class ProductFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private Long userId;
    private int rating; // 1-5

    @Column(length = 1000)
    private String comment;

    private String sentiment; // POSITIVE, NEUTRAL, NEGATIVE
    private LocalDateTime createdAt;
}
