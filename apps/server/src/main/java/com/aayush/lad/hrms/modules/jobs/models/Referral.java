package com.aayush.lad.hrms.modules.jobs.models;

import java.util.HashSet;
import java.util.Set;

import com.aayush.lad.hrms.modules.jobs.enums.ReferralStatus;
import com.aayush.lad.hrms.modules.user.models.User;
import com.aayush.lad.hrms.shared.base_models.BaseModel;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "referrals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Referral extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_opening_id", nullable = false)
    private JobOpening jobOpening;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referred_by_id", nullable = false)
    private User referredBy;

    @Column(nullable = false)
    private String name;

    private String email;

    @Column(nullable = false)
    private String cvUrl;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ReferralStatus status = ReferralStatus.NEW;

    @OneToMany(mappedBy = "referral", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ReferralStatusAudit> statusAudits = new HashSet<>();
}
