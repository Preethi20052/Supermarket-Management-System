// package com.supermart.controller;

// import org.springframework.web.bind.annotation.*;
// import java.util.List;
// import com.supermart.model.Product;
// import com.supermart.service.ProductService;

// @RestController
// @RequestMapping("/api/products")
// @CrossOrigin("http://localhost:3000")
// public class ProductController {

//     private final ProductService service;

//     public ProductController(ProductService service) {
//         this.service = service;
//     }

//     @GetMapping
//     public List<Product> all() {
//         return service.getAll();
//     }

//     @PostMapping
//     public Product add(@RequestBody Product p) {
//         return service.save(p);
//     }

//     @GetMapping("/{id}")
//     public Product get(@PathVariable Long id) {
//         return service.getById(id);
//     }
// }

// package com.supermart.controller;

// import com.supermart.model.Product;
// import com.supermart.service.ProductService;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.File;
// import java.io.IOException;
// import java.util.List;

// @RestController
// @RequestMapping("/api/products")
// @CrossOrigin(origins = "*")
// public class ProductController {

//     private final ProductService service;

//     public ProductController(ProductService service) {
//         this.service = service;
//     }

//     // ADD PRODUCT WITH IMAGE
//     @PostMapping
//     public Product addProduct(
//             @RequestParam String name,
//             @RequestParam String category,
//             @RequestParam double price,
//             @RequestParam int stock,
//             @RequestParam MultipartFile image
//     ) throws IOException {

//         String uploadDir = "uploads/";
//         File uploadPath = new File(uploadDir);
//         if (!uploadPath.exists()) {
//             uploadPath.mkdir();
//         }

//         String fileName = image.getOriginalFilename();
//         image.transferTo(new File(uploadDir + fileName));

//         Product product = new Product(name, category, price, stock, fileName);
//         return service.save(product);
//     }

//     @GetMapping
//     public List<Product> getAll() {
//         return service.getAll();
//     }

//     @PutMapping("/{id}")
//     public Product update(@PathVariable Long id, @RequestBody Product product) {
//         return service.update(id, product);
//     }

//     @DeleteMapping("/{id}")
//     public void delete(@PathVariable Long id) {
//         service.delete(id);
//     }
// }
package com.supermart.controller;

import com.supermart.model.Product;
import com.supermart.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3001")
@RestController
// @CrossOrigin(origins = "*")
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // GET ALL PRODUCTS (Customer View)
    @GetMapping
    public List<Product> getAll() {
        return service.getAll();
    }

    // ADD PRODUCT (Admin)
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return service.save(product);
    }

    // UPDATE PRODUCT (Admin)
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable("id") Long id, @RequestBody Product product) {
        return service.update(id, product);
    }

    // DELETE PRODUCT (Admin)
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable("id") Long id) {
        service.delete(id);
    }
}
