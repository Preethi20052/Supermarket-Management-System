package com.supermart.controller;

import com.supermart.model.Notification;
import com.supermart.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/notifications")
@CrossOrigin(origins = "http://localhost:3001")
public class NotificationController {

    private final NotificationRepository repo;

    public NotificationController(NotificationRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Notification> getUnread() {
        return repo.findByIsReadFalseOrderByCreatedAtDesc();
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable("id") Long id) {
        Notification n = repo.findById(id).orElseThrow();
        n.setRead(true);
        repo.save(n);
    }
}
