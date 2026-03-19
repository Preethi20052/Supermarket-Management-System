// package com.supermart.model;

// import jakarta.persistence.*;

// @Entity
// public class Product {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String name;
//     private double price;
//     private int stock;
//     private String imageUrl;

//     @Column(length = 1000)
//     private String description;

//     // getters & setters
//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public String getName() {
//         return name;
//     }

//     public void setName(String name) {
//         this.name = name;
//     }

//     public double getPrice() {
//         return price;
//     }

//     public void setPrice(double price) {
//         this.price = price;
//     }

//     public int getStock() {
//         return stock;
//     }

//     public void setStock(int stock) {
//         this.stock = stock;
//     }

//     public String getImageUrl() {
//         return imageUrl;
//     }

//     public void setImageUrl(String imageUrl) {
//         this.imageUrl = imageUrl;
//     }

//     public String getDescription() {
//         return description;
//     }

//     public void setDescription(String description) {
//         this.description = description;
//     }
// }
// package com.supermart.model;

// import jakarta.persistence.*;

// @Entity
// @Table(name = "products")
// public class Product {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String name;
//     private double price;
//     private int stock;
//     private String imageUrl;

//     // 🔹 REQUIRED: Default constructor
//     public Product() {
//     }

//     // 🔹 Getters & Setters
//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public String getName() {
//         return name;
//     }

//     public void setName(String name) {
//         this.name = name;
//     }

//     public double getPrice() {
//         return price;
//     }

//     public void setPrice(double price) {
//         this.price = price;
//     }

//     public int getStock() {
//         return stock;
//     }

//     public void setStock(int stock) {
//         this.stock = stock;
//     }

//     public String getImageUrl() {
//         return imageUrl;
//     }

//     public void setImageUrl(String imageUrl) {
//         this.imageUrl = imageUrl;
//     }
// }

// package com.supermart.model;

// import jakarta.persistence.*;

// @Entity
// public class Product {
//     public Product(String name, String category, double price, int stock, String imageUrl) {
//     this.name = name;
//     this.category = category;
//     this.price = price;
//     this.stock = stock;
//     this.imageUrl = imageUrl;
// }

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String name;
//     private String category;   // ✅ ADD THIS
//     private double price;
//     private int stock;
//     private String imageUrl;

//     // ===== GETTERS & SETTERS =====

//     public Long getId() {
//         return id;
//     }

//     public String getName() {
//         return name;
//     }

//     public void setName(String name) {
//         this.name = name;
//     }

//     public String getCategory() {      // ✅ ADD THIS
//         return category;
//     }

//     public void setCategory(String category) {   // ✅ ADD THIS
//         this.category = category;
//     }

//     public double getPrice() {
//         return price;
//     }

//     public void setPrice(double price) {
//         this.price = price;
//     }

//     public int getStock() {
//         return stock;
//     }

//     public void setStock(int stock) {
//         this.stock = stock;
//     }

//     public String getImageUrl() {
//         return imageUrl;
//     }

//     public void setImageUrl(String imageUrl) {
//         this.imageUrl = imageUrl;
//     }
// }
package com.supermart.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private Double price;
    private Integer stock;
    private String imageUrl;

    // ✅ ADD THESE
    private LocalDate manufactureDate;
    private LocalDate expiryDate;

    // Default constructor (REQUIRED)
    public Product() {
    }

    // Parameterized constructor
    public Product(String name, String category, Double price, Integer stock, String imageUrl,
            LocalDate manufactureDate,
            LocalDate expiryDate) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.manufactureDate = manufactureDate;
        this.expiryDate = expiryDate;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDate getManufactureDate() {
        return manufactureDate;
    }

    public void setManufactureDate(LocalDate manufactureDate) {
        this.manufactureDate = manufactureDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }
}
