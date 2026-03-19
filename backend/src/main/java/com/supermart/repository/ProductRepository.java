
// package com.supermart.repository;

// import org.springframework.data.jpa.repository.JpaRepository;
// import com.supermart.model.Product;

// public interface ProductRepository extends JpaRepository<Product, Long> {
// }

package com.supermart.repository;

import com.supermart.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
