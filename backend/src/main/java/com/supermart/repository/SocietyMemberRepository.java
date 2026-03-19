package com.supermart.repository;

import com.supermart.model.SocietyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SocietyMemberRepository extends JpaRepository<SocietyMember, Long> {
    Optional<SocietyMember> findByUserId(Long userId);

    List<SocietyMember> findBySocietyId(Long societyId);
}
