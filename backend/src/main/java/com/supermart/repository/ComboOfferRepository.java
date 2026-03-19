package com.supermart.repository;

import com.supermart.model.ComboOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComboOfferRepository extends JpaRepository<ComboOffer, Long> {
}
