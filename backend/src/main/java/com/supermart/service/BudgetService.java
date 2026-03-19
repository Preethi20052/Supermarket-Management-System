package com.supermart.service;

import com.supermart.model.*;
import com.supermart.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {
    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;

    public BudgetService(OrderRepository orderRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    public Double calculateMonthlySpending(String email) {
        List<Order> orders = orderRepo.findAll(); // In a real app, filter by email and date
        return orders.stream()
                .filter(o -> o.getEmail() != null && o.getEmail().equals(email))
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .mapToDouble(Order::getTotalPrice)
                .sum();
    }

    public List<Product> getCheaperAlternatives(Long productId) {
        Product currentProduct = productRepo.findById(productId).orElse(null);
        if (currentProduct == null)
            return List.of();

        return productRepo.findAll().stream()
                .filter(p -> p.getCategory() != null && p.getCategory().equals(currentProduct.getCategory()))
                .filter(p -> p.getPrice() < currentProduct.getPrice())
                .limit(3)
                .collect(Collectors.toList());
    }
}
