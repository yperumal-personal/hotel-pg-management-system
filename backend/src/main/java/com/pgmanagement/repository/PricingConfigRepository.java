package com.pgmanagement.repository;

import com.pgmanagement.model.PricingConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PricingConfigRepository extends JpaRepository<PricingConfig, Long> {
    Optional<PricingConfig> findByPlanType(PricingConfig.PlanType planType);
}
