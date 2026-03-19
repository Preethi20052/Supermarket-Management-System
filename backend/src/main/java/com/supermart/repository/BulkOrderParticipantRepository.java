package com.supermart.repository;

import com.supermart.model.BulkOrderParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BulkOrderParticipantRepository extends JpaRepository<BulkOrderParticipant, Long> {
    List<BulkOrderParticipant> findByBulkOrderId(Long bulkOrderId);
    Optional<BulkOrderParticipant> findByBulkOrderIdAndUserId(Long bulkOrderId, Long userId);
}
