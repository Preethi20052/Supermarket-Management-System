package com.supermart.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "society_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocietyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long societyId;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime joinedAt;

    public enum Role {
        SOCIETY_ADMIN, MEMBER
    }

    public enum Status {
        APPROVED, PENDING
    }
}
