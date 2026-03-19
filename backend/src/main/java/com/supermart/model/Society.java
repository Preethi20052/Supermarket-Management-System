package com.supermart.model;

import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
public class Society {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
    private String city;
    private String pincode;

    @Column(unique = true)
    private String inviteCode;

    private Long createdBy;
    private java.time.LocalDateTime createdAt;

    // Existing fields for Bulk Ordering
    private String location;
    private Integer threshold; // Minimum quantity or items for discount
    private Double discountPercentage;
}
