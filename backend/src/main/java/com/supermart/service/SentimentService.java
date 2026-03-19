package com.supermart.service;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;

@Service
public class SentimentService {

    private final List<String> positiveKeywords = Arrays.asList("good", "great", "excellent", "nice", "love", "perfect",
            "amazing", "best", "happy");
    private final List<String> negativeKeywords = Arrays.asList("bad", "poor", "worst", "broken", "slow", "delay",
            "expensive", "rude", "unhappy", "disappointed", "hate");

    public String analyzeSentiment(String comment) {
        if (comment == null || comment.trim().isEmpty()) {
            return "NEUTRAL";
        }

        String lowerComment = comment.toLowerCase();
        long positiveCount = positiveKeywords.stream().filter(lowerComment::contains).count();
        long negativeCount = negativeKeywords.stream().filter(lowerComment::contains).count();

        if (positiveCount > negativeCount) {
            return "POSITIVE";
        } else if (negativeCount > positiveCount) {
            return "NEGATIVE";
        } else {
            return "NEUTRAL";
        }
    }
}
