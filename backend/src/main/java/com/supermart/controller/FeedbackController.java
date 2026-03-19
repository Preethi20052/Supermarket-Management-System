package com.supermart.controller;

import com.supermart.model.ProductFeedback;
import com.supermart.model.User;
import com.supermart.repository.ProductFeedbackRepository;
import com.supermart.repository.UserRepository;
import com.supermart.service.SentimentService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3001")
public class FeedbackController {

    private final ProductFeedbackRepository feedbackRepo;
    private final SentimentService sentimentService;
    private final UserRepository userRepo;

    public FeedbackController(ProductFeedbackRepository feedbackRepo, SentimentService sentimentService,
            UserRepository userRepo) {
        this.feedbackRepo = feedbackRepo;
        this.sentimentService = sentimentService;
        this.userRepo = userRepo;
    }

    @PostMapping
    public ProductFeedback submitFeedback(@RequestBody Map<String, Object> payload) {
        ProductFeedback feedback = new ProductFeedback();
        feedback.setProductId(Long.valueOf(payload.get("productId").toString()));
        feedback.setUserId(Long.valueOf(payload.get("userId").toString()));
        feedback.setRating(Integer.parseInt(payload.get("rating").toString()));
        feedback.setComment(payload.get("comment").toString());
        feedback.setSentiment(sentimentService.analyzeSentiment(feedback.getComment()));
        feedback.setCreatedAt(LocalDateTime.now());
        return feedbackRepo.save(feedback);
    }

    @GetMapping("/product/{productId}")
    public List<ProductFeedback> getProductFeedback(@PathVariable Long productId) {
        return feedbackRepo.findByProductId(productId);
    }

    @GetMapping("/unhappy-customers")
    public List<Map<String, Object>> getUnhappyCustomers() {
        List<ProductFeedback> allFeedback = feedbackRepo.findAll();
        Map<Long, Long> negativeCounts = allFeedback.stream()
                .filter(f -> "NEGATIVE".equals(f.getSentiment()))
                .collect(Collectors.groupingBy(ProductFeedback::getUserId, Collectors.counting()));

        return negativeCounts.entrySet().stream()
                .filter(e -> e.getValue() >= 3)
                .map(e -> {
                    User user = userRepo.findById(e.getKey()).orElse(null);
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("userId", e.getKey());
                    map.put("userName", user != null ? user.getName() : "Unknown");
                    map.put("negativeCount", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }
}
