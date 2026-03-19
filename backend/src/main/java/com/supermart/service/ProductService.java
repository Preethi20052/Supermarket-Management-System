// package com.supermart.service;

// import java.util.List;
// import org.springframework.stereotype.Service;
// import com.supermart.model.Product;
// import com.supermart.repository.ProductRepository;

// @Service
// public class ProductService {

//     private final ProductRepository repo;

//     public ProductService(ProductRepository repo) {
//         this.repo = repo;
//     }

//     public List<Product> getAll() {
//         return repo.findAll();
//     }

//     public Product getById(Long id) {
//         return repo.findById(id).orElse(null);
//     }

//     public Product save(Product p) {
//         return repo.save(p);
//     }

//     public void reduceStock(Long id, int qty) {
//         Product p = getById(id);
//         p.setStock(p.getStock() - qty);
//         repo.save(p);
//     }
// }

// package com.supermart.service;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import com.supermart.model.Product;
// import com.supermart.repository.ProductRepository;

// @Service
// public class ProductService {

//     @Autowired
//     private ProductRepository productRepository;

//     public List<Product> getAllProducts() {
//         return productRepository.findAll();
//     }

//     public Product saveProduct(Product product) {
//         return productRepository.save(product);
//     }

//     public void reduceStock(Long productId, int qty) {
//         Product p = productRepository.findById(productId).orElseThrow();
//         p.setStock(p.getStock() - qty);
//         productRepository.save(p);
//     }
// }

package com.supermart.service;

import com.supermart.model.Product;
import com.supermart.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    // =========================
    // SAVE PRODUCT
    // =========================
    public Product save(Product product) {
        return repo.save(product);
    }

    // =========================
    // GET ALL PRODUCTS
    // =========================
    public List<Product> getAll() {
        return repo.findAll();
    }

    // =========================
    // GET PRODUCT BY ID
    // =========================
    public Product getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // =========================
    // UPDATE PRODUCT
    // =========================
    public Product update(Long id, Product updatedProduct) {

        Product product = getById(id);

        product.setName(updatedProduct.getName());
        product.setCategory(updatedProduct.getCategory());
        product.setPrice(updatedProduct.getPrice());
        product.setStock(updatedProduct.getStock());
        product.setImageUrl(updatedProduct.getImageUrl());
        product.setManufactureDate(updatedProduct.getManufactureDate());
        product.setExpiryDate(updatedProduct.getExpiryDate());

        return repo.save(product);
    }

    // =========================
    // DELETE PRODUCT
    // =========================
    public void delete(Long id) {
        repo.deleteById(id);
    }

    // =========================
    // REDUCE STOCK (For Orders)
    // =========================
    public void reduceStock(Long productId, int quantity) {

        Product product = getById(productId);

        if (product.getStock() < quantity) {
            throw new RuntimeException("Not enough stock available");
        }

        product.setStock(product.getStock() - quantity);

        repo.save(product);
    }
}
