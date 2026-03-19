package com.supermart.repository;

import com.supermart.model.ProductFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductFeedbackRepository extends JpaRepository<ProductFeedback, Long> {
    List<ProductFeedback> findByProductId(Long productId);

    List<ProductFeedback> findByUserId(Long userId);
}
