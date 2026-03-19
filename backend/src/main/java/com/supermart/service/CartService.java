package com.supermart.service;

import com.supermart.model.User;
import com.supermart.model.CartItem;
import com.supermart.model.Product;
import com.supermart.repository.CartRepository;
import com.supermart.repository.ProductRepository;
import com.supermart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    public CartService(CartRepository cartRepo, ProductRepository productRepo, UserRepository userRepo) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public CartItem addToCart(User principal, Long productId, int quantity) {
        System.out.println("CartService.addToCart - Principal User: " + principal.getEmail());

        // Re-fetch user from repo to ensure it's managed by the current
        // transaction/session
        User user = userRepo.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < quantity) {
            System.out.println("Insufficient stock for product: " + product.getName());
            throw new RuntimeException("Not enough stock available");
        }

        CartItem item = new CartItem(user, product.getId(), product.getName(), product.getPrice(), quantity);
        CartItem saved = cartRepo.save(item);
        System.out.println("Successfully saved CartItem ID: " + saved.getId() + " for User: " + user.getEmail());
        return saved;
    }

    public List<CartItem> getCartItems(User user) {
        return cartRepo.findByUser_Id(user.getId());
    }

    public List<CartItem> getAllItemsDebug() {
        return cartRepo.findAll();
    }

    @Transactional
    public void clearCart(User user) {
        cartRepo.deleteByUser_Id(user.getId());
    }
}
