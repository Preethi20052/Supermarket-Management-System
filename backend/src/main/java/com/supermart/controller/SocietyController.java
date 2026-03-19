package com.supermart.controller;

import com.supermart.model.*;
import com.supermart.repository.*;
import com.supermart.service.SocietyService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/societies")
@CrossOrigin(origins = "http://localhost:3001")
public class SocietyController {
    private final SocietyRepository societyRepo;
    private final UserRepository userRepo;
    private final BulkOrderRepository bulkOrderRepo;
    private final SocietyService societyService;
    private final SocietyMemberRepository memberRepo;

    public SocietyController(SocietyRepository societyRepo, UserRepository userRepo,
            BulkOrderRepository bulkOrderRepo, SocietyService societyService,
            SocietyMemberRepository memberRepo) {
        this.societyRepo = societyRepo;
        this.userRepo = userRepo;
        this.bulkOrderRepo = bulkOrderRepo;
        this.societyService = societyService;
        this.memberRepo = memberRepo;
    }

    @GetMapping
    public List<Society> getAllSocieties() {
        return societyRepo.findAll();
    }

    @PostMapping("/create")
    public Society createSociety(@RequestBody Society society, @RequestParam Long userId) {
        return societyService.createSociety(society, userId);
    }

    @PostMapping("/join")
    public SocietyMember joinSociety(@RequestParam String inviteCode, @RequestParam Long userId) {
        return societyService.joinSociety(inviteCode, userId);
    }

    @PutMapping("/approve/{memberId}")
    public void approveMember(@PathVariable Long memberId, @RequestParam Long adminId) {
        societyService.approveMember(memberId, adminId);
    }

    @GetMapping("/my-details")
    public java.util.Map<String, Object> getMySocietyDetails(@RequestParam Long userId) {
        SocietyMember member = memberRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User is not in a society"));
        Society society = societyRepo.findById(member.getSocietyId()).orElseThrow();
        List<SocietyMember> members = memberRepo.findBySocietyId(member.getSocietyId());

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("society", society);
        response.put("myRole", member.getRole());
        response.put("members", members);
        return response;
    }


}
