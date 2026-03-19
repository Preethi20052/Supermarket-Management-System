package com.supermart.controller;

import com.supermart.model.CartItem;
import com.supermart.model.User;
import com.supermart.service.CartService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3001")
public class CartController {

    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public CartItem addToCart(@RequestBody Map<String, Object> payload) {
        Long productId = Long.valueOf(payload.get("productId").toString());
        int quantity = Integer.parseInt(payload.get("quantity").toString());

        System.out.println("Received add to cart request - Product: " + productId + ", Quantity: " + quantity);

        User user = (User) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        System.out.println(
                "Adding to cart - User: " + user.getEmail() + " (ID: " + user.getId() + "), Product: " + productId);
        return service.addToCart(user, productId, quantity);
    }

    @GetMapping
    public List<CartItem> getCart() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println("Fetching cart - User: " + user.getEmail() + " (ID: " + user.getId() + ")");
        List<CartItem> items = service.getCartItems(user);
        System.out.println("Cart items found for user ID " + user.getId() + ": " + items.size());
        if (items.size() > 0) {
            System.out.println("First item: " + items.get(0).getProductName());
        }
        return items;
    }

    @GetMapping("/all-debug")
    public List<CartItem> getAllItemsDebug() {
        return service.getAllItemsDebug();
    }

    @DeleteMapping("/clear")
    public void clearCart() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        service.clearCart(user);
    }
}
