package com.supermart.repository;

import com.supermart.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser_Id(Long userId);

    void deleteByUser_Id(Long userId);
}
