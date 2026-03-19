package com.supermart.service;

import com.supermart.model.FlashSale;
import com.supermart.model.Product;
import com.supermart.repository.FlashSaleRepository;
import com.supermart.repository.ProductRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpiryScheduler {

    private final ProductRepository productRepo;
    private final FlashSaleRepository flashSaleRepo;

    public ExpiryScheduler(ProductRepository productRepo, FlashSaleRepository flashSaleRepo) {
        this.productRepo = productRepo;
        this.flashSaleRepo = flashSaleRepo;
    }

    // Runs every midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void checkNearExpiryProducts() {
        LocalDate fiveDaysFromNow = LocalDate.now().plusDays(5);
        List<Product> products = productRepo.findAll();

        for (Product product : products) {
            if (product.getExpiryDate() != null && product.getExpiryDate().isBefore(fiveDaysFromNow)) {
                createFlashSale(product);
            }
        }
    }

    private void createFlashSale(Product product) {
        if (flashSaleRepo.findByProductId(product.getId()).isPresent()) {
            return; // Already has a flash sale
        }

        long daysRemaining = product.getExpiryDate().toEpochDay() - LocalDate.now().toEpochDay();
        double discount = 20.0;
        if (daysRemaining < 2) {
            discount = 50.0;
        }

        FlashSale flashSale = new FlashSale();
        flashSale.setProductId(product.getId());
        flashSale.setDiscountPercentage(discount);
        flashSale.setStartTime(LocalDateTime.now());
        flashSale.setEndTime(product.getExpiryDate().atStartOfDay());

        flashSaleRepo.save(flashSale);
        System.out.println("Auto Flash Sale created for: " + product.getName() + " with " + discount + "% discount");
    }
}
