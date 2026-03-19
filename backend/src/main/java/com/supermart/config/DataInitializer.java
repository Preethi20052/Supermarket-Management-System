package com.supermart.config;

import com.supermart.model.User;
import com.supermart.repository.UserRepository;
import com.supermart.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin already exists
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(userService.getPasswordEncoder().encode(adminPassword));
            admin.setPhone("0000000000");
            admin.setAddress("Admin Office");
            admin.setRole(User.Role.ADMIN);

            userRepository.save(admin);
            System.out.println("✓ Default admin account created successfully!");
            System.out.println("  Email: " + adminEmail);
            System.out.println("  Password: " + adminPassword);
        } else {
            System.out.println("✓ Admin account already exists.");
        }
    }
}
