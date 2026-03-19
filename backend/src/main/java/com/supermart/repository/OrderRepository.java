package com.supermart.repository;

import com.supermart.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT COUNT(o) FROM Order o WHERE o.productId = :productId AND o.orderDate >= :since AND o.status <> 'CANCELLED'")
    long countSalesSince(@Param("productId") Long productId, @Param("since") LocalDateTime since);

    List<Order> findByUser_Id(Long userId);
}
