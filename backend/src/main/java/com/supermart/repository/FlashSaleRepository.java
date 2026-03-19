package com.supermart.repository;

import com.supermart.model.FlashSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FlashSaleRepository extends JpaRepository<FlashSale, Long> {
    Optional<FlashSale> findByProductId(Long productId);
}
