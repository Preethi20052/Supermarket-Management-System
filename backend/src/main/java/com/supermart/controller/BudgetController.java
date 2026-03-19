package com.supermart.controller;

import com.supermart.model.*;
import com.supermart.service.BudgetService;
import com.supermart.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "http://localhost:3001")
public class BudgetController {
    private final BudgetService budgetService;
    private final UserRepository userRepo;

    public BudgetController(BudgetService budgetService, UserRepository userRepo) {
        this.budgetService = budgetService;
        this.userRepo = userRepo;
    }

    @GetMapping("/stats")
    public Map<String, Object> getBudgetStats(@RequestParam String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Double spending = budgetService.calculateMonthlySpending(email);

        return Map.of(
                "budget", user.getMonthlyBudget() != null ? user.getMonthlyBudget() : 0.0,
                "spending", spending,
                "remaining", (user.getMonthlyBudget() != null ? user.getMonthlyBudget() : 0.0) - spending);
    }

    @PostMapping("/set")
    public User setBudget(@RequestParam String email, @RequestParam Double budget) {
        User user = userRepo.findByEmail(email).orElseThrow();
        user.setMonthlyBudget(budget);
        return userRepo.save(user);
    }

    @GetMapping("/alternatives/{productId}")
    public List<Product> getAlternatives(@PathVariable Long productId) {
        return budgetService.getCheaperAlternatives(productId);
    }
}
