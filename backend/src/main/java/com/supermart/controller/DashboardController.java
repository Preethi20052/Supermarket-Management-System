package com.supermart.controller;

import com.supermart.model.DashboardStats;
import com.supermart.model.Notification;
import com.supermart.model.Order;
import com.supermart.model.Product;
import com.supermart.repository.NotificationRepository;
import com.supermart.repository.OrderRepository;
import com.supermart.repository.ProductRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/stats")
@CrossOrigin(origins = "http://localhost:3001")
public class DashboardController {

        private final OrderRepository orderRepo;
        private final ProductRepository productRepo;
        private final NotificationRepository notificationRepo;

        public DashboardController(OrderRepository orderRepo, ProductRepository productRepo,
                        NotificationRepository notificationRepo) {
                this.orderRepo = orderRepo;
                this.productRepo = productRepo;
                this.notificationRepo = notificationRepo;
        }

        @GetMapping
        public DashboardStats getStats() {
                List<Order> orders = orderRepo.findAll();
                List<Product> products = productRepo.findAll();

                long totalOrders = orders.size();
                double totalRevenue = orders.stream()
                                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                                .mapToDouble(Order::getTotalPrice)
                                .sum();

                long totalProducts = products.size();
                long lowStockProducts = products.stream()
                                .filter(p -> p.getStock() < 5)
                                .count();

                // ✅ ADVANCED ANALYTICS: Fast & Slow Moving
                LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
                LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);

                List<Product> fastMoving = products.stream()
                                .filter(p -> orderRepo.countSalesSince(p.getId(), sevenDaysAgo) > 20)
                                .collect(Collectors.toList());

                List<Product> slowMoving = products.stream()
                                .filter(p -> orderRepo.countSalesSince(p.getId(), thirtyDaysAgo) == 0)
                                .collect(Collectors.toList());

                // ✅ EXPIRY CHECK: Notify admin if expires within 10 days
                LocalDate tenDaysFromNow = LocalDate.now().plusDays(10);
                for (Product p : products) {
                        if (p.getExpiryDate() != null && p.getExpiryDate().isBefore(tenDaysFromNow)) {
                                String message = "Expiry Warning: " + p.getName() + " expires on " + p.getExpiryDate();
                                // Check if an unread notification already exists with the same message
                                boolean exists = notificationRepo.findAll().stream()
                                                .anyMatch(n -> !n.isRead() && n.getMessage().equals(message));

                                if (!exists) {
                                        notificationRepo.save(new Notification(message, "EXPIRY"));
                                }
                        }
                }

                long urgentNotifications = notificationRepo.findByIsReadFalseOrderByCreatedAtDesc().size();

                return new DashboardStats(totalOrders, totalRevenue, totalProducts, lowStockProducts, fastMoving,
                                slowMoving,
                                urgentNotifications);
        }
}
