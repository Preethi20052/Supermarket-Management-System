package com.supermart.controller;

import com.supermart.model.Order;
import com.supermart.model.User;
import com.supermart.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "http://localhost:3001")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> payload) {
        try {
            List<Long> cartItemIds = (List<Long>) payload.get("cartItemIds");
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            service.placeOrder(cartItemIds, user);
            return ResponseEntity.ok(Map.of("message", "Order placed successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public List<Order> getAllOrders() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return service.getAllOrders(user);
    }

    @PutMapping("/cancel/{id}")
    public void cancelOrder(@PathVariable("id") Long id) {
        service.cancelOrder(id);
    }

    @PutMapping("/update-status/{id}")
    public void updateOrderStatus(@PathVariable("id") Long id, @RequestParam("status") String status) {
        service.updateStatus(id, status);
    }
}
