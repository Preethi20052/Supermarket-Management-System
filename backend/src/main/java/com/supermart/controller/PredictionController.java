package com.supermart.controller;

import com.supermart.service.PredictionService;
import com.supermart.model.Product;
import com.supermart.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "http://localhost:3001")
public class PredictionController {
    private final PredictionService predictionService;
    private final ProductRepository productRepo;

    public PredictionController(PredictionService predictionService, ProductRepository productRepo) {
        this.predictionService = predictionService;
        this.productRepo = productRepo;
    }

    @GetMapping
    public List<Map<String, Object>> getReorderPredictions(@RequestParam String email) {
        Map<Long, LocalDateTime> predictions = predictionService.predictNextReorderDates(email);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Map.Entry<Long, LocalDateTime> entry : predictions.entrySet()) {
            Product product = productRepo.findById(entry.getKey()).orElse(null);
            if (product != null) {
                Map<String, Object> item = new HashMap<>();
                item.put("productId", product.getId());
                item.put("productName", product.getName());
                item.put("imageUrl", product.getImageUrl());
                item.put("predictedDate", entry.getValue());
                item.put("daysRemaining",
                        java.time.temporal.ChronoUnit.DAYS.between(LocalDateTime.now(), entry.getValue()));
                result.add(item);
            }
        }
        return result;
    }
}
