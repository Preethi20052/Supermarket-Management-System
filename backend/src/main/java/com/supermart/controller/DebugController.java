package com.supermart.controller;

import com.supermart.service.ExpiryScheduler;
import com.supermart.model.Product;
import com.supermart.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    private final ExpiryScheduler expiryScheduler;
    private final ProductRepository productRepo;

    public DebugController(ExpiryScheduler expiryScheduler, ProductRepository productRepo) {
        this.expiryScheduler = expiryScheduler;
        this.productRepo = productRepo;
    }

    @PostMapping("/trigger-flash-sales")
    public String triggerFlashSales() {
        expiryScheduler.checkNearExpiryProducts();
        return "Flash sale check triggered!";
    }

    @PostMapping("/seed-near-expiry")
    public String seedNearExpiry() {
        List<Product> products = productRepo.findAll();
        if (products.isEmpty())
            return "No products to update";

        Product p = products.get(0);
        p.setExpiryDate(LocalDate.now().plusDays(3));
        productRepo.save(p);

        expiryScheduler.checkNearExpiryProducts();
        return "Updated product " + p.getName() + " to expire in 3 days and triggered flash sale!";
    }
}
