package com.supermart.repository;

import com.supermart.model.ClearanceBundle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClearanceBundleRepository extends JpaRepository<ClearanceBundle, Long> {
}
