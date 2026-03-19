package com.supermart.service;

import com.supermart.model.Society;
import com.supermart.model.SocietyMember;
import com.supermart.model.User;
import com.supermart.repository.SocietyMemberRepository;
import com.supermart.repository.SocietyRepository;
import com.supermart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class SocietyService {

    private final SocietyRepository societyRepo;
    private final SocietyMemberRepository memberRepo;
    private final UserRepository userRepo;

    public SocietyService(SocietyRepository societyRepo, SocietyMemberRepository memberRepo, UserRepository userRepo) {
        this.societyRepo = societyRepo;
        this.memberRepo = memberRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public Society createSociety(Society society, Long userId) {
        if (societyRepo.existsByNameAndPincode(society.getName(), society.getPincode())) {
            throw new RuntimeException("Society with same name and pincode already exists!");
        }

        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        society.setInviteCode(generateInviteCode());
        society.setCreatedBy(userId);
        society.setCreatedAt(LocalDateTime.now());

        // Default values for bulk orders if not provided
        if (society.getThreshold() == null)
            society.setThreshold(10);
        if (society.getDiscountPercentage() == null)
            society.setDiscountPercentage(5.0);
        if (society.getLocation() == null)
            society.setLocation(society.getCity());

        Society savedSociety = societyRepo.save(society);

        SocietyMember admin = new SocietyMember();
        admin.setUserId(userId);
        admin.setSocietyId(savedSociety.getId());
        admin.setRole(SocietyMember.Role.SOCIETY_ADMIN);
        admin.setStatus(SocietyMember.Status.APPROVED);
        admin.setJoinedAt(LocalDateTime.now());
        memberRepo.save(admin);

        user.setSocietyId(savedSociety.getId());
        userRepo.save(user);

        return savedSociety;
    }

    @Transactional
    public SocietyMember joinSociety(String inviteCode, Long userId) {
        Society society = societyRepo.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Invalid invite code"));

        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getSocietyId() != null) {
            throw new RuntimeException("User already belongs to a society");
        }

        SocietyMember member = new SocietyMember();
        member.setUserId(userId);
        member.setSocietyId(society.getId());
        member.setRole(SocietyMember.Role.MEMBER);
        member.setStatus(SocietyMember.Status.APPROVED);
        member.setJoinedAt(LocalDateTime.now());
        SocietyMember savedMember = memberRepo.save(member);

        user.setSocietyId(society.getId());
        userRepo.save(user);

        return savedMember;
    }

    @Transactional
    public void approveMember(Long memberId, Long adminId) {
        SocietyMember member = memberRepo.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        SocietyMember admin = memberRepo.findByUserId(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != SocietyMember.Role.SOCIETY_ADMIN
                || !admin.getSocietyId().equals(member.getSocietyId())) {
            throw new RuntimeException("Unauthorized to approve members");
        }

        member.setStatus(SocietyMember.Status.APPROVED);
        memberRepo.save(member);
    }

    private String generateInviteCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
