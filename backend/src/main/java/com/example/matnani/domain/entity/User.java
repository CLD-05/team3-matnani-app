package com.example.matnani.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import javax.swing.plaf.synth.Region;

import com.example.matnani.domain.enums.Enums.*;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String nickname;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    @Builder.Default
    private Integer noShowCount = 0;

    private LocalDateTime purchaseRestrictedUntil;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void updateRegion(Region region) {
        this.region = region;
    }

    public boolean isPurchaseRestricted() {
        return purchaseRestrictedUntil != null && purchaseRestrictedUntil.isAfter(LocalDateTime.now());
    }

    public void addNoShowPenalty() {
        this.noShowCount = (this.noShowCount == null ? 0 : this.noShowCount) + 1;
        if (this.noShowCount >= 2) {
            this.purchaseRestrictedUntil = LocalDateTime.now().plusDays(7);
        }
    }

    public void setNoShowCount(int count) {
        this.noShowCount = count;
    }

    public void setBannedUntil(LocalDateTime date) {
        this.purchaseRestrictedUntil = date;
    }

}
