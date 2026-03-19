package com.supermart.controller;

import com.supermart.dto.BulkOrderResponseDTO;
import com.supermart.dto.BulkOrderParticipantDTO;
import com.supermart.dto.JoinBulkDealRequest;
import com.supermart.dto.UpdateBulkDealRequest;
import com.supermart.model.BulkOrder;
import com.supermart.model.User;
import com.supermart.service.BulkOrderService;
import com.supermart.dto.CreateBulkOrderRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bulk-orders")
@CrossOrigin(origins = "http://localhost:3001")
public class BulkOrderController {

    private final BulkOrderService bulkOrderService;

    public BulkOrderController(BulkOrderService bulkOrderService) {
        this.bulkOrderService = bulkOrderService;
    }

    private User getAuthenticatedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/all")
    public ResponseEntity<List<BulkOrderResponseDTO>> getAllBulkOrders() {
        try {
            User user = getAuthenticatedUser();
            if (user.getRole() != User.Role.ADMIN) {
                 return ResponseEntity.status(403).build();
            }
            List<BulkOrderResponseDTO> deals = bulkOrderService.getAllBulkOrders();
            return ResponseEntity.ok(deals);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/society/{societyId}")
    public ResponseEntity<List<BulkOrderResponseDTO>> getSocietyBulkDeals(@PathVariable Long societyId) {
        try {
            User user = getAuthenticatedUser();
            // Optional: verify user belongs to the requested society
            if (!user.getSocietyId().equals(societyId) && user.getRole() != User.Role.ADMIN) {
                 return ResponseEntity.status(403).build();
            }
            List<BulkOrderResponseDTO> deals = bulkOrderService.getSocietyBulkDeals(societyId, user.getId());
            return ResponseEntity.ok(deals);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBulkOrder(@RequestBody CreateBulkOrderRequest request) {
        try {
            User user = getAuthenticatedUser();
            if (user.getRole() != User.Role.ADMIN) {
                return ResponseEntity.status(403).body(Map.of("message", "Only admins can create bulk orders"));
            }
            BulkOrder bulkOrder = bulkOrderService.createBulkOrder(
                    request.getProductId(),
                    request.getSocietyId(),
                    request.getTargetQuantity(),
                    request.getDiscountPercentage(),
                    request.getStartTime(),
                    request.getEndTime()
            );
            return ResponseEntity.ok(bulkOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinBulkDeal(@RequestBody JoinBulkDealRequest request) {
        try {
            User user = getAuthenticatedUser();
            BulkOrder bulkOrder = bulkOrderService.joinBulkDeal(request.getBulkOrderId(), user.getId(), request.getQuantity());
            return ResponseEntity.ok(bulkOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateContribution(@RequestBody UpdateBulkDealRequest request) {
        try {
            User user = getAuthenticatedUser();
            BulkOrder bulkOrder = bulkOrderService.updateContribution(request.getBulkOrderId(), user.getId(), request.getQuantity());
            return ResponseEntity.ok(bulkOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/leave")
    public ResponseEntity<?> leaveBulkDeal(@RequestParam("bulkOrderId") Long bulkOrderId) {
        try {
            User user = getAuthenticatedUser();
            BulkOrder bulkOrder = bulkOrderService.leaveBulkDeal(bulkOrderId, user.getId());
            return ResponseEntity.ok(bulkOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/participants/{bulkOrderId}")
    public ResponseEntity<List<BulkOrderParticipantDTO>> getParticipants(@PathVariable Long bulkOrderId) {
        try {
            User user = getAuthenticatedUser();
            if (user.getRole() != User.Role.ADMIN) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.ok(bulkOrderService.getParticipants(bulkOrderId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/end/{bulkOrderId}")
    public ResponseEntity<?> endBulkOrder(@PathVariable Long bulkOrderId) {
        try {
            User user = getAuthenticatedUser();
            if (user.getRole() != User.Role.ADMIN) {
                 return ResponseEntity.status(403).build();
            }
            bulkOrderService.endBulkOrder(bulkOrderId);
            return ResponseEntity.ok(Map.of("message", "Bulk deal ended successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{bulkOrderId}")
    public ResponseEntity<?> deleteBulkOrder(@PathVariable Long bulkOrderId) {
        try {
            User user = getAuthenticatedUser();
            if (user.getRole() != User.Role.ADMIN) {
                 return ResponseEntity.status(403).build();
            }
            bulkOrderService.deleteBulkOrder(bulkOrderId);
            return ResponseEntity.ok(Map.of("message", "Bulk deal deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
