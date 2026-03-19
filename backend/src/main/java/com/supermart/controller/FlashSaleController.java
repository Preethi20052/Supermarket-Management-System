package com.supermart.controller;

import com.supermart.model.FlashSale;
import com.supermart.model.Product;
import com.supermart.repository.FlashSaleRepository;
import com.supermart.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flash-sales")
@CrossOrigin(origins = "http://localhost:3001")
public class FlashSaleController {

    private final FlashSaleRepository flashSaleRepo;
    private final ProductRepository productRepo;

    public FlashSaleController(FlashSaleRepository flashSaleRepo, ProductRepository productRepo) {
        this.flashSaleRepo = flashSaleRepo;
        this.productRepo = productRepo;
    }

    @GetMapping
    public List<Map<String, Object>> getActiveFlashSales() {
        List<FlashSale> sales = flashSaleRepo.findAll();
        List<Map<String, Object>> response = new ArrayList<>();

        for (FlashSale sale : sales) {
            Product product = productRepo.findById(sale.getProductId()).orElse(null);
            if (product != null) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", sale.getId());
                item.put("product", product);
                item.put("discountPercentage", sale.getDiscountPercentage());
                item.put("endTime", sale.getEndTime());
                response.add(item);
            }
        }
        return response;
    }
}
