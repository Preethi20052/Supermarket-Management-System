package com.supermart.service;

import com.supermart.dto.BulkOrderResponseDTO;
import com.supermart.dto.BulkOrderParticipantDTO;
import com.supermart.model.*;
import com.supermart.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BulkOrderService {
    private final BulkOrderRepository bulkOrderRepo;
    private final BulkOrderParticipantRepository participantRepo;
    private final SocietyRepository societyRepo;
    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;

    public BulkOrderService(BulkOrderRepository bulkOrderRepo, 
                            BulkOrderParticipantRepository participantRepo,
                            SocietyRepository societyRepo, 
                            ProductRepository productRepo,
                            OrderRepository orderRepo,
                            UserRepository userRepo) {
        this.bulkOrderRepo = bulkOrderRepo;
        this.participantRepo = participantRepo;
        this.societyRepo = societyRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
    }

    private void refreshBulkOrderStatuses(List<BulkOrder> orders) {
        LocalDateTime now = LocalDateTime.now();
        for (BulkOrder order : orders) {
            String currentStatus = order.getStatus();
            if ("COMPLETED".equals(currentStatus) || "EXPIRED".equals(currentStatus)) continue;

            if (order.getEndTime() != null && now.isAfter(order.getEndTime())) {
                order.setStatus("EXPIRED");
                bulkOrderRepo.save(order);
            } else if (order.getStartTime() != null && now.isBefore(order.getStartTime())) {
                if (!"UPCOMING".equals(currentStatus)) {
                    order.setStatus("UPCOMING");
                    bulkOrderRepo.save(order);
                }
            } else {
                if (!"ACTIVE".equals(currentStatus)) {
                    order.setStatus("ACTIVE");
                    bulkOrderRepo.save(order);
                }
            }
        }
    }

    private List<BulkOrderResponseDTO> mapToDTOList(List<BulkOrder> orders, Long userId) {
        List<BulkOrderResponseDTO> responseList = new ArrayList<>();
        for (BulkOrder order : orders) {
            if (order.getProductId() == null) continue;
            Product product = productRepo.findById(order.getProductId()).orElse(null);
            if (product != null) {
                BulkOrderResponseDTO dto = new BulkOrderResponseDTO();
                dto.setId(order.getId());
                dto.setSocietyId(order.getSocietyId());
                dto.setProductId(order.getProductId());
                dto.setProductName(product.getName());
                dto.setProductImage(product.getImageUrl());
                dto.setOriginalPrice(product.getPrice());
                dto.setDiscountPercentage(order.getDiscountPercentage());
                dto.setCurrentQuantity(order.getCurrentQuantity());
                dto.setTargetQuantity(order.getTargetQuantity());
                dto.setStatus(order.getStatus());
                dto.setStartTime(order.getStartTime());
                dto.setEndTime(order.getEndTime());

                List<BulkOrderParticipant> participants = participantRepo.findByBulkOrderId(order.getId());
                dto.setParticipantsCount(participants.size());

                if (userId != null) {
                    Optional<BulkOrderParticipant> participant = participantRepo.findByBulkOrderIdAndUserId(order.getId(), userId);
                    dto.setUserContribution(participant.map(BulkOrderParticipant::getQuantity).orElse(0));
                } else {
                    dto.setUserContribution(0);
                }

                responseList.add(dto);
            }
        }
        return responseList;
    }

    public List<BulkOrderResponseDTO> getSocietyBulkDeals(Long societyId, Long userId) {
        List<BulkOrder> allSocietyOrders = bulkOrderRepo.findAll().stream()
                .filter(o -> o.getSocietyId().equals(societyId))
                .toList();
        
        refreshBulkOrderStatuses(allSocietyOrders);
        
        return mapToDTOList(allSocietyOrders, userId);
    }

    public List<BulkOrderResponseDTO> getAllBulkOrders() {
        List<BulkOrder> allOrders = bulkOrderRepo.findAll();
        refreshBulkOrderStatuses(allOrders);
        return mapToDTOList(allOrders, null);
    }

    @Transactional
    public BulkOrder createBulkOrder(Long productId, Long societyId, Integer targetQuantity, Double discountPercentage, LocalDateTime startTime, LocalDateTime endTime) {
        if (productId == null || productId <= 0) throw new RuntimeException("Valid Product ID is required");
        if (societyId == null || societyId <= 0) throw new RuntimeException("Valid Society ID is required");
        
        BulkOrder bulkOrder = new BulkOrder();
        bulkOrder.setProductId(productId);
        bulkOrder.setSocietyId(societyId);
        bulkOrder.setTargetQuantity(targetQuantity);
        bulkOrder.setCurrentQuantity(0);
        bulkOrder.setDiscountPercentage(discountPercentage);
        
        LocalDateTime now = LocalDateTime.now();
        if (startTime != null && now.isBefore(startTime)) {
            bulkOrder.setStatus("UPCOMING");
        } else {
            bulkOrder.setStatus("ACTIVE");
        }
        
        bulkOrder.setStartTime(startTime);
        bulkOrder.setEndTime(endTime);
        bulkOrder.setCreatedAt(now);
        return bulkOrderRepo.save(bulkOrder);
    }

    @Transactional
    public BulkOrder joinBulkDeal(Long bulkOrderId, Long userId, Integer quantity) {
        BulkOrder bulkOrder = bulkOrderRepo.findById(bulkOrderId)
                .orElseThrow(() -> new RuntimeException("Bulk order not found"));

        LocalDateTime now = LocalDateTime.now();
        if (bulkOrder.getEndTime() != null && now.isAfter(bulkOrder.getEndTime())) {
            bulkOrder.setStatus("EXPIRED");
            bulkOrderRepo.save(bulkOrder);
            throw new RuntimeException("Bulk deal has expired");
        }

        if (bulkOrder.getStartTime() != null && now.isBefore(bulkOrder.getStartTime())) {
            throw new RuntimeException("Bulk deal has not started yet");
        }

        if (!"ACTIVE".equals(bulkOrder.getStatus())) {
            throw new RuntimeException("Bulk order is not active");
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getSocietyId().equals(bulkOrder.getSocietyId())) {
            throw new RuntimeException("User does not belong to the society for this bulk deal");
        }

        if (bulkOrder.getCurrentQuantity() + quantity > bulkOrder.getTargetQuantity()) {
            throw new RuntimeException("Quantity exceeds target");
        }

        Optional<BulkOrderParticipant> existingParticipant = participantRepo.findByBulkOrderIdAndUserId(bulkOrderId, userId);

        int newQuantityTotal = bulkOrder.getCurrentQuantity() + quantity;
        if (existingParticipant.isPresent()) {
            BulkOrderParticipant participant = existingParticipant.get();
            participant.setQuantity(participant.getQuantity() + quantity);
            participantRepo.save(participant);
        } else {
            BulkOrderParticipant participant = new BulkOrderParticipant();
            participant.setBulkOrder(bulkOrder);
            participant.setUser(user);
            participant.setQuantity(quantity);
            participantRepo.save(participant);
        }

        bulkOrder.setCurrentQuantity(newQuantityTotal);

        if (bulkOrder.getCurrentQuantity() >= bulkOrder.getTargetQuantity()) {
            completeBulkOrder(bulkOrder);
        } else {
            bulkOrderRepo.save(bulkOrder);
        }

        return bulkOrder;
    }

    @Transactional
    public BulkOrder updateContribution(Long bulkOrderId, Long userId, Integer newQuantity) {
        if (newQuantity <= 0) {
            return leaveBulkDeal(bulkOrderId, userId);
        }

        BulkOrder bulkOrder = bulkOrderRepo.findById(bulkOrderId)
                .orElseThrow(() -> new RuntimeException("Bulk order not found"));

        if (!"ACTIVE".equals(bulkOrder.getStatus())) {
            throw new RuntimeException("Bulk order is not active");
        }

        BulkOrderParticipant participant = participantRepo.findByBulkOrderIdAndUserId(bulkOrderId, userId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        int difference = newQuantity - participant.getQuantity();

        if (bulkOrder.getCurrentQuantity() + difference > bulkOrder.getTargetQuantity()) {
            throw new RuntimeException("New quantity exceeds target");
        }

        participant.setQuantity(newQuantity);
        participantRepo.save(participant);

        bulkOrder.setCurrentQuantity(bulkOrder.getCurrentQuantity() + difference);

        if (bulkOrder.getCurrentQuantity() >= bulkOrder.getTargetQuantity()) {
            completeBulkOrder(bulkOrder);
        } else {
            bulkOrderRepo.save(bulkOrder);
        }

        return bulkOrder;
    }

    @Transactional
    public BulkOrder leaveBulkDeal(Long bulkOrderId, Long userId) {
        BulkOrder bulkOrder = bulkOrderRepo.findById(bulkOrderId)
                .orElseThrow(() -> new RuntimeException("Bulk order not found"));

        if (!"ACTIVE".equals(bulkOrder.getStatus())) {
            throw new RuntimeException("Bulk order is not active");
        }

        BulkOrderParticipant participant = participantRepo.findByBulkOrderIdAndUserId(bulkOrderId, userId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        int quantityToDeduct = participant.getQuantity();
        participantRepo.delete(participant);

        bulkOrder.setCurrentQuantity(bulkOrder.getCurrentQuantity() - quantityToDeduct);
        bulkOrderRepo.save(bulkOrder);

        return bulkOrder;
    }

    private void completeBulkOrder(BulkOrder bulkOrder) {
        bulkOrder.setStatus("COMPLETED");
        bulkOrderRepo.save(bulkOrder);

        List<BulkOrderParticipant> participants = participantRepo.findByBulkOrderId(bulkOrder.getId());
        Product product = productRepo.findById(bulkOrder.getProductId()).orElse(null);

        if (product != null) {
            double discountMultiplier = 1.0 - (bulkOrder.getDiscountPercentage() / 100.0);
            double finalPricePerUnit = product.getPrice() * discountMultiplier;

            for (BulkOrderParticipant participant : participants) {
                Order order = new Order();
                order.setProductId(product.getId());
                order.setProductName(product.getName());
                order.setQuantity(participant.getQuantity());
                order.setUnitPrice(finalPricePerUnit);
                order.setTotalPrice(finalPricePerUnit * participant.getQuantity());
                order.setStatus("PLACED");
                order.setOrderDate(LocalDateTime.now());
                order.setUser(participant.getUser());
                order.setCustomerName(participant.getUser().getName());
                order.setAddress(participant.getUser().getAddress());
                order.setPhoneNumber(participant.getUser().getPhone());
                order.setEmail(participant.getUser().getEmail());

                orderRepo.save(order);
            }
            
            // Reduce stock
            if (product.getStock() != null) {
                product.setStock(Math.max(0, product.getStock() - bulkOrder.getTargetQuantity()));
                productRepo.save(product);
            }
        }
    }

    public List<BulkOrderParticipantDTO> getParticipants(Long bulkOrderId) {
        List<BulkOrderParticipant> participants = participantRepo.findByBulkOrderId(bulkOrderId);
        List<BulkOrderParticipantDTO> dtos = new ArrayList<>();
        for (BulkOrderParticipant p : participants) {
            dtos.add(new BulkOrderParticipantDTO(
                p.getUser().getName(),
                p.getUser().getFlatNumber(),
                p.getQuantity(),
                p.getJoinedAt()
            ));
        }
        return dtos;
    }

    @Transactional
    public void endBulkOrder(Long bulkOrderId) {
        BulkOrder bulkOrder = bulkOrderRepo.findById(bulkOrderId)
                .orElseThrow(() -> new RuntimeException("Bulk order not found"));
        bulkOrder.setStatus("EXPIRED");
        bulkOrder.setEndTime(LocalDateTime.now());
        bulkOrderRepo.save(bulkOrder);
    }

    @Transactional
    public void deleteBulkOrder(Long bulkOrderId) {
        BulkOrder bulkOrder = bulkOrderRepo.findById(bulkOrderId)
                .orElseThrow(() -> new RuntimeException("Bulk order not found"));
        
        // Optionally prevent deleting completed orders or handle participants first
        List<BulkOrderParticipant> participants = participantRepo.findByBulkOrderId(bulkOrderId);
        participantRepo.deleteAll(participants);
        bulkOrderRepo.delete(bulkOrder);
    }
}
