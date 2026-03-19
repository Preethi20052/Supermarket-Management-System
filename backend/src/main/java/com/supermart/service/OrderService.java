package com.supermart.service;

import com.supermart.model.CartItem;
import com.supermart.model.Order;
import com.supermart.model.Product;
import com.supermart.model.User;
import com.supermart.repository.CartRepository;
import com.supermart.repository.OrderRepository;
import com.supermart.repository.ProductRepository;
import com.supermart.repository.UserRepository;
import com.supermart.repository.NotificationRepository;
import com.supermart.model.Notification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final CartRepository cartRepo;
    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final NotificationRepository notificationRepo;
    private final BulkOrderService bulkOrderService;

    public OrderService(CartRepository cartRepo,
            ProductRepository productRepo,
            OrderRepository orderRepo,
            UserRepository userRepo,
            NotificationRepository notificationRepo,
            BulkOrderService bulkOrderService) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.notificationRepo = notificationRepo;
        this.bulkOrderService = bulkOrderService;
    }

    @Transactional
    public void placeOrder(List<Long> cartItemIds, User user) {

        List<CartItem> cartItems;
        if (user == null) {
            throw new RuntimeException("Authenticated user not found");
        }

        if (cartItemIds == null || cartItemIds.isEmpty()) {
            cartItems = cartRepo.findByUser_Id(user.getId());
        } else {
            cartItems = cartRepo.findAllById(cartItemIds).stream()
                    .filter(item -> item.getUser().getId().equals(user.getId()))
                    .collect(java.util.stream.Collectors.toList());
        }

        if (cartItems.isEmpty()) {
            throw new RuntimeException("No items to order");
        }

        for (CartItem item : cartItems) {

            Product product = productRepo.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Not enough stock for " + product.getName());
            }

            product.setStock(product.getStock() - item.getQuantity());
            productRepo.save(product);

            Order order = new Order();
            order.setProductId(item.getProductId());
            order.setProductName(product.getName());
            order.setQuantity(item.getQuantity());
            order.setUnitPrice(product.getPrice());
            order.setTotalPrice(product.getPrice() * item.getQuantity());
            order.setStatus("PLACED");
            order.setOrderDate(LocalDateTime.now());

            order.setCustomerName(user.getName());
            order.setAddress(user.getAddress());
            order.setPhoneNumber(user.getPhone());
            order.setEmail(user.getEmail());

            order.setUser(user);
            orderRepo.save(order);

            // Link to Bulk Order logic if user is in a society
            // (Bulk orders are now handled separately via BulkOrderController)

            // ✅ REAL-TIME NOTIFICATION: Order Placed
            notificationRepo.save(new Notification(
                    "New Order placed for " + product.getName() + " (Qty: " + item.getQuantity() + ")", "ORDER"));

            // ✅ LOW STOCK ALERT
            if (product.getStock() < 10) {
                notificationRepo.save(new Notification(
                        "Low Stock Alert: " + product.getName() + " only " + product.getStock() + " left!", "STOCK"));
            }

            // Remove ordered item from cart
            cartRepo.delete(item);
        }
    }

    public List<Order> getAllOrders(User user) {
        if ("ADMIN".equals(user.getRole().name())) {
            return orderRepo.findAll();
        }
        return orderRepo.findByUser_Id(user.getId());
    }

    public void cancelOrder(Long orderId) {
        Order order = orderRepo.findById(orderId).orElseThrow();

        if ("DELIVERED".equals(order.getStatus()) || "CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order in current status: " + order.getStatus());
        }

        // Restore stock
        Product product = productRepo.findById(order.getProductId()).orElse(null);
        if (product != null) {
            product.setStock(product.getStock() + order.getQuantity());
            productRepo.save(product);
        }

        order.setStatus("CANCELLED");
        orderRepo.save(order);
    }

    public void updateStatus(Long orderId, String status) {
        Order order = orderRepo.findById(orderId).orElseThrow();
        order.setStatus(status);
        orderRepo.save(order);
    }
}
