package com.supermart.service;

import com.supermart.model.Order;
import com.supermart.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PredictionService {
    private final OrderRepository orderRepo;

    public PredictionService(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    public Map<Long, LocalDateTime> predictNextReorderDates(String email) {
        List<Order> orders = orderRepo.findAll().stream()
                .filter(o -> email.equals(o.getEmail()))
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .sorted(Comparator.comparing(Order::getOrderDate))
                .collect(Collectors.toList());

        Map<Long, List<LocalDateTime>> productOrderDates = new HashMap<>();
        for (Order o : orders) {
            productOrderDates.computeIfAbsent(o.getProductId(), k -> new ArrayList<>()).add(o.getOrderDate());
        }

        Map<Long, LocalDateTime> predictions = new HashMap<>();
        for (Map.Entry<Long, List<LocalDateTime>> entry : productOrderDates.entrySet()) {
            List<LocalDateTime> dates = entry.getValue();
            if (dates.size() < 2)
                continue;

            long totalDays = 0;
            for (int i = 1; i < dates.size(); i++) {
                totalDays += ChronoUnit.DAYS.between(dates.get(i - 1), dates.get(i));
            }
            long avgDays = totalDays / (dates.size() - 1);
            if (avgDays == 0)
                avgDays = 30; // Default gap if too frequent

            predictions.put(entry.getKey(), dates.get(dates.size() - 1).plusDays(avgDays));
        }

        return predictions;
    }
}
