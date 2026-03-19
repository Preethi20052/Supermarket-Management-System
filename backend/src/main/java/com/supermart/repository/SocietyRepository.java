package com.supermart.repository;

import com.supermart.model.Society;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SocietyRepository extends JpaRepository<Society, Long> {
    Optional<Society> findByInviteCode(String inviteCode);

    boolean existsByNameAndPincode(String name, String pincode);
}
